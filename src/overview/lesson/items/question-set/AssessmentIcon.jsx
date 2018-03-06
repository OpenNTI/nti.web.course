import React from 'react';
import PropTypes from 'prop-types';


class Score extends React.Component {
	static propTypes = {
		score: PropTypes.number,

		width: PropTypes.number,
		height: PropTypes.number,
		inlinePercent: PropTypes.number,
		colors: PropTypes.arrayOf(PropTypes.string),
		pixelDensity: PropTypes.number,
	}

	static defaultProps = {
		inlinePercent: true,
		colors: ['#40b450', '#b8b8b8'],
		pixelDensity: (global.devicePixelRatio || 1) * 2,
		width: 60,
		height: 60
	}

	state = {
		series: []
	}

	attachRef = x => {
		this.canvas = x;

		this.draw();
	}

	componentWillReceiveProps (nextProps) {
		this.setupFor(nextProps);
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	setupFor (props = this.props) {
		const score = Math.max(0, Math.min(100, parseInt(props.score, 10)));

		this.setState({
			score,
			series: [
				{value: score, label: 'Score'},
				{value: 100 - score, label: ''}
			]
		});
	}


	componentDidUpdate () {
		this.draw();
	}


	getTotal () {
		return this.state.series.reduce((sum, i) => sum + i.value, 0);
	}


	getStrokeWidth () {
		const {pixelDensity} = this.props;

		return 3 * pixelDensity;
	}


	getRadius (ctx) {
		const {width, height} = ctx.canvas;
		const leg = Math.min(width, height) + this.getStrokeWidth();

		return Math.ceil(leg / 2);
	}


	draw () {
		if (!this.canvas) { return; }

		const {series} = this.state;
		const ctx = this.canvas.getContext('2d');

		ctx.canvas.width += 0; // set the canvas dirty and make it clear on next draw.

		ctx.save();

		try {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
			ctx.rotate(-(Math.PI / 2));

			for (let i = 0; i < series.length; i++) {
				this.drawSegment(ctx, series, i);
			}

			this.drawLabel(ctx);
		} finally {
			ctx.restore();
		}
	}

	drawSegment (ctx, series, i) {
		ctx.save();

		try {
			const {value} = series[i];
			const radius = this.getRadius(ctx);
			const total = this.getTotal();

			const percent = value / total;

			const startingAngle = percentToRadians(sumTo(series, i) / total);
			const arcSize = percentToRadians(percent);
			const endingAngle = startingAngle + arcSize;
			const endingRadius = radius * 0.7;


			ctx.beginPath();

			ctx.moveTo(endingRadius * Math.cos(startingAngle),
				endingRadius * Math.sin(startingAngle));

			ctx.arc(0, 0, radius, startingAngle, endingAngle, false);
			ctx.arc(0, 0, endingRadius, endingAngle, startingAngle, true);

			ctx.closePath();

			ctx.fillStyle = this.props.colors[i % this.props.colors.length];
			ctx.fill();

			ctx.lineWidth = this.getStrokeWidth();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.strokeStyle = '#000';
			ctx.stroke();
		} finally {
			ctx.restore();
		}

	}


	drawLabel (ctx) {
		const draw = (text, f, ...xy) => {
			ctx.save();

			try {
				setFont(ctx, f);

				//stroke out
				ctx.save();
				ctx.lineWidth = this.getStrokeWidth();
				ctx.globalCompositeOperation = 'destination-out';
				ctx.strokeText(text, ...xy);
				ctx.fillText(text, ...xy);
				ctx.restore();

				ctx.fillText(text, ...xy);
			} finally {
				ctx.restore();
			}
		};

		const measureText = (text, f) => {
			ctx.save();

			try {
				setFont(ctx, f);
				return ctx.measureText(text);
			} finally {
				ctx.restore();
			}
		};

		ctx.save();

		try {
			const {inlinePercent} = this.props;
			const {score} = this.state;
			const {width, height} = ctx.canvas;
			const centerX = width / 2;
			const centerY = height / 2;
			const radius = this.getRadius(ctx) * 0.68;

			const font = {size: Math.floor(radius) * 0.75, weight: '600'};
			const percent = {size: font.size * 0.6, weight: '700'};

			ctx.setTransform(1, 0, 0, 1, centerX, centerY);
			ctx.fillStyle = this.props.colors[score ? 0 : 1];
			ctx.lineWidth = 0;

			let scoreLabel;

			if (inlinePercent) {
				scoreLabel = `${score}%`;
			} else {
				scoreLabel = score;
				ctx.setTransform(1, 0, 0, 1, centerX - (measureText('%', percent).width / 2), centerY);
			}

			const textbox = measureText(scoreLabel, font);
			const xy = [-textbox.width / 2, font.size / 3];

			ctx.globalAlpha = 0.8;
			draw(scoreLabel, font, ...xy);

			if (!inlinePercent) {
				draw('%', ...[textbox.width / 2, 0]);
			}

		} finally {
			ctx.restore();
		}
	}


	render () {
		const {width, height, pixelDensity} = this.props;
		const style = {
			width: `${width}px`,
			height: `${height}px`
		};

		return (
			<canvas
				className="nti-score"
				ref={this.attachRef}
				style={style}
				width={width * pixelDensity}
				height={height * pixelDensity}
			/>
		);
	}
}

function sumTo (data, i) {
	let sum = 0, j = 0;
	for (j; j < i; j++) {
		sum += data[j].value;
	}
	return sum;
}

function percentToRadians (percent) { return ((percent * 360) * Math.PI) / 180; }

function setFont (context, font) {
	context.font = [
		font.style || 'normal',
		font.variant || 'normal',
		font.weight || 'normal',
		(font.size || 10) + 'px',
		font.family || '"Open Sans"'
	].join(' ');
}


LessonOverviewQuestionSetAssessmentIcon.propTypes = {
	assessment: PropTypes.object,
	assessmentSubmission: PropTypes.object
};
export default function LessonOverviewQuestionSetAssessmentIcon ({assessment, assessmentSubmission}) {
	return (
		<Score score={assessmentSubmission ? assessmentSubmission.getScore() : 0} />
	);
}

import React from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './PieChart.css';

const cx = classnames.bind(styles);

const data = Array.from({length: 4}).reduce((acc, _, i, {length}) => {
	const percent = i === length - 1 ? acc.remaining : Math.random() * acc.remaining;
	acc.remaining -= percent;
	acc.result.push({
		label: `Item ${i}`,
		percent
	});
	return acc;
}, { remaining: 1, result: [] }).result;

// const data = Array.from({length: 5}, () => ({percent: 0.2}));

const d2r = d => d * (Math.PI / 180);
const r2d = r => r / (Math.PI / 180);

// find the angle that will produce an arc of a given length at a given radius
// using this to allow for gaps between the segments. returns angle in radians
// arcLength = radius * angleInRadians
const angleForArcLength = (arcLength, atRadius) => arcLength / atRadius;

const size = 100;
const center = size / 2;
const hole = 40;
const thickness = (size - hole) / 2;
const radius = (size - thickness) / 2;
const radiusOuter = size / 2;
const radiusInner = radiusOuter - thickness;
const gapSize = 1;
const gapAngleOffsetInner = r2d(angleForArcLength(gapSize, radiusInner));
const gapAngleOffsetOuter = r2d(angleForArcLength(gapSize, radiusOuter));
const minimumAngleDeg = r2d(angleForArcLength(gapSize * 2, radiusInner));
const minimumValue = minimumAngleDeg / 360;
const colors = [
	'red', 'green', 'blue', 'grey', 'black'
];


const coords = (deg, r = radius) => {
	const rad = d2r(deg);

	return [
		center - Math.cos(rad) * r,
		center - Math.sin(rad) * r
	];
};


export default class PieChart extends React.Component {

	makePath = ({paths, subtotal: prevSubtotal}, {percent}, i) => {
		const startAngle = prevSubtotal * 360 + 90;
		const endAngle = startAngle + (percent * 360);
		const subtotal = prevSubtotal + percent;

		const [x1, y1] = coords(startAngle);
		const [x2, y2] = coords(endAngle);

		const largeArc = percent > 0.5 ? 1 : 0;
		const sweep = 1;

		paths.push(
			<path
				fill="none"
				stroke={colors[i % colors.length]}
				strokeWidth={thickness}
				d={`
					M${x1} ${y1}
					A ${radius} ${radius} 0 ${largeArc} ${sweep} ${x2} ${y2}
				`}
			/>
		);
		return {
			paths,
			subtotal
		};
	}

	makeSegment ({paths, subtotal: prevSubtotal}, {percent}, i) {
		const startAngle = prevSubtotal * 360 + 90;
		const endAngle = startAngle + (percent * 360);
		const subtotal = prevSubtotal + percent;
		const innerAngleOffset = percent >= minimumValue ? gapAngleOffsetInner : 0;
		const outerAngleOffset = percent >= minimumValue ? gapAngleOffsetOuter : 0;

		const startAngleInner = startAngle + innerAngleOffset;
		const startAngleOuter = startAngle + outerAngleOffset;
		const endAngleInner = endAngle - innerAngleOffset;
		const endAngleOuter = endAngle - outerAngleOffset;

		const [x1, y1] = coords(startAngleInner, radiusInner);
		const [x2, y2] = coords(startAngleOuter, radiusOuter);
		const [x3, y3] = coords(endAngleOuter, radiusOuter);
		const [x4, y4] = coords(endAngleInner, radiusInner);

		const largeArc = percent > 0.5 ? 1 : 0;
		const sweepOuter = 1;
		const sweepInner = 0;

		paths.push(
			<path
				fill={colors[i % colors.length]}
				stroke="none"
				d={`
					M${x1} ${y1}
					L${x2} ${y2}
					A ${radiusOuter} ${radiusOuter} 0 ${largeArc} ${sweepOuter} ${x3} ${y3}
					L${x4} ${y4}
					A ${radiusInner} ${radiusInner} 0 ${largeArc} ${sweepInner} ${x1} ${y1}
				`}
			/>
		);

		return {
			paths,
			subtotal
		};
	}

	render () {
		return (
			<div className={cx('pie-chart')}>
				<svg width="250" height="250" viewBox={`0 0 ${size} ${size}`}>
					{
						data.reduce(this.makeSegment, {paths: [], subtotal: 0}).paths
					}
				</svg>
			</div>
		);
	}
}
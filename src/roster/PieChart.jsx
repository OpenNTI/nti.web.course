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
}, {remaining: 1, result: []}).result;

const d2r = d => d * (Math.PI / 180);

const size = 100;
const center = size / 2;
const hole = 40;
const thickness = (size - hole) / 2;
const radius = (size - thickness) / 2;
const colors = [
	'red', 'green', 'blue', 'grey'
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

	render () {
		return (
			<div className={cx('pie-chart')}>
				<svg width="250" height="250" viewBox={`0 0 ${size} ${size}`}>
					{
						data.reduce(this.makePath, {paths: [], subtotal: 0}).paths
					}
				</svg>
			</div>
		);
	}
}
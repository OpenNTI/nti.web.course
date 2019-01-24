import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './PieChart.css';

const cx = classnames.bind(styles);

// sample/test data
// const data = Array.from({length: 5}).reduce((acc, _, i, {length}) => {
// 	const percent = i === length - 1 ? acc.remaining : Math.random() * acc.remaining;
// 	acc.remaining -= percent;
// 	acc.result.push({
// 		label: `Item ${i}`,
// 		percent
// 	});
// 	return acc;
// }, { remaining: 1, result: [] }).result;

// const length = 12;
// const data = Array.from({length}, () => ({percent: 1 / length}));

// convert between radians and degrees
const d2r = d => d * (Math.PI / 180);
const r2d = r => r / (Math.PI / 180);

/**
 * find the angle that will produce an arc of a given length at a given radius
 * using this to allow for gaps between the segments. returns angle in radians
 * arcLength = radius * angleInRadians
 * 
 * @param {number} arcLength - the sought arc length in local coordinate space
 * @param {number} atRadius - the radius of the arc
 * @returns {number} - the angle in radians of an arc of the given length at the given radius
 */
const angleForArcLength = (arcLength, atRadius) => arcLength / atRadius;

/**
 * The viewBox size. Coordinates are computed within this coordinate space
 */
const size = 100;

/**
 * The center of the viewBox, center of the chart
 */
const center = size / 2;

/**
 * The diameter of the chart's inner hole in local coordinate space units
 */
const hole = 40;

/**
 * The thickness of the chart segments for the given size and hole
 */
const thickness = (size - hole) / 2;

/**
 * The outer radius of the chart
 */
const radiusOuter = size / 2;

/**
 * The inner radius of the chart
 */
const radiusInner = radiusOuter - thickness;

/**
 * The size of the gap between chart segments, in local coordinate space units
 */
const gapSize = 1;

/**
 * Compute the angle offset required to establish the gaps between segments at the inner edge
 */
const gapAngleOffsetInner = r2d(angleForArcLength(gapSize, radiusInner));

/**
 * Compute the angle offset required to establish the gaps between segments at the outer edge
 */
const gapAngleOffsetOuter = r2d(angleForArcLength(gapSize, radiusOuter));

/**
 * The minimum angle that won't be swallowed by the gap offsets at the inner edge.
 * Used to compute the minimum value that won't get swallowed (minimumValue defined below)
 */
const minimumAngleDeg = r2d(angleForArcLength(gapSize * 2, radiusInner));

/**
 * The minimum value that won't get swallowed by the gap offsets at the inner edge
 */
const minimumValue = minimumAngleDeg / 360;


/**
 * Computes an x/y coordinate for the given angle and radius
 * @param {number} deg - The angle in degrees
 * @param {number} r  - The radius
 * @returns {Array} - An x/y coordinate for the point at the given angle and radius
 */
const coords = (deg, r) => {
	const rad = d2r(deg);

	return [
		center - Math.cos(rad) * r,
		center - Math.sin(rad) * r
	];
};


export default class PieChart extends React.Component {

	static propTypes = {
		series: PropTypes.arrayOf(
			PropTypes.shape({
				value: PropTypes.number.isRequired,
				label: PropTypes.string,
				color: PropTypes.string
			})
		),
		colors: PropTypes.arrayOf(
			PropTypes.string
		)
	}

	makeSegment = ({paths, subtotal}, {percent, color}, i) => {
		const {colors = []} = this.props;
		const startAngle = subtotal * 360 + 90; // +90 so we start at 12 o'clock
		const endAngle = startAngle + (percent * 360);

		// no gaps for values beneath the minimum threshold
		const useGap = percent >= minimumValue;
		const innerGap = useGap ? gapAngleOffsetInner : 0;
		const outerGap = useGap ? gapAngleOffsetOuter : 0;

		const startAngleInner = startAngle + innerGap;
		const startAngleOuter = startAngle + outerGap;
		const endAngleInner = endAngle - innerGap;
		const endAngleOuter = endAngle - outerGap;

		const [x1, y1] = coords(startAngleInner, radiusInner); // start point on inner circle
		const [x2, y2] = coords(startAngleOuter, radiusOuter); // start point on outer circle
		const [x3, y3] = coords(endAngleOuter, radiusOuter); // end point on outer circle
		const [x4, y4] = coords(endAngleInner, radiusInner); // end point on inner circle

		const largeArc = percent > 0.5 ? 1 : 0;
		const sweepOuter = 1;
		const sweepInner = 0;

		const commands = [
			// move to start angle coordinate, inner radius
			`M${ x1 } ${ y1 }`,

			// line to start angle coordinate, outer radius
			`L${ x2 } ${ y2 }`,

			// arc to end angle coordinate, outer radius
			`A${ radiusOuter } ${ radiusOuter } 0 ${ largeArc } ${ sweepOuter } ${ x3 } ${ y3 }`,

			// line to end angle coordinate, inner radius
			`L${ x4 } ${ y4 }`,

			// arc back to start angle coordinate, inner radius
			`A${ radiusInner } ${ radiusInner } 0 ${ largeArc } ${ sweepInner } ${ x1 } ${ y1 }`
		];
		
		const fill = color || colors[i % colors.length];
		const fillProp = fill ? {fill} : {};

		paths.push(
			<path
				className={cx('segment')}
				{...fillProp}
				stroke="none"
				d={commands.join(' ')}
			/>
		);

		return {
			paths,
			subtotal: subtotal + percent
		};
	}

	computePercentages () {
		const {series} = this.props;

		// eliminate values of zero or less; protects against division by zero when computing percentages
		const filtered = (series || []).filter(({value}) => value > 0);
		const total = filtered.reduce((t, {value = 0}) => t + value, 0);

		return filtered.map(item => ({
			...item,
			percent: item.value / total
		}));
	}

	render () {
		const {className} = this.props;
		const items = this.computePercentages();

		return !(items || []).length ? null : (
			<div className={cx('pie-chart', className)}>
				<svg width="250" height="250" viewBox={`0 0 ${size} ${size}`}>
					{
						items.reduce(this.makeSegment, {paths: [], subtotal: 0}).paths
					}
				</svg>
			</div>
		);
	}
}
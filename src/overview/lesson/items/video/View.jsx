import React from 'react';
import PropTypes from 'prop-types';

import { Grid, List } from '../../Constants';
import Registry from '../Registry';
import PaddedContainer from '../../common/PaddedContainer';

import ListCmp from './List';
import GridCmp from './Grid';

export default class LessonOverviewVideo extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([Grid, List]),
	};

	render() {
		const { layout, ...otherProps } = this.props;

		const Cmp = layout === List ? ListCmp : GridCmp;

		if (layout === List) {
			return <Cmp layout={layout} {...otherProps} />;
		}

		return (
			<PaddedContainer className="single-video-item">
				<Cmp layout={layout} {...otherProps} />
			</PaddedContainer>
		);
	}
}

Registry.register('application/vnd.nextthought.ntivideo')(LessonOverviewVideo);

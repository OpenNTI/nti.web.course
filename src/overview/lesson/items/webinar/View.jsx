import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';
import { List } from '../../Constants';
import Registry from '../Registry';

import BaseItem from './BaseItem';

export default class LessonOverviewWebinarAsset extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		item: PropTypes.object.isRequired,
		layout: PropTypes.any,
	};

	render() {
		const { layout, ...otherProps } = this.props;

		return (
			<PaddedContainer>
				<BaseItem {...otherProps} isMinimal={layout === List} />
			</PaddedContainer>
		);
	}
}

Registry.register('application/vnd.nextthought.webinarasset')(
	LessonOverviewWebinarAsset
);

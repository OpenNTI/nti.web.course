import React from 'react';
import PropTypes from 'prop-types';

import Base from '../../common/BaseListItem';

export default class LessonOverviewScormListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		requiredLabel: PropTypes.node,
		completionLabel: PropTypes.node
	}


	render () {
		const {item, completionLabel, requiredLabel, ...otherProps} = this.props;

		return (
			<Base
				{...otherProps}
				className="lesson-overview-scorm-list-item"
				item={item}
				labels={[
					completionLabel,
					requiredLabel
				]}
			/>
		);
	}
}
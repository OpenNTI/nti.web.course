import './Group.scss';
import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';
import Registry from '../Registry';
import View from '../View';

import {COLLATED_MIME_TYPE, DiscussionGroup} from './Collator';

export default
@Registry.register(COLLATED_MIME_TYPE)
class Group extends React.Component {
	static propTypes = {
		item: PropTypes.instanceOf(DiscussionGroup),
		course: PropTypes.object,
		layout: PropTypes.any
	}

	render () {
		const {item: {Items: items}, ...props} = this.props;
		return (
			<PaddedContainer>
				<View className="lesson-overview-collated-discussion-grid-items" items={items} {...props}/>
			</PaddedContainer>
		);
	}
}

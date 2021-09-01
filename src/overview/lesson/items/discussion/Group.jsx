import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';
import Registry from '../Registry';
import View from '../View';

import { COLLATED_MIME_TYPE, DiscussionGroup } from './Collator';

const GridView = styled(View)`
	& > li {
		display: inline-block;
		margin: 5px 5px 5px 0;
	}

	& > li:nth-child(3n + 3) {
		margin-right: 0;
	}
`;

export default class Group extends React.Component {
	static propTypes = {
		item: PropTypes.instanceOf(DiscussionGroup),
		course: PropTypes.object,
		layout: PropTypes.any,
	};

	render() {
		const {
			item: { Items: items },
			...props
		} = this.props;
		return (
			<PaddedContainer>
				<GridView
					{...props}
					className="lesson-overview-collated-discussion-grid-items"
					items={items}
				/>
			</PaddedContainer>
		);
	}
}

Registry.register(COLLATED_MIME_TYPE)(Group);

import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import Registry from './Registry';

@Registry.register('application/vnd.nextthought.relatedworkref')
export default class RelatedWorkRefProgressItem extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}


	render () {
		const {item} = this.props;

		return (
			<Base item={item} className="related-work-ref-progress-item" renderIcon={this.renderIcon}/>
		);
	}


	renderIcon = () => {
		const {item} = this.props;
		const {icon} = item;

		return (
			<div className="related-work-ref-progress-item-icon">
				<img src={icon} />
			</div>
		);
	}
}

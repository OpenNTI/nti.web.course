import React from 'react';
import PropTypes from 'prop-types';

import CompletionMonitor from '../common/CompletionMonitor';

import Registry from './Registry';

const registry = Registry.getInstance();

export default class LessonOverviewItem extends React.Component {
	static canRender (item) {
		return !!registry.getItemFor(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object,
		index: PropTypes.number,
		itemRef: PropTypes.func,
		readOnly: PropTypes.bool
	}


	render () {
		const {item, index, itemRef, readOnly, ...otherProps} = this.props;
		const Cmp = registry.getItemFor(item.MimeType);

		if (itemRef) {
			otherProps.ref = x => itemRef(index, x);
		}



		return (
			<CompletionMonitor {...otherProps} item={item} readOnly={readOnly} component={Cmp} index={index}/>
		);
	}
}

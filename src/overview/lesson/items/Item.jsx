import React from 'react';
import PropTypes from 'prop-types';
import {Hooks} from 'nti-web-session';
import {HOC} from 'nti-web-commons';

import Registry from './Registry';

const registry = Registry.getInstance();

export default
@Hooks.afterBatchEvents()
class LessonOverviewItem extends React.Component {
	static canRender (item) {
		return !!registry.getItemFor(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object,
		index: PropTypes.number,
		itemRef: PropTypes.func
	}

	afterBatchEvents (events) {
		const {item} = this.props;

		const possibleIDs = {
			[item.NTIID]: true,
			[item['Target-NTIID']]: true,
			[item['target-NTIID']]: true,
			[item.href]: true
		};
		const shouldUpdate = events.some(event => possibleIDs[event.ResourceID]);

		if (!shouldUpdate) { return; }

		this.setupFor(this.props);
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (oldProps) {
		const {item:oldItem} = oldProps;
		const {item:newItem} = this.props;

		if (oldItem !== newItem) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {item} = props;

		if (item.updateCompletedState) {
			item.updateCompletedState();
		}
	}


	render () {
		const {item, index, itemRef, ...otherProps} = this.props;
		const Cmp = registry.getItemFor(item.MimeType);

		if (itemRef) {
			otherProps.ref = x => itemRef(index, x);
		}

		return (
			<HOC.ItemChanges item={item}>
				{
					Cmp ?
						(<Cmp {...otherProps} index={index} item={item} />) :
						(<span>MissingItem: {item.MimeType}</span>)
				}
			</HOC.ItemChanges>
		);
	}
}

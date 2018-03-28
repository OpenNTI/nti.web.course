import React from 'react';
import PropTypes from 'prop-types';
import {InactivityMonitor} from 'nti-lib-dom';
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
		const shouldUpdate = events.some(event => possibleIDs[event.ResourceId]);

		this.isDirty = this.isDirty || shouldUpdate;

		if (this.becameActive) {
			this.setupFor(this.props);
		}
	}


	componentDidMount () {
		const monitor = this.activeStateMonitor = new InactivityMonitor();
		this.unsubscribe = monitor.addChangeListener(this.onActiveStateChanged);
		this.onActiveStateChanged(true);

		this.setupFor(this.props);
	}


	componentWillUnmount () {
		this.unsubscribe();
		this.unsubscribe = () => {};

		this.unmounted = true;
		this.setState = () => {};

		this.onActiveStateChanged(false);
	}


	componentDidUpdate (oldProps) {
		const {item:oldItem} = oldProps;
		const {item:newItem} = this.props;

		if (oldItem !== newItem || this.isDirty) {
			this.setupFor(this.props);
		}
	}


	onActiveStateChanged = (active) => {
		if (active) {
			if (this.isDirty) {
				this.setupFor(this.props);
			} else if (!this.isActive) {
				this.becameActive = true;
			}
		}

		this.isActive = active;
	}


	setupFor (props) {
		const {item} = props;

		if (item.updateCompletedState) {
			item.updateCompletedState();
		}

		delete this.isDirty;
		delete this.becameActive;
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

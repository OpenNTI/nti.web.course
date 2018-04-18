import React from 'react';
import PropTypes from 'prop-types';
import {InactivityMonitor} from '@nti/lib-dom';
import {Hooks} from '@nti/web-session';
import {HOC} from '@nti/web-commons';

export default
@Hooks.afterBatchEvents()
class CompletionMonitor extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		readOnly: PropTypes.bool,
		component: PropTypes.node
	}

	afterBatchEvent (events) {
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
		const {item, readOnly} = props;

		if (item.updateCompletedState && !readOnly) {
			item.updateCompletedState();
		}

		delete this.isDirty;
		delete this.becameActive;
	}


	render () {
		const {component:Cmp, item, ...otherProps} = this.props;

		return (
			<Wrap item={item}>
				<Cmp {...otherProps} item={item} />
			</Wrap>
		);
	}
}


Wrap.propTypes = {
	children: PropTypes.node,
	item: PropTypes.object,
};
function Wrap (props) {
	const {item, children} = props;
	return item.addListener ? (
		<HOC.ItemChanges {...props}/>
	) : (
		React.Children.only(children)
	);
}

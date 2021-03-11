import React from 'react';
import PropTypes from 'prop-types';

import { Error } from '@nti/web-commons';
import { reportError } from '@nti/web-client';

import CompletionMonitor from '../common/CompletionMonitor';

import Registry from './Registry';

const registry = Registry.getInstance();

export default class LessonOverviewItem extends React.Component {
	static canRender(item) {
		return !!registry.getItemFor(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object,
		index: PropTypes.number,
		itemRef: PropTypes.func,
		readOnly: PropTypes.bool,
	};

	state = {};

	componentDidCatch(error) {
		reportError(error);
		this.setState({ error });
	}

	render() {
		const {
			props: { item, index, itemRef, readOnly, ...otherProps },
			state: { error },
		} = this;

		if (error) {
			return (
				<Error error={error} inline>
					There was an error attempting to render:{' '}
					{(item || {}).MimeType || 'Unknown Item'}
				</Error>
			);
		}

		const Cmp = registry.getItemFor(item.MimeType);

		if (itemRef) {
			otherProps.ref = x => itemRef(index, x);
		}

		return (
			<CompletionMonitor
				{...otherProps}
				item={item}
				readOnly={readOnly}
				component={Cmp}
				index={index}
			/>
		);
	}
}

import PropTypes from 'prop-types';

import { useChanges } from '@nti/web-core';

import CompletionMonitor from '../common/CompletionMonitor';

import Registry from './Registry';
import { ErrorBoundary } from './ErrorBoundary';

const registry = Registry.getInstance();

LessonOverviewItem.canRender = item => {
	return !!registry.getItemFor(item.MimeType);
};

LessonOverviewItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
	itemRef: PropTypes.func,
	readOnly: PropTypes.bool,
};

export default function LessonOverviewItem(props) {
	return (
		<ErrorBoundary
			render={() => (
				<>
					There was an error attempting to render:{' '}
					{(props.item || {}).MimeType || 'Unknown Item'}
				</>
			)}
		>
			<LessonOverviewItemContent {...props} />
		</ErrorBoundary>
	);
}

function LessonOverviewItemContent({
	item,
	index,
	itemRef,
	readOnly,
	...otherProps
}) {
	useChanges(item);
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

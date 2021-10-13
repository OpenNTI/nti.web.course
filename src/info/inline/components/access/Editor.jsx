import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Radio } from '@nti/web-commons';

import { getAvailableTypes } from './types';
import OverviewContainer from './components/OverviewContainer';
import RadioGroup from './components/RadioGroup';
import ErrorMessage from './components/Error';

const RadioGroupName = 'course-access-option';

CourseAccessEditor.propTypes = {
	catalogEntry: PropTypes.object,
	onValueChange: PropTypes.func,
	error: PropTypes.any,
};
export default function CourseAccessEditor({
	catalogEntry,
	onValueChange,
	error,
}) {
	const [pending, setPending] = useState({});

	const updatePending = update => {
		const newPending = { ...pending, ...update };

		onValueChange('access', newPending);
		setPending(newPending);
	};

	const available = getAvailableTypes(catalogEntry);
	const Editor = available.find(a => a.Name === pending.active)?.Editor;

	useEffect(() => {
		const active = available.find(a => a.isActive(catalogEntry));

		updatePending({ active: active.Name });
	}, [catalogEntry]);

	const extra = (
		<RadioGroup>
			{available.map(({ Name, displayName }) => (
				<Radio
					key={Name}
					checked={pending.active === Name}
					label={displayName}
					name={RadioGroupName}
					onChange={() => updatePending({ active: Name })}
				/>
			))}
		</RadioGroup>
	);

	return (
		<OverviewContainer extra={extra}>
			{Editor && (
				<Editor
					catalogEntry={catalogEntry}
					onChange={updatePending}
					error={error}
				/>
			)}
			<ErrorMessage error={error} />
		</OverviewContainer>
	);
}

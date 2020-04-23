import React from 'react';
import PropTypes from 'prop-types';
import {Radio} from '@nti/web-commons';

import {getAvailableTypes} from './types';
import OverviewContainer from './components/OverviewContainer';
import RadioGroup from './components/RadioGroup';

const RadioGroupName = 'course-access-option';

CourseAccessEditor.propTypes = {
	catalogEntry: PropTypes.object,
	onValueChange: PropTypes.func,
	error: PropTypes.any
};
export default function CourseAccessEditor ({catalogEntry, onValueChange, error}) {
	const [pending, setPending] = React.useState({});

	const updatePending = (update) => {
		const newPending = {...pending, ...update};

		onValueChange(newPending);
		setPending(newPending);
	};

	const available = getAvailableTypes(catalogEntry);
	const Editor = available.find(a => a.Name === pending.active)?.Editor;

	React.useEffect(() => {
		const active = available.find(a => a.isActive(catalogEntry));

		updatePending({active: active.Name});
	}, [catalogEntry]);

	const extra = (
		<RadioGroup>
			{available.map(({Name, displayName}) => (
				<Radio
					key={Name}
					checked={pending.active === Name}
					label={displayName}
					name={RadioGroupName}
					onChange={() => updatePending({active: Name})}
				/>
			))}
		</RadioGroup>
	);

	return (
		<OverviewContainer extra={extra}>
			{Editor && (<Editor catalogEntry={catalogEntry} onChange={updatePending} error={error} />)}
		</OverviewContainer>
	);
}
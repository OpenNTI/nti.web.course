import './RequirementControl.scss';
import { useMemo, useState } from 'react';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Flyout } from '@nti/web-commons';

import RequirementControlOption from './RequirementControlOption';

const t = scoped('course.components.RequirementControl', {
	required: 'Required',
	optional: 'Optional',
	default: 'Default',
});

const DEFAULT = t('default');
const REQUIRED = t('required');
const OPTIONAL = t('optional');

export default function RequirementControl({ record, onChange, className }) {
	const basedOnDefault = record.IsCompletionDefaultState;
	const isRequired = record.CompletionRequired;
	const requiredValue = basedOnDefault
		? DEFAULT
		: isRequired
		? REQUIRED
		: OPTIONAL;
	const defaultValue = record.CompletionDefaultState ? REQUIRED : OPTIONAL;
	const options = useMemo(
		() => [
			{ label: DEFAULT + ' (' + defaultValue + ')', value: DEFAULT },
			{ label: REQUIRED, value: REQUIRED },
			{ label: OPTIONAL, value: OPTIONAL },
		],
		[defaultValue]
	);

	const [value, setValue] = useState(requiredValue);

	const selectedOption = options?.find(x => x.value === value);

	if (!options) {
		return null;
	}

	return (
		<Flyout.Triggered
			className={cx('require-control', className)}
			trigger={
				<div className={cx('require-control-value', className)}>
					<span>{selectedOption?.label}</span>
					<i className="icon-chevron-down" />
				</div>
			}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
		>
			<PropGrabber>
				{({ dismissFlyout }) =>
					options?.map(option => (
						<RequirementControlOption
							key={option.value}
							option={option}
							onChange={newValue => {
								dismissFlyout?.();
								setValue(newValue);
								onChange?.(newValue);
							}}
							isSelected={option.value === value}
						/>
					))
				}
			</PropGrabber>
		</Flyout.Triggered>
	);
}

function PropGrabber({ children, ...props }) {
	return children(props);
}

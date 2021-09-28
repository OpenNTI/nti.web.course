import React from 'react';

export default function CreditEntryTypeOption({ option, onClick }) {
	return (
		<div
			className="credit-entry-type-option"
			onClick={() => onClick?.(option)}
		>
			{option.toString()}
		</div>
	);
}

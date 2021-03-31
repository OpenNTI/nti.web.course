import React from 'react';

import {Color} from '@nti/lib-commons';
import {Input} from '@nti/web-commons';

const Presets = [
	(['#6B718E', '#A34E7C', '#C96EDE', '#7E62DA', '#4E70D4', '#3AA649', '#FF600A', '#D23E47']).map(x => ({color: Color.fromHex(x)})),
	(['#B6BAC9', '#FFB99B', '#FB9DC7', '#5AECFF', '#65CD9E', '#ACCE69', '#FFDE0A', '#DBC4AE']).map(x => ({color: Color.fromHex(x)}))
];

export function AccentPicker (props) {
	return (
		<Input.Color.Flyout
			{...props}
			swatches={Presets}
			arrow
			verticalAlign={Input.Color.Flyout.ALIGNMENTS.BOTTOM}
			horizontalAlign={Input.Color.Flyout.ALIGNMENTS.LEFT_OR_RIGHT}
		/>
	)
}

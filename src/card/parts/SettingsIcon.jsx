import React from 'react';

import Badge from './Badge';

const SettingsIcon = styled('i').attrs({ className: 'icon-settings' })`
	opacity: 0.5;
`;

const Settings = styled(Badge).attrs({
	black: true,
	children: React.createElement(SettingsIcon),
})`
	opacity: 0.5;
	position: absolute;
	top: 5px;
	right: 10px;
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;

	:global(.no-touch) & {
		opacity: 0;
		&:hover {
			opacity: 1;
		}
	}

	:global(.no-touch) *:hover + & {
		opacity: 0.5;
	}
`;

export default Settings;

import PropTypes from 'prop-types';

import { Button } from '@nti/web-core';

import { Translate } from './strings.js';

const styles = stylesheet`
	.button {
		cursor: pointer;
		border: 1px solid var(--tertiary-grey);
		border-radius: 3px;
		color: var(--primary-grey);
		width: 158px;
		height: 40px;
		font-size: 1rem;
		font-weight: normal;
		text-align: center;
		line-height: 2.2rem;
		padding: 0;
	}
`;

Dismiss.propTypes = {
	onClick: PropTypes.func,
};

export function Dismiss({ onClick }) {
	return (
		<Button onClick={onClick} className={styles.button} plain>
			<Translate localeKey="dismiss" />
		</Button>
	);
}

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@nti/web-commons';

import { Translate } from './strings';

const styles = css`
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
	}
`;

Dismiss.propTypes = {
	onClick: PropTypes.func,
};

export default function Dismiss({ onClick }) {
	return (
		<Button onClick={onClick} className={styles.button} plain>
			<Translate localeKey="dismiss" />
		</Button>
	);
}

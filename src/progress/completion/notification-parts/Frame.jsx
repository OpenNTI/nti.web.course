import React from 'react';
import PropTypes from 'prop-types';

import Dismiss from './Dismiss';
import Close from './Close';

const styles = css`
	.centered {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`;


const Box = styled('div')`
	composes: ${styles.centered};

	max-width: 100vw;
	width: 1024px;
	height: 700px;
	background: white;

	& ${Close} {
		position: absolute;
		top: 8px;
		right:8px;
	}
`;

Frame.propTypes = {
	onDismiss: PropTypes.func
};

export function Frame ({onDismiss, children}) {
	return (
		<Box>
			<Close onClick={onDismiss}/>
			{children}
			<Dismiss onClick={onDismiss}/>
		</Box>
	);
}

export default Frame;

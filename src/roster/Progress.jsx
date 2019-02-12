import React from 'react';
import PropTypes from 'prop-types';

import Overview from '../progress/overview';

import {decodeBatchParams} from './util';

export default class Progress extends React.Component {
	static propTypes = {
		encodedBatchLink: PropTypes.string.isRequired
	}

	render () {
		const {encodedBatchLink, ...props} = this.props;
		const batchLink = decodeBatchParams(encodedBatchLink);

		return (
			<Overview batchLink={batchLink} {...props} />
		);
	}
}

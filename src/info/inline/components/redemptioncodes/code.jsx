import './code.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

class Code extends Component {
	static propTypes = {
		code: PropTypes.shape({
			Code: PropTypes.string.isRequired,
			postToLink: PropTypes.func.isRequired,
		}),
		onDelete: PropTypes.func.isRequired,
	};

	onDelete = () => {
		const { code } = this.props;
		this.props.onDelete(code);
	};

	render() {
		const { code } = this.props;
		return (
			<div className="redemption-code-edit">
				<div className="code">{code.Code}</div>
				<a className="delete-code" onClick={this.onDelete}>
					<i className="icon-trash" />
				</a>
			</div>
		);
	}
}

export default Code;

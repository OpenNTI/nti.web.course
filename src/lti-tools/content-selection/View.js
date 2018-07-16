import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt, Resizable } from '@nti/web-commons';

export default
class ContentSelection extends Component {
	static propTypes = {
		src: PropTypes.string.isRequired,
		overviewGroupOID: PropTypes.string.isRequired,
		onClose: PropTypes.func.isRequired,
		title: PropTypes.string,
		selectContent: PropTypes.func.isRequired,
		height: PropTypes.number,
		width: PropTypes.number
	};

	static defaultProps = {
		height: 550,
		width: 550
	}

	componentDidMount () {
		global.addEventListener('message', this.selectedContent, false);
	}

	componentWillUnmount () {
		global.removeEventListener('message', this.selectedContent);
	}

	selectedContent = ({ data }) => {
		if (data.key === 'nti-lti-tool-content-selection-finished') {
			const { title, ConfiguredTool, description } = data.data;
			this.props.selectContent({ title, ConfiguredTool, description, launchUrl: data.data['launch_url'] });
		}
	}

	render () {
		const { src, overviewGroupOID, onClose, title, width, height } = this.props;

		return (
			<Prompt.Dialog onBeforeDismiss={this.hideCertificate}>
				<Resizable onClose={onClose} title={title} width={width} height={height}>
					<iframe
						className="lti-content-selection-iframe"
						src={`${src}?overview_group=${overviewGroupOID}`}
					/>
				</Resizable>
			</Prompt.Dialog>
		);
	}
}

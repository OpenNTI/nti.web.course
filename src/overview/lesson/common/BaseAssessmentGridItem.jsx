import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from './PaddedContainer';
import TextPart from './TextPart';

export default class BaseAssessmentGridItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,

		renderTitle: PropTypes.func,
		renderIcon: PropTypes.func,
		renderLabels: PropTypes.func,
		renderButton: PropTypes.func
	}


	render () {
		return (
			<PaddedContainer className="lesson-overview-base-assessment-grid-item">
				<div className="container">
					<div className="icon-container">
						<div className="icon">
							{this.renderIcon()}
						</div>
					</div>
					<div className="info-container">
						<TextPart className="title-container">
							{this.renderTitle()}
						</TextPart>
						<TextPart className="labels-container">
							{this.renderLabels()}
						</TextPart>
					</div>
					<div className="button-container">
						{this.renderButton()}
					</div>
				</div>
			</PaddedContainer>
		);
	}


	renderTitle () {
		const {renderTitle, item} = this.props;

		if (renderTitle) { return renderTitle(); }

		return (<span className="title">{item.title || item.label}</span>);
	}


	renderLabels () {
		const {renderLabels} = this.props;

		return renderLabels ? renderLabels() : null;
	}


	renderIcon () {
		const {renderIcon} = this.props;

		return renderIcon ? renderIcon() : null;
	}


	renderButton () {
		const {renderButton} = this.props;

		return renderButton ? renderButton() : null;
	}
}

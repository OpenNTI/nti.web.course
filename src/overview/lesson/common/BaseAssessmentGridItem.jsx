import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from 'nti-web-routing';

import PaddedContainer from './PaddedContainer';
import TextPart from './TextPart';

export default class BaseAssessmentGridItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,

		renderTitle: PropTypes.func,
		renderIcon: PropTypes.func,
		renderLabels: PropTypes.func,
		renderButton: PropTypes.func,

		linkToObject: PropTypes.object,
		linkToContext: PropTypes.any
	}


	render () {
		const {item, linkToObject, linkToContext} = this.props;

		return (
			<PaddedContainer className="lesson-overview-base-assessment-grid-item">
				<LinkTo.Object object={linkToObject || item} context={linkToContext} data-ntiid={item.NTIID}>
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
				</LinkTo.Object>
			</PaddedContainer>
		);
	}


	renderTitle () {
		const {renderTitle, item} = this.props;
		const title = renderTitle ? renderTitle() : null;

		return title || (<span className="title">{item.title || item.label}</span>);
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

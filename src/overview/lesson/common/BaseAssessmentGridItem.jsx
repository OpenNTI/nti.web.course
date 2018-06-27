import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';
import cx from 'classnames';
import {InlineEditor} from '@nti/web-assignment-editor';

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
		linkToContext: PropTypes.any,

		inlineEditorExpanded: PropTypes.bool,
		onEditorDismiss: PropTypes.func,

		className: PropTypes.string
	}

	state = {}

	componentDidMount () {
		this.setState({
			editorExpanded: this.props.inlineEditorExpanded
		});
	}


	componentDidUpdate (oldProps) {
		if(oldProps.inlineEditorExpanded && !this.props.inlineEditorExpanded) {
			this.setState({
				editorTransitioning: true
			}, () => {
				setTimeout(() => {
					this.setState({
						editorExpanded: false,
						editorTransitioning: false
					});
				}, 500);
			});
		}
		else if(this.props.inlineEditorExpanded && !this.state.editorExpanded && !this.state.editorTransitioning) {
			this.setState({
				editorTransitioning: true
			}, () => {
				setTimeout(() => {
					this.setState({
						editorExpanded: true,
						editorTransitioning: false
					});
				}, 500);
			});
		}
	}


	render () {
		const {item, linkToObject, linkToContext, inlineEditorExpanded} = this.props;
		const {editorTransitioning} = this.state;

		const statusCls = inlineEditorExpanded ? 'status-open' : 'status-closed';
		const statusOpening = editorTransitioning && 'status-transitioning';

		const className = cx('container', statusCls, statusOpening, this.props.className);

		return (
			<PaddedContainer className="lesson-overview-base-assessment-grid-item">
				<div className={className}>
					<LinkTo.Object object={linkToObject || item} context={linkToContext} data-ntiid={item.NTIID}>
						<div className="target">
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
					<div className="editor-container">
						{(this.state.editorTransitioning || this.state.editorExpanded) && (
							<InlineEditor assignment={linkToObject} assignmentRef={item} onDismiss={this.onEditorDismiss}/>
						)}
					</div>
				</div>
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

	onEditorDismiss = (savedData) => {
		const {onEditorDismiss} = this.props;

		if(onEditorDismiss) {
			onEditorDismiss(savedData);
		}
	}
}

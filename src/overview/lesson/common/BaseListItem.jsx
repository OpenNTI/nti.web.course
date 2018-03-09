import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {List, AssetIcon} from 'nti-web-commons';
import {isNTIID} from 'nti-lib-ntiids';
import {LinkTo} from 'nti-web-routing';

import PaddedContainer from './PaddedContainer';
import TextPart from './TextPart';

const isExternal = (item) => /external/i.test(item.type) || !isNTIID(item.href);


export default class LessonOverviewBaseListItem extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.object,
		disabled: PropTypes.bool,

		title: PropTypes.string,
		labels: PropTypes.array,

		renderTitle: PropTypes.func,
		renderLabels: PropTypes.func,
		renderIcon: PropTypes.func,

		linkToObject: PropTypes.object,
		linkToContext: PropTypes.any
	}


	render () {
		const {className, disabled, item, linkToObject, linkToContext} = this.props;

		return (
			<LinkTo.Object className="lesson-overview-base-list-item-link" object={linkToObject || item} context={linkToContext}>
				<PaddedContainer className={cx('lesson-overview-base-list-item', className, {disabled})}>
					<div className="icon-container">
						<div className="icon">
							{this.renderIcon()}
						</div>
					</div>
					<div className="right">
						<TextPart className="title">
							{this.renderTitle()}
						</TextPart>
						<TextPart className="labels">
							{this.renderLabels()}
						</TextPart>
					</div>
				</PaddedContainer>
			</LinkTo.Object>
		);
	}

	renderIcon () {
		const {renderIcon, item} = this.props;
		const type = [item.type, item.targetMimeType].filter(x => x);

		if (renderIcon) { return renderIcon(); }

		return (
			<AssetIcon
				className="lesson-overview-base-list-item-icon"
				src={item.icon}
				mimeType={type}
				href={item.href}
			>
				{isExternal(item) && (<div className="external" />)}
			</AssetIcon>
		);
	}


	renderTitle () {
		const {title, item, renderTitle} = this.props;

		if (renderTitle) { return renderTitle(); }

		return title != null ? title : (item.title || item.label);
	}


	renderLabels () {
		const {labels, renderLabels} = this.props;

		if (renderLabels) { return renderLabels(); }

		if (!labels) { return null; }

		return (
			<List.SeparatedInline>
				{labels}
			</List.SeparatedInline>
		);
	}
}

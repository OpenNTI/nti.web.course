import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {rawContent} from 'nti-commons';
import {List} from 'nti-web-commons';

import PaddedContainer from './PaddedContainer';

TextPart.propTypes = { children: PropTypes.node };
function TextPart ({children, ...props}) {
	const [child = null] = React.Children.toArray(children);
	return typeof child !== 'string' ? (
		<div {...props}>{child}</div>
	) : (
		<div {...props} {...rawContent(child)}/>
	);
}

export default class LessonOverviewBaseListItem extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.object,

		title: PropTypes.string,
		labels: PropTypes.array,

		renderTitle: PropTypes.func,
		renderLabels: PropTypes.func,
		renderIcon: PropTypes.func
	}


	render () {
		const {className} = this.props;

		return (
			<PaddedContainer className={cx('lesson-overview-base-list-item', className)}>
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
		);
	}

	renderIcon () {
		const {renderIcon} = this.props;

		return renderIcon ? renderIcon() : null;
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

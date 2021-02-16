import './Base.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Container from '../../../common/Container';

import Registry from './Registry';

export default class BaseProgressItem extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.object,
		title: PropTypes.string,
		labels: PropTypes.array,
		renderIcon: PropTypes.func,
	};

	render() {
		const { className } = this.props;

		return (
			<Container className={cx('base-progress-item', className)}>
				<div className="icon-container">
					<div className="icon">{this.renderIcon()}</div>
				</div>
				<div className="right">
					<div className="title">{this.renderTitle()}</div>
					<div className="labels">{this.renderLabels()}</div>
				</div>
			</Container>
		);
	}

	renderIcon() {
		const { renderIcon } = this.props;

		return renderIcon ? renderIcon() : null;
	}

	renderTitle() {
		const { title, item } = this.props;

		return title != null ? title : item.title || item.label;
	}

	renderLabels() {
		const { labels } = this.props;

		if (!labels) {
			return null;
		}

		return (
			<React.Fragment>
				{labels.map((label, index) => {
					return (
						<span className="label" key={index}>
							{label}
						</span>
					);
				})}
			</React.Fragment>
		);
	}
}

Registry.register(Registry.DEFAULT)(BaseProgressItem);

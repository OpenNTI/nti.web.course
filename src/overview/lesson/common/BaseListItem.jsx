import './BaseListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { isIterable } from '@nti/lib-commons';
import { List, AssetIcon, Card, Table } from '@nti/web-commons';
import { isNTIID } from '@nti/lib-ntiids';
import { LinkTo } from '@nti/web-routing';
import { CircularProgress } from '@nti/web-charts';

import { getCompletedStatus, Success, Failed } from '../items/utils';

import PaddedContainer from './PaddedContainer';
import TextPart from './TextPart';

const isExternal = item => /external/i.test(item.type) || !isNTIID(item.href);

class LessonOverviewBaseListItemInfo extends React.Component {
	static cssClassName = 'lesson-overview-base-list-item-table-info-cell';

	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.object,
		course: PropTypes.object,
		disabled: PropTypes.bool,

		completedItemsOverride: PropTypes.object,

		title: PropTypes.string,
		labels: PropTypes.array,

		renderTitle: PropTypes.func,
		renderLabels: PropTypes.func,
		renderIcon: PropTypes.func,

		linkToObject: PropTypes.object,
		linkToContext: PropTypes.any,
		onClick: PropTypes.func,

		noCompletedStatus: PropTypes.bool,
	};

	state = {};

	componentDidMount() {
		this.resolveIcon(this.props);
	}

	componentDidUpdate(oldProps) {
		const { item: nextItem } = this.props;
		const { item: oldItem } = oldProps;

		if (nextItem !== oldItem) {
			this.resolveIcon(this.props);
		}
	}

	componentWillUnmount() {
		this.unmounted = this;
		this.setState = () => {};
	}

	async resolveIcon(props) {
		const { course, item = {}, renderIcon } = props;

		if (renderIcon) {
			return;
		}

		const icon = await Card.resolveIcon(item, course);

		this.setState({ icon });
	}

	render() {
		const {
			className,
			disabled,
			item,
			linkToObject,
			linkToContext,
			onClick,
		} = this.props;

		const title = this.renderTitle();

		return (
			<LinkTo.Object
				data-ntiid={item.NTIID}
				className={cx('lesson-overview-base-list-item-link', {
					disabled: disabled,
				})}
				object={linkToObject || item}
				context={linkToContext}
				onClick={onClick}
			>
				<div
					className={cx('lesson-overview-base-list-item', className, {
						disabled,
					})}
				>
					<div className="icon-container">
						<div className="icon">
							{this.renderIcon()}
							{this.renderCompletedStatus()}
						</div>
					</div>
					<div className="right">
						<TextPart
							className={cx('title', {
								plain: typeof title === 'string',
							})}
						>
							<>{title}</>
						</TextPart>
						<TextPart className="labels">
							{this.renderLabels()}
						</TextPart>
					</div>
				</div>
			</LinkTo.Object>
		);
	}

	renderIcon() {
		const { renderIcon, item } = this.props;
		const { icon } = this.state;
		const type = [item.type || item.MimeType, item.targetMimeType].filter(
			x => x
		);

		if (renderIcon) {
			return renderIcon();
		}

		return (
			<AssetIcon
				className="lesson-overview-base-list-item-icon"
				src={icon}
				mimeType={type}
				href={item.href}
			>
				{isExternal(item) && <div className="external" />}
			</AssetIcon>
		);
	}

	renderCompletedStatus() {
		const { item, noCompletedStatus, completedItemsOverride } = this.props;

		if (noCompletedStatus) {
			return null;
		}

		const status = getCompletedStatus(item, completedItemsOverride);

		if (status === Success) {
			return (
				<div className="progress-icon">
					<CircularProgress width={20} height={20} isComplete />
				</div>
			);
		}

		if (status === Failed) {
			return (
				<div className="progress-icon failed">
					<span>!</span>
				</div>
			);
		}
	}

	renderTitle() {
		const { title, item, renderTitle } = this.props;

		if (renderTitle) {
			return renderTitle();
		}

		return title != null ? title : item.title || item.label;
	}

	renderLabels() {
		const { labels, renderLabels } = this.props;

		if (renderLabels) {
			return renderLabels();
		}

		if (!labels) {
			return null;
		}

		return <List.SeparatedInline>{labels}</List.SeparatedInline>;
	}
}

LessonOverviewBaseListItem.propTypes = {
	item: PropTypes.object,
	extraColumns: PropTypes.array,
};
export default function LessonOverviewBaseListItem({
	item,
	extraColumns = [],
	...otherProps
}) {
	const columns = [
		LessonOverviewBaseListItemInfo,
		...(isIterable(extraColumns) ? extraColumns : []),
	];
	const extraProps = { item, ...otherProps };

	return (
		<PaddedContainer className="lesson-overview-base-list-item-container">
			<Table.TableRow
				item={item}
				columns={columns}
				extraProps={extraProps}
				component="div"
				className="lesson-overview-base-list-item-table-row"
			/>
		</PaddedContainer>
	);
}

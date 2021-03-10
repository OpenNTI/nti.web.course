import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { List, DateTime, Flyout } from '@nti/web-commons';

import Title from '../../common/Title';
import SubTitle from '../../common/SubTitle';
import Store from '../../Store';

import Styles from './Ready.css';

const NOW_CUTOFF = 5 * 60 * 1000; //5 minutes

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.component.package.Ready', {
	uploaded: {
		now: 'Uploaded Now',
		date: 'Uploaded %(date)s',
	},
	trigger: '...',
	delete: 'Delete',
});

class ReadyPackage extends React.Component {
	static propTypes = {
		package: PropTypes.object.isRequired,
		selected: PropTypes.bool,

		deletePackage: PropTypes.func,
	};

	deletePackage = e => {
		e.stopPropagation();
		e.preventDefault();

		const { deletePackage, package: pack } = this.props;

		if (deletePackage) {
			deletePackage(pack);
		}
	};

	render() {
		const { package: pack, selected } = this.props;

		return (
			<LinkTo.Object
				className={cx('ready-scorm-package', { selected })}
				object={pack}
			>
				<div className={cx('title-container')}>
					<Title>{pack.title}</Title>
					<List.SeparatedInline className={cx('sub-title-list')}>
						{this.renderUploaded(pack, selected)}
						{this.renderFileName(pack, selected)}
					</List.SeparatedInline>
				</div>
				{this.renderControls()}
			</LinkTo.Object>
		);
	}

	renderUploaded(pack, selected) {
		const created = pack.getCreatedTime();

		if (!created) {
			return null;
		}

		const now = new Date();
		const ago = now - created;

		if (ago < NOW_CUTOFF) {
			return <SubTitle green>{t('uploaded.now')}</SubTitle>;
		}

		const date = DateTime.format(
			created,
			DateTime.MONTH_NAME_DAY_YEAR_AT_TIME
		);

		return <SubTitle>{t('uploaded.date', { date })}</SubTitle>;
	}

	renderFileName(pack, selected) {
		if (!pack.fileName) {
			return null;
		}

		return <SubTitle>{pack.fileName}</SubTitle>;
	}

	renderControls() {
		const trigger = (
			<span className={cx('control-trigger')}>{t('trigger')}</span>
		);

		return (
			<Flyout.Triggered
				trigger={trigger}
				verticalAlign={Flyout.Triggered.ALIGNMENTS.BOTTOM}
				horizontalAlign={Flyout.Triggered.ALIGNMENTS.RIGHT}
			>
				<ul className={cx('control-list')}>
					<li onClick={this.deletePackage}>{t('delete')}</li>
				</ul>
			</Flyout.Triggered>
		);
	}
}

export default decorate(ReadyPackage, [Store.monitor(['deletePackage'])]);

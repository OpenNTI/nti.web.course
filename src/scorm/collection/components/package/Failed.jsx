import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Errors } from '@nti/web-commons';

import Title from '../../common/Title';
import Store from '../../Store';

import Styles from './Failed.css';

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.components.package.UploadFailed', {
	label: 'There was a problem',
});

class UploadedFailedPackage extends React.Component {
	static propTypes = {
		package: PropTypes.object.isRequired,
		error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		deletePackage: PropTypes.func,
	};

	state = {};

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		const { package: pack } = this.props;
		const { package: oldPack } = prevProps;

		if (pack !== oldPack) {
			this.setup();
		}
	}

	async setup() {
		const { package: pack } = this.props;

		try {
			await pack;
		} catch (e) {
			this.setState({
				error: e,
			});
		}
	}

	deletePackage = () => {
		const { package: pack, deletePackage } = this.props;

		if (deletePackage) {
			deletePackage(pack);
		}
	};

	render() {
		const { package: pack, error } = this.props;

		if (!error) {
			return null;
		}

		return (
			<div className={cx('failed-upload')}>
				<div className={cx('title-container')}>
					<Title>{pack.name || pack.fileName}</Title>
					<div className={cx('message')}>
						<span className={cx('label')}>{t('label')}</span>{' '}
						<span className={cx('error')}>
							{Errors.Messages.getMessage(error)}
						</span>
					</div>
				</div>
				<div className={cx('clear')} onClick={this.deletePackage}>
					<i className="icon-bold-x" />
				</div>
			</div>
		);
	}
}

export default decorate(UploadedFailedPackage, [
	Store.monitor(['deletePackage']),
]);

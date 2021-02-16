import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';

import Title from '../../common/Title';
import SubTitle from '../../common/SubTitle';

import Styles from './Processing.css';

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.components.package.Processing', {
	label: 'Processing',
	message: 'May Take a Couple of Minutes',
});

export default class ProcessingPackage extends React.PureComponent {
	static propTypes = {
		package: PropTypes.object,
	};

	componentDidMount() {
		this.setup();
	}

	componentWillUnmount() {
		this.teardown();
	}

	componentDidUpdate(prevProps) {
		const { package: pack } = this.props;
		const { package: oldPack } = prevProps;

		if (pack !== oldPack) {
			this.setup();
		}
	}

	setup() {
		this.teardown();

		const { package: pack } = this.props;

		this.pollingTask = pack.getPoll();
		this.pollingTask.start();
	}

	teardown() {
		if (this.pollingTask && this.pollingTask.canCancel) {
			this.pollingTask.cancel();
		}
	}

	render() {
		const { package: pack } = this.props;

		return (
			<div className={cx('processing-package')}>
				<Loading.Spinner className={cx('loading')} />
				<div className={cx('title-container')}>
					<Title>{pack.title || pack.fileName}</Title>
					<div className={cx('sub-titles')}>
						<SubTitle blue>{t('label')}</SubTitle>{' '}
						<SubTitle dark>{t('message')}</SubTitle>
					</div>
				</div>
			</div>
		);
	}
}

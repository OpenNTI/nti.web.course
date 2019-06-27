import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading, EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Styles from './View.css';
import Store from './Store';
import Empty from './components/Empty';
import PackageList from './components/PackageList';

const cx = classnames.bind(Styles);
const t = scoped('course.scorm.collection.View', {
	unavailable: 'SCORM is not available in this course.'
});


export default
@Store.connect(['initialLoad', 'unavailable', 'error', 'empty', 'fullPackages', 'uploadError'])
class ScormCollection extends React.Component {
	static deriveBindingFromProps (props) {
		return {
			course: props.course,
			onPackageUploaded: props.onPackageUploaded,
			onPackageDeleted: props.onPackageDeleted
		};
	}

	static propTypes = {
		course: PropTypes.object,
		selected: PropTypes.object,
		onPackageUploaded: PropTypes.func,
		onPackageDeleted: PropTypes.func,

		initialLoad: PropTypes.bool,
		unavailable: PropTypes.bool,
		loading: PropTypes.bool,
		error: PropTypes.any,
		empty: PropTypes.bool,
		uploadError: PropTypes.object
	}


	render () {
		const {initialLoad, unavailable, error, empty, selected} = this.props;
		let content = null;

		if (unavailable || error) {
			content = (<EmptyState subHeader={t('unavailable')} />);
		} else if (empty) {
			content = (<Empty />);
		} else {
			content = (<PackageList selectedPackages={selected} />);
		}

		return (
			<div className={cx('scorm-collection')}>
				<Loading.Placeholder
					loading={!initialLoad}
					fallback={<Loading.Spinner.Large />}
				>
					{content}
				</Loading.Placeholder>
			</div>
		);
	}
}
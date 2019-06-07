import React from 'react';
import PropTypes from 'prop-types';
import {Loading, EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import Empty from './components/Empty';
import PackageList from './components/PackageList';

const t = scoped('course.scorm.collection.View', {
	unavailable: 'SCORM is not available in this course.'
});


export default
@Store.connect(['initialLoad', 'unavailable', 'error', 'empty'])
class ScormCollection extends React.Component {
	static deriveBindingFromProps (props) {
		return {
			course: props.course,
			selected: props.selected
		};
	}

	static propTypes = {
		course: PropTypes.object,

		initialLoad: PropTypes.bool,
		unavailable: PropTypes.bool,
		loading: PropTypes.bool,
		error: PropTypes.any,
		empty: PropTypes.bool
	}


	render () {
		const {initialLoad, unavailable, error, empty} = this.props;
		let content = null;

		if (unavailable || error) {
			content = (<EmptyState subHeader={t('unavailable')} />);
		} else if (empty) {
			content = (<Empty />);
		} else {
			content = (<PackageList />);
		}

		return (
			<div>
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
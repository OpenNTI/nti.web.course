import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import Administrating from './parts/administrating';
import Enrolled from './parts/enrolled';
import NotEnrolled from './parts/not-enrolled';
import Gifting from './parts/gifting';

const t = scoped('course.enrollment.options', {
	unavailable: 'This course is unavailable for enrollment at this time',
	notEnrolledLabel: 'Enroll Today'
});

const propMap = {
	loading: 'loading',
	error: 'error',
	enrolled: 'enrolled',
	administrative: 'administrative',
	options: 'options'
};

@Store.connect(propMap)
export default class CourseEnrollmentOptions extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		catalogEntry: PropTypes.shape({
			getEnrollmentOptions: PropTypes.func
		}),

		store: PropTypes.shape({
			load: PropTypes.func
		}),
		loading: PropTypes.bool,
		error: PropTypes.any,
		enrolled: PropTypes.bool,
		administrative: PropTypes.bool,
		options: PropTypes.array
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentWillUnmount () {
		const {store} = this.props;

		store.cleanUp();
	}


	componentDidUpdate (prevProps) {
		const {catalogEntry:oldEntry} = prevProps;
		const {catalogEntry:newEntry} = this.props;

		if (oldEntry !== newEntry) {
			this.setupFor(this.props);
		}
	}

	setupFor (props) {
		const {catalogEntry, store} = props;

		store.load(catalogEntry);
	}


	render () {
		const {className, loading, error, enrolled} = this.props;

		return (
			<div className={cx('nti-course-enrollment-options', className, {'is-enrolled': enrolled})}>
				<div className="enrollment-container">
					{loading && (<Loading.Spinner />)}
					{!loading && error && (this.renderError())}
					{!loading && !error && (this.renderOptions())}
				</div>
				<div className="gift-container">
					{!loading && !error && (this.renderGift())}
				</div>
			</div>
		);
	}


	renderError () {
		return (
			<span className="error">{t('unavailable')}</span>
		);
	}


	renderOptions () {
		const {
			enrolled,
			administrative,
			catalogEntry,
			options
		} = this.props;

		let Cmp = null;

		if (administrative) {
			Cmp = Administrating;
		} else if (!options || !options.length) {
			//TODO: render something here
			return null;
		} else if (enrolled) {
			Cmp = Enrolled;
		} else {
			Cmp = NotEnrolled;
		}

		return (
			<Cmp options={options} catalogEntry={catalogEntry} />
		);
	}


	renderGift () {
		const {options} = this.props;

		if (!options) { return null; }

		return (
			<Gifting options={options} />
		);
	}


}

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import Administrating from './parts/Administrating';

const t = scoped('course.enrollment.options', {
	unavailable: 'This course is unavailable for enrollment at this time'
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


	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {catalogEntry:oldEntry, options:oldOptions} = prevProps;
		const {catalogEntry:newEntry, options:newOptions} = this.props;

		if (oldEntry !== newEntry) {
			this.setupFor(this.props);
		}

		if (oldOptions !== newOptions) {
			this.setupOptions(this.props);
		}
	}

	setupFor (props) {
		const {catalogEntry, store} = props;

		store.load(catalogEntry);
	}


	setupOptions (props) {
		const {options, enrolled} = props;
		const sorted = options && options.sort((a, b) => {
			const aPrice = a.getPrice();
			const bPrice = b.getPrice();

			if (aPrice && bPrice) {
				return aPrice - bPrice;
			} else if (aPrice && !bPrice) {
				return -1;
			} else if (!aPrice && !bPrice) {
				return 1;
			} else {
				return b.ORDER - a.ORDER;
			}
		});
		const active = enrolled ?
			sorted.find(option => option.isEnrolled) :
			sorted[0];

		if (!active || (sorted && !sorted.length)) {
			this.setState({
				invalidOptions: true
			});
		} else {
			this.setState({
				invalidOptions: false,
				sortedOptions: sorted,
				activeOption: active
			});
		}
	}


	render () {
		const {className, catalogEntry, loading, error, enrolled} = this.props;
		const {invalidOptions} = this.state;
		const hasError = error || invalidOptions;

		return (
			<div className={cx('nti-course-enrollment-options', {'is-enrolled': enrolled})}>
				<div className="enrollment-container">
					{loading && (<Loading.Spinner />)}
					{!loading && hasError && (this.renderError())}
					{!loading && !hasError && (this.renderOptions())}
				</div>
				<div className="gift-container">
					{!loading && !hasError && (this.renderGift())}
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
		const {enrolled, administrative} = this.props;

		if (administrative) {
			return this.renderAdministrative();
		}

		if (enrolled) {
			return this.renderEnrolled();
		}

		this.renderOptionList();
	}


	renderAdministrative () {
		const {catalogEntry} = this.props;

		return (
			<Administrating catalogEntry={catalogEntry} />
		);	
	}


	renderEnrolled () {
		debugger;
	}


	renderOptionList () {
		const {sortedOptions} = this.state;

		if (!sortedOptions) { return; }

		debugger;

	}


	renderGift () {
		debugger;
	}

}
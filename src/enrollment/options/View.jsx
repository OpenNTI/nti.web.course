import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {sortOptions} from './utils';
import Store from './Store';
import Title from './common/Title';
import Administrating from './parts/Administrating';
import Enrolled from './parts/Enrolled';
import OptionDescription from './parts/OptionDescription';
import OptionList from './parts/OptionList';

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


	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentWillUnmount () {
		const {store} = this.props;

		store.cleanUp();
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
		const {options, enrolled, administrative} = props;
		const sorted = sortOptions(options);

		//If we are administrative there's no need to set up the options
		if (administrative) {
			this.setState({
				invalidOptions: false
			});
			return;
		}

		const selected = enrolled ?
			sorted.find(option => option.isEnrolled()) :
			sorted[0];

		if (!selected || (sorted && !sorted.length)) {
			this.setState({
				invalidOptions: true
			});
		} else {
			this.setState({
				invalidOptions: false,
				sortedOptions: sorted,
				selectedOption: selected
			});
		}
	}


	selectOption = (option) => {
		this.setState({
			selectedOption: option
		});
	}


	render () {
		const {className, loading, error, enrolled} = this.props;
		const {invalidOptions} = this.state;
		const hasError = error || invalidOptions;

		return (
			<div className={cx('nti-course-enrollment-options', className, {'is-enrolled': enrolled})}>
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

		return this.renderOptionList();
	}


	renderAdministrative () {
		const {catalogEntry} = this.props;

		return (
			<Administrating catalogEntry={catalogEntry} />
		);
	}


	renderEnrolled () {
		const {selectedOption} = this.state;

		if (!selectedOption) { return null; }

		return (
			<Enrolled option={selectedOption} />
		);
	}


	renderOptionList () {
		const {sortedOptions, selectedOption} = this.state;

		if (!sortedOptions) { return; }

		return (
			<React.Fragment>
				<Title className="not-enrolled-label">{t('notEnrolledLabel')}</Title>
				<OptionList options={sortedOptions} selectedOption={selectedOption} selectOption={this.selectOption} />
				<OptionDescription option={selectedOption} />
			</React.Fragment>
		);
	}


	renderGift () {}

}

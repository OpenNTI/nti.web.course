import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { Loading, HOC } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Store from './Store';
import Administrating from './parts/administrating';
import Enrolled from './parts/enrolled';
import NotEnrolled from './parts/not-enrolled';
import NotAvailable from './parts/not-available';
import Gifting from './parts/gifting';

const t = scoped('course.enrollment.options', {
	unavailable: 'This course is unavailable for enrollment at this time',
	notEnrolledLabel: 'Enroll Today',
});

class CourseEnrollmentOptions extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		catalogEntry: PropTypes.shape({
			getEnrollmentOptions: PropTypes.func,
		}),

		store: PropTypes.shape({
			cleanUp: PropTypes.func,
			setup: PropTypes.func,
			load: PropTypes.func,
		}),
		anonymous: PropTypes.bool,
		loading: PropTypes.bool,
		error: PropTypes.any,
		enrolled: PropTypes.bool,
		administrative: PropTypes.bool,
		options: PropTypes.array,
		access: PropTypes.object,
	};

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentWillUnmount() {
		const { store } = this.props;

		store.cleanUp();
	}

	componentDidUpdate(prevProps) {
		const { catalogEntry: oldEntry } = prevProps;
		const { catalogEntry: newEntry } = this.props;

		if (oldEntry !== newEntry) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		const { catalogEntry, store } = props;

		store.load(catalogEntry);
	}

	onItemChange = () => {
		const { store } = this.props;
		store.setup();
	};

	render() {
		const { className, loading, error, enrolled, catalogEntry } =
			this.props;

		return (
			<HOC.ItemChanges
				item={catalogEntry}
				onItemChanged={this.onItemChange}
			>
				<div
					className={cx('nti-course-enrollment-options', className, {
						'is-enrolled': enrolled,
					})}
				>
					<div className="enrollment-container">
						{loading && <Loading.Spinner />}
						{!loading && error && this.renderError()}
						{!loading && !error && this.renderOptions()}
					</div>
					<div className="gift-container">
						{!loading && !error && this.renderGift()}
					</div>
				</div>
			</HOC.ItemChanges>
		);
	}

	renderError() {
		return <span className="error">{t('unavailable')}</span>;
	}

	renderOptions() {
		const {
			enrolled,
			administrative,
			catalogEntry,
			options,
			access,
			anonymous,
		} = this.props;

		let Cmp = null;

		if (administrative) {
			Cmp = Administrating;
		} else if (!options || !options.length) {
			Cmp = NotAvailable;
		} else if (enrolled) {
			Cmp = Enrolled;
		} else {
			Cmp = NotEnrolled;
		}

		return (
			<Cmp
				anonymous={anonymous}
				options={options}
				catalogEntry={catalogEntry}
				access={access}
			/>
		);
	}

	renderGift() {
		const { options } = this.props;

		if (!options) {
			return null;
		}

		return <Gifting options={options} />;
	}
}

export default decorate(CourseEnrollmentOptions, [
	Store.connect({
		loading: 'loading',
		error: 'error',
		enrolled: 'enrolled',
		administrative: 'administrative',
		anonymous: 'anonymous',
		options: 'options',
		access: 'access',
	}),
]);

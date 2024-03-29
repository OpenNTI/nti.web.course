import './View.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { Loading } from '@nti/web-commons';
import { Button } from "@nti/web-core";
import { scoped } from '@nti/lib-locale';

import Store from './../../../lti-tools/editing/Store';
import AddTool from './../../../lti-tools/editing/AddTool';
import ToolList from './components/tools/ToolList';

const DEFAULT_TEXT = {
	header: 'LTI Tool Configuration',
	add: 'Add Tool',
	empty: 'LTI is not configured for this course.',
};

const t = scoped('nti-web-course.admin-tools.advanced.lti', DEFAULT_TEXT);

class LTITools extends Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		page: PropTypes.bool,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.string,
		store: PropTypes.shape({
			loadItems: PropTypes.func.isRequired,
			setCourse: PropTypes.func.isRequired,
		}).isRequired,
	};

	state = {
		addIsVisible: false,
	};

	componentDidMount() {
		this.setupCourse();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.course.NTIID !== this.props.course.NTIID) {
			this.setupCourse();
		}
	}

	setupCourse = () => {
		const { store, course } = this.props;

		store.setCourse(course);
	};

	onAddTool = () => {
		this.setState({ addIsVisible: true });
	};

	onAddDismiss = addedItem => {
		this.setState({ addIsVisible: false });

		const { store } = this.props;

		if (addedItem) {
			store.loadItems();
		}
	};

	renderEmpty = () => {
		return <div className="lti-tools-emptystate">{t('empty')}</div>;
	};

	render() {
		const { addIsVisible } = this.state;
		const { course, page, items, loading, error, store } = this.props;
		const hasLTI = course.hasLink('lti-configured-tools');

		if (!hasLTI) {
			return this.renderEmpty();
		}

		return (
			<div className={cx('lti-tools-config', { 'lti-page': page })}>
				<div className="lti-tools-config-headerBar">
					<div className="lti-tools-config-header">{t('header')}</div>
					{!error && (
						<Button
							className="lti-tools-add"
							onClick={this.onAddTool}
						>
							{t('add')}
						</Button>
					)}
				</div>
				{error && (
					<span className="lti-tools-config-error">{error}</span>
				)}
				{loading && <Loading.Spinner size={40} />}
				{Array.isArray(items) && (
					<ToolList items={items} store={store} />
				)}
				{addIsVisible && (
					<AddTool
						onBeforeDismiss={this.onAddDismiss}
						store={this.props.store}
					/>
				)}
			</div>
		);
	}
}

export default decorate(LTITools, [
	Store.connect({
		loading: 'loading',
		error: 'error',
		items: 'items',
	}),
]);

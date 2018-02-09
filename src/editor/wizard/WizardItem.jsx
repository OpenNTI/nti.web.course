import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { Prompt, Switch, Loading } from 'nti-web-commons';

import Store from '../Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';


const t = scoped('course.wizard.WizardItem', {
	saving: 'Saving...',
	continue: 'Continue',
	confirmCancel: 'Canceling will cause the new course to not be saved.',
	defaultTitle: 'Create a New Course'
});

export default class WizardItem extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		stepName: PropTypes.string,
		wizardCmp: PropTypes.func.isRequired,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		buttonLabel: PropTypes.string,
		firstTab: PropTypes.bool,
		hideHeaderControls: PropTypes.bool,
		// by default, a wizard item cancel means to delete the temp course,
		// but sometimes we may want to cancel and keep the course
		// TODO: Maybe separate the delete on cancel logic out and have a more generic underlying component?
		keepCourseOnCancel: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = (data) => {
		if (data.type === COURSE_SAVING) {
			this.setState({loading: true});
		} else if (data.type === COURSE_SAVE_ERROR) {
			this.setState({loading: false, errorMsg: data.errorMsg});
		} else if (data.type === COURSE_SAVED) {
			this.setState({loading: false});
		}
	}

	cancel () {
		if(this.props.onCancel) {
			this.props.onCancel();
		}
	}

	renderTitle () {
		return (<div className="course-panel-header-title">{this.props.title || t('defaultTitle')}</div>);
	}

	renderStepName () {
		return (<div className="course-panel-header-stepname">{this.props.stepName}</div>);
	}

	renderBackButton () {
		if(this.props.hideHeaderControls || this.props.firstTab) {
			return null;
		}

		return (
			<Switch.Trigger item={Switch.PREVIOUS}>
				<div className="back"><i className="icon-chevron-left"/></div>
			</Switch.Trigger>
		);
	}

	renderCloseButton () {
		if(this.props.hideHeaderControls) {
			return null;
		}

		return (<div className="close" onClick={this.doCancel}><i className="icon-light-x"/></div>);
	}

	renderHeader () {
		return (<div className="course-panel-header">
			{this.renderCloseButton()}
			{this.renderBackButton()}
			<div className="header-text">
				{this.renderTitle()}
				{this.renderStepName()}
			</div>
		</div>);
	}

	renderError () {
		if(this.state.errorMsg) {
			return (<div className="error">{this.state.errorMsg}</div>);
		}

		return null;
	}

	renderLoading () {
		if(this.state.loading) {
			return (<Loading.Mask message={t('saving')}/>);
		}

		return null;
	}

	doCancel = () => {
		if(this.props.catalogEntry && !this.props.keepCourseOnCancel) {
			Prompt.areYouSure(t('confirmCancel')).then(() => {
				this.props.catalogEntry.delete().then(() => {
					this.cancel();
				});
			});
		}
		else {
			this.cancel();
		}
	};

	render () {
		const { wizardCmp: Cmp, ...otherProps } = this.props;

		delete otherProps.onCancel;

		return (<div className="course-wizard-item">
			{this.renderHeader()}
			{this.renderError()}
			{this.renderLoading()}
			<div className="course-panel-content-container">
				<Cmp onCancel={this.doCancel} saveCmp={SaveButton} {...otherProps}/>
			</div>
		</div>);
	}
}

SaveButton.propTypes = {
	onSave: PropTypes.func,
	label: PropTypes.string
};

function SaveButton ({onSave, label}) {
	return (
		<Switch.Trigger action={onSave} item={Switch.NEXT}>
			<div className="course-panel-continue">{label || t('continue')}</div>
		</Switch.Trigger>
	);
}

import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { Input } from 'nti-web-commons';
import cx from 'classnames';

import {saveCatalogEntry} from '../../../editor/Actions';

const LABELS = {
	cancel: 'Cancel',
	courseName: 'Course Name',
	identifier: 'Identification Number (i.e. UCOL-3224)',
	description: 'Description',
	loadingAccessCode: 'Loading...',
	accessCode: 'Course Code',
	copy: 'Copy',
	copiedToClipboard: 'Copied to clipboard'
};

const t = scoped('components.course.editor.panels.basic.tabpanel', LABELS);

export default class CourseBasic extends React.Component {
	static tabName = 'CourseBasic'
	static tabDescription = 'Basic Information'

	static propTypes = {
		saveCmp: PropTypes.func,
		onCancel: PropTypes.func,
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
		courseInstance: PropTypes.object,
		buttonLabel: PropTypes.string,
		errorMsg: PropTypes.string
	}

	attachCodeRef = x => this.codeRef = x

	constructor (props) {
		super(props);

		let description = props.catalogEntry && props.catalogEntry.RichDescription;

		if(!description || description === '') {
			description = props.catalogEntry && props.catalogEntry.description;
		}

		this.state = {
			courseName: props.catalogEntry && props.catalogEntry.title,
			identifier: props.catalogEntry && props.catalogEntry.ProviderUniqueID,
			description
		};

		this.loadAccessCode(props);
	}

	componentWillReceiveProps (nextProps) {
		this.loadAccessCode(nextProps);
	}

	loadAccessCode (props) {
		const { courseInstance } = props;

		if(courseInstance && !this.state.accessToken) {
			courseInstance.getAccessTokens().then((tokens) => {
				if(tokens && tokens[0]) {
					this.setState({accessToken: tokens[0]});
				}
			});
		}
	}

	onSave = () => {
		const { catalogEntry, afterSave } = this.props;

		saveCatalogEntry(catalogEntry, {
			ProviderUniqueID: this.state.identifier,
			title: this.state.courseName,
			identifier: this.state.identifier,
			RichDescription: this.state.description
		}, () => {
			afterSave && afterSave();
		});
	};

	renderSaveCmp () {
		const { buttonLabel, saveCmp: Cmp } = this.props;

		if(Cmp) {
			return (<Cmp onSave={this.onSave} label={buttonLabel}/>);
		}

		return null;
	}

	renderCancelCmp () {
		if(this.props.onCancel) {
			return (<div className="course-panel-cancel" onClick={this.props.onCancel}>{t('cancel')}</div>);
		}
	}

	renderAccessCode () {
		const { courseInstance } = this.props;

		if(courseInstance && courseInstance.hasLink('CourseAccessTokens')) {
			return (
				<div className="access-code-container">
					<div className="basic-label">{t('accessCode')}</div>
					{this.renderAccessCodeContent()}
				</div>
			);
		}
	}

	selectCode = () => {
		this.codeRef && this.codeRef.input.select();
	}

	copyCode = () => {
		this.selectCode();

		document.execCommand('copy');

		this.setState({showConfirmation: true});

		setTimeout(() => { this.setState({showConfirmation: false}); }, 2000);
	}

	renderAccessCodeContent () {
		const { courseInstance } = this.props;
		const { showConfirmation } = this.state;

		if(courseInstance && courseInstance.hasLink('CourseAccessTokens')) {
			if(this.state.accessToken) {
				const copyCls = cx('access-code-copy', {show: !showConfirmation, hide: showConfirmation});
				const confirmationCls = cx('access-code-copy-confirmation', {show: showConfirmation, hide: !showConfirmation});

				return (
					<div className="access-code-content">
						<Input.TextArea ref={this.attachCodeRef} onMouseUp={this.selectCode} value={this.state.accessToken.Code} className="access-code"/>
						<div className="copy-controls">
							<div onClick={this.copyCode} className={copyCls}>{showConfirmation ? '' : t('copy')}</div>
							<div className={confirmationCls}>{t('copiedToClipboard')}</div>
						</div>
					</div>
				);
			}
			else {
				return (<div className="token-loading">{t('loadingAccessCode')}</div>);
			}
		}
	}

	updateCourseName = (value) => {
		this.setState({courseName : value});
	};

	updateIDNumber = (value) => {
		this.setState({identifier : value});
	};

	updateDescription = (value) => {
		this.setState({description : value});
	};

	renderError () {
		const { errorMsg } = this.props;

		if(errorMsg) {
			return (<div className="error">{errorMsg}</div>);
		}

		return null;
	}

	render () {
		return (
			<div className="course-panel-getstarted-form">
				<div className="course-panel-content">
					{this.renderError()}
					<div className="basic-label">Name</div>
					<Input.Text placeholder={t('courseName')} value={this.state.courseName} onChange={this.updateCourseName} maxLength="140"/>
					<div className="basic-label">Identifier</div>
					<Input.Text placeholder={t('identifier')} value={this.state.identifier} onChange={this.updateIDNumber} maxLength="32"/>
					<div className="basic-label">Description</div>
					<Input.TextArea placeholder={t('description')} className="nti-text-input" value={this.state.description} onChange={this.updateDescription}/>
					{this.renderAccessCode()}
				</div>
				<div className="course-panel-controls">
					{this.renderSaveCmp()}
					{this.renderCancelCmp()}
				</div>
			</div>
		);
	}
}

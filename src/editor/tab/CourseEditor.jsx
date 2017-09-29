import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Prompt, Loading } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {getImageUrl} from '../../utils';
import Store from '../Store';
import { Blank } from '../templates/Blank';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

const LABELS = {
	finish: 'Finish',
	saving: 'Saving...',
	save: 'Save',
};

const t = scoped('COURSE_EDITOR', LABELS);

export default class CourseEditor extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object.isRequired,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func,
		onSave: PropTypes.func
	}

	static showEditor (catalogEntry, onCancel, onSave) {
		const doCancel = () => {
			onCancel && onCancel();
		};

		const doOnSave = () => {
			onSave && onSave();
		};

		return Prompt.modal(<CourseEditor catalogEntry={catalogEntry}  onCancel={doCancel} onSave={doOnSave}/>,
			'course-panel-wizard');
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
			this.setState({loading: false, hasSaved: true});
		}
	}

	cancel = () => {
		const { hasSaved } = this.state;
		const { onCancel, onFinish, catalogEntry } = this.props;

		hasSaved && onFinish && onFinish(catalogEntry);

		onCancel && onCancel();
	};

	renderLoadingMask () {
		if(this.state.loading) {
			return (<Loading.Mask message={t('saving')}/>);
		}

		return null;
	}

	renderCloseButton () {
		return (<div className="close" onClick={this.cancel}><i className="icon-light-x"/></div>);
	}

	renderTrigger = (panel) => {
		const tabPanel = panel.TabPanel;

		return (<Switch.Trigger key={tabPanel.tabName} className="course-editor-menu-item" item={tabPanel.tabName}>{tabPanel.tabDescription}</Switch.Trigger>);
	}

	renderTriggers () {
		return Blank.panels.map(this.renderTrigger);
	}

	renderPanel = (panel) => {
		const tabPanel = panel.TabPanel;

		return (<Switch.Item
			className="course-panel-content"
			key={tabPanel.tabName}
			name={tabPanel.tabName}
			component={tabPanel}
			catalogEntry={this.props.catalogEntry}
			onCancel={this.cancel}
			afterSave={this.props.onSave}
			saveCmp={SaveButton}/>);
	}

	renderItems () {
		return Blank.panels.map(this.renderPanel);
	}

	render () {
		const { catalogEntry } = this.props;

		return (<div className="course-editor">
			{this.renderLoadingMask()}
			{this.renderCloseButton()}
			<Switch.Panel className="course-panel" active={Blank.panels[0].TabPanel.tabName}>
				<Switch.Controls className="course-editor-menu">
					<div className="course-image" style={{
						backgroundImage: 'url(' + getImageUrl(catalogEntry) + ')'
					}}/>
					<div className="course-id">{catalogEntry.ProviderUniqueID}</div>
					<div className="course-title">{catalogEntry.title}</div>
					{this.renderTriggers()}
				</Switch.Controls>
				<Switch.Container>
					{this.renderItems()}
				</Switch.Container>
			</Switch.Panel>
		</div>);
	}
}

SaveButton.propTypes = {
	onSave: PropTypes.func,
	label: PropTypes.string
};

function SaveButton ({onSave, label}) {
	const doSave = () => {
		onSave();
	};

	return (
		<div onClick={doSave} className="course-panel-continue">{label || t('save')}</div>
	);
}

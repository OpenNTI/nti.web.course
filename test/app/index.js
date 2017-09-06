/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import { getService } from 'nti-web-client';
import { Prompt } from 'nti-web-commons';

import { CourseWizard, CourseEditor, CourseListing, CourseCreateButton } from '../../src/components';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {

	state = {}

	loadExisting = false;

	componentDidMount () {

	}

	onCancel = () => {
		this.setState({active:false});

		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;
	};

	onFinish = () => {
		this.setState({active:false});

		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;
	};

	launch = () => {
		if(this.loadExisting) {
			getService().then((service) => {
				return service.getObject('tag:nextthought.com,2011-10:NTI-CourseInfo-8293662465847423606_4744090504705445615');
			}).then((entry) => {
				this.modalDialog = Prompt.modal(<CourseEditor catalogEntry={entry}  onCancel={this.onCancel} onFinish={this.onFinish}/>,
					'course-panel-wizard');
			});
		}
		else {
			this.modalDialog = Prompt.modal(<CourseWizard title="Create a New Course" onCancel={this.onCancel} onFinish={this.onFinish}/>,
				'course-panel-wizard');
		}
	};

	render () {
		//http://janux.dev:8082/dataserver2/++etc++hostsites/platform.ou.edu/++etc++site/Courses/Spring2016/BIOL%202124/CourseCatalogEntry
		//tag:nextthought.com,2011-10:system-OID-0x09a6b9:5573657273:eJy72UE9U37
		// if(!this.state.catalogEntry) {
		// 	getService().then((service) => {
		// 		return service.getObject('tag:nextthought.com,2011-10:NTI-CourseInfo-8293662465847423519_4744090447131872047');
		// 	}).then((entry) => {
		// 		this.setState({catalogEntry: entry});
		// 	});
		// }

		if(this.state.active) {
			//catalogEntry={this.state.catalogEntry}
			//
			//

			return (
				<CourseWizard title="Create a New Course" catalogEntry={this.state.catalogEntry} onCancel={this.onCancel} onFinish={this.onFinish}/>
			);
		}
		else {
			return (<div>
				<CourseCreateButton/>
				<CourseListing isAdministrative/>
			</div>);
		}
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);

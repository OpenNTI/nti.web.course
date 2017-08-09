/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import { getService } from 'nti-web-client';

import {CoursePanel} from '../../src/components';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {

	state = {}

	componentDidMount () {

	}

	render () {
		//http://janux.dev:8082/dataserver2/++etc++hostsites/platform.ou.edu/++etc++site/Courses/Spring2016/BIOL%202124/CourseCatalogEntry
		//tag:nextthought.com,2011-10:system-OID-0x09a6b9:5573657273:eJy72UE9U37
		if(!this.state.catalogEntry) {
			getService().then((service) => {
				return service.getObject('tag:nextthought.com,2011-10:NTI-CourseInfo-DefaultAPICreated_ABEV_4444');
			}).then((entry) => {
				this.setState({catalogEntry: entry});
			});
		}

		if(this.state.active) {
			const onCancel = () => {
				this.setState({active:false});
			};

			const onFinish = () => {
				this.setState({active:false});
			};

			return (
				<CoursePanel title='Create a New Course' onCancel={onCancel} onFinish={onFinish}/>
			);
		}
		else {
			const launch = () => {
				this.setState({active:true});
			};

			return (<div onClick={launch}>Load Wizard</div>);
		}
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);

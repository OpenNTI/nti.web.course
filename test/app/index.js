/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from 'nti-web-client';

import { CourseListing, CourseCreateButton } from '../../src/components';
import CourseInfo from '../../src/info/inline/CourseInfo';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {
	componentDidMount () {

	}

	constructor (props) {
		super(props);

		this.state = { selectedCatalogEntry: 'tag:nextthought.com,2011-10:system-OID-0x08b427:5573657273:eJy72UE9dg9' };

		// getService().then((service) => {
		// 	// tag:nextthought.com,2011-10:cory.jones@nextthought.com-OID-0x28386e:5573657273:wJfn4wvwyXY  - datesA - NODA333
		// 	// tag:nextthought.com,2011-10:system-OID-0x09ac6b:5573657273:eJy72UE9Tre - Physiology
		// 	return service.getObject('tag:nextthought.com,2011-10:system-OID-0x09ac6b:5573657273:eJy72UE9Tre').then((courseInstance) => {
		// 		this.setState({loading: false, selectedCatalogEntry: courseInstance.CatalogEntry});
		// 	});
		// });
	}

	onCourseClick = (entry) => {
		this.setState({selectedCatalogEntry: entry});
	}

	onCancel = () => {
		this.setState({selectedCatalogEntry: undefined});
	}

	render () {
		if(this.state.selectedCatalogEntry) {
			return (
				<div style={{
					margin: '0 auto'
				}}>
					<div style={{marginTop: '10px', marginBottom: '10px'}} onClick={this.onCancel}>Back</div>
					<CourseInfo catalogEntry={this.state.selectedCatalogEntry} editable/>
					<div style={{'height': '50px'}}/>
					<CourseInfo catalogEntry={this.state.selectedCatalogEntry}/>
				</div>
			);
		}
		else if(!this.state.loading) {
			return (
				<div>
					<CourseCreateButton/>
					<CourseListing isAdministrative onCourseClick={this.onCourseClick}/>
				</div>
			);
		}

		return (<div>Loading...</div>);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);

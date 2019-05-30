import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import classnames from 'classnames/bind';


import FacilitatorsView from '../../../src/info/inline/components/facilitators/View';
import FacilitatorsEdit from '../../../src/info/inline/components/facilitators/Edit';
import PickCourse from '../PickCourse';

import styles from './View.css';
const cx = classnames.bind(styles);
import facilitators from './test-data';

const Container = ({className, ...other}) => (
	<div className={cx('course-info-editor-section', 'facilitators-test-container', className)}>
		<div className="content" {...other} />
	</div>
);

function FacilitatorsTest ({courseId}) {

	const [courseInstance, setCourse] = React.useState();

	React.useEffect(() => {
		
		async function setUp () {
			const service = await getService();
			const instance = await service.getObject(courseId);
			setCourse(instance);
		}

		if (courseId && !courseInstance) {
			setUp();
		}

	}, [courseId]);

	return !courseInstance ? null : (
		<div className={cx('facilitators-test')}>
			<Container>
				<FacilitatorsView courseInstance={courseInstance} facilitators={facilitators} />
			</Container>
			<Container className="edit">
				<FacilitatorsEdit courseInstance={courseInstance} facilitators={facilitators} />
			</Container>
		</div>
	);
}

FacilitatorsTest.propTypes = {
	courseId: PropTypes.string
};


export default class Test extends React.Component {
	render () {
		return (
			<PickCourse>
				<FacilitatorsTest />
			</PickCourse>
		);
	}
}


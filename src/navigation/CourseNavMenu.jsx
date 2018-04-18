import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from '@nti/web-commons';
import {getService} from '@nti/web-client';
import {ContentNavMenu} from '@nti/web-content';

import PublishCourse from '../info/inline/widgets/PublishCourse';

export default class CourseNavMenu extends React.Component {
	static propTypes = {
		activeCourse: PropTypes.object,
		recentCourses: PropTypes.arrayOf(PropTypes.object),
		onItemClick: PropTypes.func,
		goToEditor: PropTypes.func,
		onDelete: PropTypes.func,
		onVisibilityChanged: PropTypes.func,
		isAdministrator: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	onEditClick = () => {
		const { goToEditor, activeCourse } = this.props;

		goToEditor && goToEditor(activeCourse);
	}

	launchPublishDialog = () => {
		const { activeCourse, onItemClick } = this.props;

		onItemClick && onItemClick();

		const { subItems } = activeCourse;

		let courseId = activeCourse.id;

		if(subItems) {
			const filteredToSelected = subItems.filter(x => x.cls === 'current')[0];

			if(filteredToSelected) {
				courseId = filteredToSelected.id;
			}
		}

		PublishCourse.show(courseId)
			.then(savedEntry => {
				const { onVisibilityChanged } = this.props;

				onVisibilityChanged && onVisibilityChanged(savedEntry);
			}).catch(e => {
				// cancelled dialog
			});
	}

	delete = () => {
		const { activeCourse } = this.props;

		Prompt.areYouSure('Do you want to delete this course?').then(() => {
			return getService();
		}).then((service) => {
			return service.getObject(activeCourse.id);
		}).then((courseInstance) => {
			return courseInstance.delete('delete').then(() => {
				return true;
			}).catch((resp) => {
				if(resp && resp.message) {
					alert(resp.message);
				}
				else {
					alert('You don\'t have permission to delete this course');
				}
				return false;
			});
		}).then((success) => {
			const { onDelete } = this.props;

			onDelete && onDelete(activeCourse.id);
		});
	}

	render () {
		return (
			<div className="course-nav-menu">
				<ContentNavMenu
					{...this.props}
					activeContent={this.props.activeCourse}
					recentContentItems={this.props.recentCourses}
					onDelete={this.delete}
					onEdit={this.onEditClick}
					onPublish={this.launchPublishDialog}
					type={ContentNavMenu.COURSE}
				/>
			</div>
		);
	}
}

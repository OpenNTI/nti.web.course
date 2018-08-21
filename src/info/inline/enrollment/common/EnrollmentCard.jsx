import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

import Store from '../EnrollmentOptionsStore';

const t = scoped('course.info.inline.enrollment.common.EnrollmentCard', {
	areYouSure: 'Do you want to remove this enrollment option from the course?',
	delete: 'Delete'
});

export default class EnrollmentCard extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		postTitleCmp: PropTypes.object,
		editMode: PropTypes.bool,
		children: PropTypes.array
	}

	constructor (props) {
		super(props);

		this.store = Store.getStore();
	}

	state = {}

	onRemove = (e) => {
		e.stopPropagation();
		e.preventDefault();

		Prompt.areYouSure(t('areYouSure')).then(() => {
			this.store.removeOption(this.props.option);
		});
	}

	render () {
		const {title, description, children, editMode, option} = this.props;

		const deletable = option.hasLink('edit');

		const cls = cx('enrollment-card', {deletable});

		return (
			<div className={cls}>
				<div className="enrollment-header"><div className="title">{title}</div>{this.props.postTitleCmp}</div>
				<div className="description">{description}</div>
				{children}
				{editMode && deletable && <div className="footer"><div className="delete-controls" onClick={this.onRemove}><i className="icon-delete"/><span>{t('delete')}</span></div></div>}
			</div>
		);
	}
}

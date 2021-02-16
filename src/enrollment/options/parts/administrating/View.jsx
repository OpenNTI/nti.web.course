import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';

import { getCatalogEntryData } from '../../utils';
import Title from '../../common/Title';
import Description from '../../common/Description';
import Button from '../../common/Button';

const t = scoped('course.enrollment.options.Administrating', {
	title: 'Administrating',
	description: {
		startDate:
			'You are administering this course. Class begins %(fullStartDate)s and will be conducted fully online.',
		noStartDate:
			'You are administering this course. Class will be conducted fully online.',
	},
	open: 'Open',
});

export default class CourseEnrollmentOptionsAdministrating extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.shape({
			getStartDate: PropTypes.func,
		}),
		access: PropTypes.object,
	};

	render() {
		const { access } = this.props;

		return (
			<div className="nti-course-enrollment-options-administrating">
				<Title>{t('title')}</Title>
				<Description className="description">
					{this.renderDescription()}
				</Description>
				{access && (
					<LinkTo.Object object={access} context="open">
						<Button>{t('open')}</Button>
					</LinkTo.Object>
				)}
			</div>
		);
	}

	renderDescription() {
		const { catalogEntry } = this.props;
		const data = getCatalogEntryData(catalogEntry);

		return data.fullStartDate
			? t('description.startDate', data)
			: t('description.noStartDate', data);
	}
}

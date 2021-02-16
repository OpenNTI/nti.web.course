import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.enrollment.common.OptionDescription', {
	openTitle: 'Open Enroll',
	openDescription:
		'Get complete access to interact with all course content including the lectures, course materials, quizzes, and discussions once class is in session.',
	externalTitle: 'External Enroll',
	externalDescription: 'Enroll using a URL.',
	customExternalTitle: 'Custom External Enroll',
	customExternalDescription: 'Enroll using a provided external URL.',
	imsTitle: 'IMS Enroll',
	imsDescription: 'IMS Enroll',
	storeTitle: 'Purchasable Enroll',
	storeDescription:
		'With purchase, get complete access to interact with all course content including the lectures, course materials, quizzes, and discussions once class is in session.',
	fiveMinuteTitle: 'Five-Minute Enrollment',
	fiveMinuteDescription: 'Five-Minute Enrollment',
	unknown: 'Unknown option',
});

export const TITLE = 'title';
export const DESCRIPTION = 'description';

export const MIME_TYPES = {
	CUSTOM_EXTERNAL:
		'application/vnd.nextthought.courseware.ensyncimisexternalenrollmentoption',
	EXTERNAL: 'application/vnd.nextthought.courseware.externalenrollmentoption',
	IMS: 'application/vnd.nextthought.courseware.ozoneenrollmentoption',
	STORE: 'application/vnd.nextthought.courseware.storeenrollmentoption',
	OPEN: 'application/vnd.nextthought.courseware.openenrollmentoption',
	FIVE_MINUTE:
		'application/vnd.nextthought.courseware.fiveminuteenrollmentoption',
};

const TYPE_TO_TEXT = {
	[MIME_TYPES.CUSTOM_EXTERNAL]: {
		[TITLE]: t('customExternalTitle'),
		[DESCRIPTION]: t('customExternalDescription'),
	},
	[MIME_TYPES.EXTERNAL]: {
		[TITLE]: t('externalTitle'),
		[DESCRIPTION]: t('externalDescription'),
	},
	[MIME_TYPES.IMS]: {
		[TITLE]: t('imsTitle'),
		[DESCRIPTION]: t('imsDescription'),
	},
	[MIME_TYPES.STORE]: {
		[TITLE]: t('storeTitle'),
		[DESCRIPTION]: t('storeDescription'),
	},
	[MIME_TYPES.OPEN]: {
		[TITLE]: t('openTitle'),
		[DESCRIPTION]: t('openDescription'),
	},
	[MIME_TYPES.FIVE_MINUTE]: {
		[TITLE]: t('fiveMinuteTitle'),
		[DESCRIPTION]: t('fiveMinuteDescription'),
	},
};

export default class OptionText extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		type: PropTypes.oneOf([TITLE, DESCRIPTION]),
	};

	static getContentFor(option, type) {
		const typeObj = TYPE_TO_TEXT[option.MimeType];

		if (!typeObj) {
			return t('unknown');
		}

		const content = typeObj[type];

		return content || t('unknown');
	}

	render() {
		const { option, type } = this.props;

		return (
			<div className={type || TITLE}>
				{OptionText.getContentFor(option, type)}
			</div>
		);
	}
}

import React from 'react';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

import Title from '../../common/Title';
import Description from '../../common/Description';

const t = scoped('course.enrollment.options.NotAvailable', {
	title: 'Not Available',
	description: 'This course is not available at this time. For further assistance please contact the {{ContactLink`help desk.`}}'
});


function ContactLink (props) {
	const obj = {
		type: 'contact-support',
		message: '',
		subject: ''
	};

	return (
		<LinkTo.Object object={obj} {...props} />
	);
}

const LocaleComponents = {
	ContactLink
};

const MARK_UP_REGEX = /{{([^}}]*)}}/g;
const getMatches = (str) => {
	const matches = [];

	let match;
	while ((match = MARK_UP_REGEX.exec(str))) {
		matches.push(match);
	}

	return matches;
};

const MATCH_REGEX = /^([^`]*)`([^`]*)`$/;
const getComponentForMatch = (cmpMatch) =>{
	const match = cmpMatch.match(MATCH_REGEX);

	if (!match) { return cmpMatch; }

	const html = match[2];
	const CmpName = match[1];
	const Cmp = LocaleComponents[CmpName];


	if (!Cmp) {
		return html;
	}

	return (
		<Cmp>{html}</Cmp>
	);
};

function compileLocaleString (str) {
	const matches = getMatches(str);

	if (!matches || !matches.length) { return str; }

	let pointer = 0;
	let compiled = [];

	for (let match of matches) {
		compiled.push(str.substring(pointer, match.index));
		compiled.push(getComponentForMatch(match[1]));
		pointer = match.index + match[0].length;
	}

	return compiled;
}

export default function CourseEnrollmentOptionsNotAvailable () {
	return (
		<div>
			<Title>
				{t('title')}
			</Title>
			<Description>
				{compileLocaleString(t('description'))}
			</Description>
		</div>
	);
}

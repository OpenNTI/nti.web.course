import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Models } from 'nti-lib-interfaces';
import { Switch } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import CourseMeta from '../CourseMeta';
import DayTime from '../DayTime';
import CourseDatesPicker from '../CourseDatesPicker';

import WizardItem from './WizardItem';

const LABELS = {
	finish: 'Finish',
	getStarted: 'Get Started',
	dayAndTime: 'Day & Time',
	chooseCourseDates: 'Choose Course Dates'
};

const t = scoped('COURSE_WIZARD', LABELS);

export default class CourseWizard extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		catalogEntry: PropTypes.object,
		onCancel: PropTypes.func,
		onFinish: PropTypes.func
	}

	constructor (props) {
		super(props);

		const save = (data) => {
			return getService().then((service) => {
				return Models.courses.CatalogEntry.getFactory(service).create({key: data.identifier}).then((createdEntry) => {
					this.setState({catalogEntry: createdEntry});
					return createdEntry.save(data);
				});
			});
		};

		let catalogEntry = this.props.catalogEntry
			? this.props.catalogEntry
			: {
				save: save,
				delete: () => { return Promise.resolve(); }
			};

		this.state = {
			catalogEntry
		};
	}

	cancel = () => {
		this.props.onCancel && this.props.onCancel();
	};

	render () {
		return (<Switch.Panel className="course-panel" active="CourseMeta">
			<Switch.Container>
				<Switch.Item
					className="course-panel-content"
					name="CourseMeta"
					component={WizardItem}
					wizardCmp={CourseMeta}
					catalogEntry={this.state.catalogEntry}
					stepName={t('getStarted')}
					onCancel={this.cancel} />
				<Switch.Item
					className="course-panel-content"
					name="DayTime"
					component={WizardItem}
					wizardCmp={DayTime}
					catalogEntry={this.state.catalogEntry}
					stepName={t('dayAndTime')}
					onCancel={this.cancel}/>
				<Switch.Item
					className="course-panel-content"
					name="CourseDatesPicker"
					component={WizardItem}
					wizardCmp={CourseDatesPicker}
					catalogEntry={this.state.catalogEntry}
					stepName={t('chooseCourseDates')}
					onCancel={this.cancel}
					buttonLabel={t('finish')}
					afterSave={this.props.onFinish}/>
			</Switch.Container>
		</Switch.Panel>);
	}
}

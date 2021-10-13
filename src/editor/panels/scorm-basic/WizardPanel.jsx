import { Component } from 'react';
import PropTypes from 'prop-types';

import { WizardPanel } from '../basic';
import { saveCatalogEntry } from '../../../editor/Actions';

class ScormBasic extends Component {
	static propTypes = {
		afterSave: PropTypes.func,
		catalogEntry: PropTypes.object,
	};

	onSave = ({ done, identifier, courseName, description }) => {
		const { catalogEntry, afterSave } = this.props;

		saveCatalogEntry(
			catalogEntry,
			{
				ProviderUniqueID: identifier,
				title: courseName,
				identifier,
				RichDescription: description,
				MimeType:
					'application/vnd.nextthought.courses.scormcourseinstance', // TODO: REMOVE THIS
			},
			() => {
				afterSave && afterSave();

				done && done();
			}
		);
	};

	render() {
		return <WizardPanel {...this.props} onSave={this.onSave} />;
	}
}

export default ScormBasic;

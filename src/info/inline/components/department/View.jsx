import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.components.department.View', {
	label: 'Department Name',
	none: 'None',
});

export default class DepartmentView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
	};

	static FIELD_NAME = 'ProviderDepartmentTitle';

	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">
					{this.props.catalogEntry[DepartmentView.FIELD_NAME] ||
						t('none')}
				</div>
			</div>
		);
	}
}

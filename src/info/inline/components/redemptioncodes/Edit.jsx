import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Prompt } from '@nti/web-commons';

import Code from './code';
import Disclaimer from './Disclaimer';
import Store from './Store';

const t = scoped('course.info.inline.components.redemptioncodes.Edit', {
	label: 'Redemption Code',
	confirmDelete: 'Do you want to delete this code?'
});

const propMap = {
	loading: 'loading',
	error: 'error',
	items: 'items'
};

export default
@Store.connect(propMap)
class RedemptionCodesEdit extends React.Component {
	static propTypes = {
		courseInstance: PropTypes.shape({
			hasLink: PropTypes.func.isRequired,
			postToLink: PropTypes.func.isRequired
		}),
		items: PropTypes.arrayOf(PropTypes.object),
		onValueChange: PropTypes.func,
		store: PropTypes.shape({
			setCourse: PropTypes.func.isRequired,
			createItem: PropTypes.func.isRequired,
			deleteItem: PropTypes.func.isRequired,
		}).isRequired,
		error: PropTypes.string
	}

	componentDidMount () {
		const { store, courseInstance } = this.props;
		store.setCourse(courseInstance);
	}

	componentDidCatch (error, info) {
		this.setState({ hasError: true });
	}

	createCode = async () => {
		this.props.store.createItem();
	}

	deleteCode = (code) => {
		const { store } = this.props;
		Prompt.areYouSure(t('confirmDelete'))
			.then(() => {
				store.deleteItem(code);
			});
	}

	render () {
		const { items, error, courseInstance } = this.props;
		const canCreateCode = courseInstance.hasLink('CreateCourseInvitation');

		return (
			<div className="redemption-codes-editor columned">
				<div className="field-info">
					<div className="field-label">{t('label')}</div>
					<Disclaimer />
				</div>
				<div className="content-column">
					{(items || []).map(code => <Code key={code.getID()} code={code} onDelete={this.deleteCode} />)}
					{canCreateCode && <a className="create-code" onClick={this.createCode}>Create Code</a>}
				</div>
				{error && <div className="error">{error}</div>}
			</div>
		);
	}
}

import PropTypes from 'prop-types';

import { Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import BaseForm from './BaseForm';

const { Label, Text } = Input;

const DEFAULT_TEXT = {
	title: 'Title',
	desc: 'Description',
	launch: 'Launch URL',
	secureUrl: 'Secure Launch URL',
};

const t = scoped('nti-web-course.lti-tools.editing.forms.Manual', DEFAULT_TEXT);

const Manual = ({ onChange, onSubmit, item, renderButtons, error }) => (
	<BaseForm
		onChange={onChange}
		onSubmit={onSubmit}
		item={item}
		renderButtons={renderButtons}
	>
		<Label label={t('title')}>
			<Text
				required
				value={item.title}
				onChange={value => onChange('title', value)}
				placeholder={t('title')}
			/>
		</Label>
		<Label label={t('desc')}>
			<Text
				value={item.description}
				onChange={value => onChange('description', value)}
				placeholder={t('desc')}
			/>
		</Label>
		<div className="split-input">
			<div className="lti-base-form-input">
				<Label label={t('launch')}>
					<Text
						required
						value={item['launch_url']}
						onChange={value => onChange('launch_url', value)}
						placeholder={t('launch')}
					/>
				</Label>
				{error && error.launch_url && (
					<span className="lti-base-form-error">
						{error.launch_url}
					</span>
				)}
			</div>
			<div className="lti-base-form-input">
				<Label label={t('secureUrl')}>
					<Text
						required
						value={item['secure_launch_url']}
						onChange={value => onChange('secure_launch_url', value)}
						placeholder={t('secureUrl')}
					/>
				</Label>
				<br />
				{error && error.secure_launch_url && (
					<span className="lti-base-form-error">
						{error.secure_launch_url}
					</span>
				)}
			</div>
		</div>
	</BaseForm>
);

Manual.propTypes = {
	renderButtons: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	item: PropTypes.shape({
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		launch_url: PropTypes.string.isRequired,
		secure_launch_url: PropTypes.string.isRequired,
	}).isRequired,
	error: PropTypes.object,
};

export default Manual;

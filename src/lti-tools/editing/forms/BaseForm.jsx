import './BaseForm.scss';
import PropTypes from 'prop-types';

import { Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const { Label, Text } = Input;

const DEFAULT_TEXT = {
	consumerKey: 'Consumer Key',
	secret: 'Shared Secret',
};

const t = scoped('nti-web-course.lti-tools.editing.EditTool', DEFAULT_TEXT);

const BaseForm = ({ item, onChange, children, onSubmit, renderButtons }) => (
	<form className="lti-base-form" onSubmit={onSubmit}>
		<div className="lti-base-fields">
			<div className="split-input">
				<Label label={t('consumerKey')}>
					<Text
						value={item['consumer_key']}
						onChange={value => onChange('consumer_key', value)}
						className="lti-tool-'consumer_key'"
						placeholder={t('consumerKey')}
					/>
				</Label>
				<Label label={t('secret')}>
					<Text
						value={item.secret}
						onChange={value => onChange('secret', value)}
						className="lti-tool-Scret"
						placeholder={t('secret')}
						type="password"
					/>
				</Label>
			</div>
			{children}
		</div>
		{renderButtons}
	</form>
);

BaseForm.propTypes = {
	renderButtons: PropTypes.node,
	children: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	item: PropTypes.shape({
		consumer_key: PropTypes.string.isRequired,
		secret: PropTypes.string.isRequired,
	}).isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default BaseForm;

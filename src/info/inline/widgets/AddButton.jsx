import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.widgets.AddButton', {
	defaultLabel: 'Add',
});

//#region paint

const Button = styled.div`
	color: var(--primary-blue);
	display: flex;
	cursor: pointer;
`;

const Icon = styled('div').attrs({ className: 'add-icon' })`
	margin-right: 10px;
	border-radius: 30px;
	width: 22px;
	height: 22px;
	line-height: 18px;
	border: solid 2px;
	padding-top: 1px;
	text-align: center;

	i {
		line-height: 16px;
	}
`;

const Label = styled('div').attrs({ className: 'add-label' })`
	font-size: 14px;
	padding-top: 3px;
`;
//#endregion

AddButton.propTypes = {
	clickHandler: PropTypes.func.isRequired,
	label: PropTypes.string,
};

export default function AddButton({ clickHandler, label, className }) {
	return (
		<Button className={cx('add-button', className)} onClick={clickHandler}>
			<Icon>
				<i className="icon-add" />
			</Icon>
			<Label>{label || t('defaultLabel')}</Label>
		</Button>
	);
}

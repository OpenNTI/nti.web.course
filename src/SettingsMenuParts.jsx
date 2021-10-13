import cx from 'classnames';

const cxm = cls => props => ({ ...props, className: cx(cls, props.className) });

export const Menu = styled('div').attrs(cxm('course-settings-menu-flyout'))`
	max-width: 308px;
`;

const HeaderBox = styled.div`
	background-color: white;
	border-bottom: solid 1px #eaeaea;
	padding: 15px;
	display: flex;
`;

const RegisteredIcon = styled('div').attrs(cxm('registered-icon'))`
	background-image: url(./assets/circle-check.svg);
	width: 30px;
	min-width: 30px;
	height: 29px;
	margin: 4px 10px 0 0;
`;

const CourseName = styled('div').attrs(cxm('course-name'))`
	color: #888;
	font-size: 12px;
	line-height: 17px;
	font-weight: 400;
	max-width: 240px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const CourseStatus = styled('div').attrs(cxm('course-status'))`
	font-size: 18px;
	color: black;
	font-weight: 400;
	line-height: 24px;
`;

export const Header = ({ course, registered, t }) => (
	<HeaderBox>
		{registered && <RegisteredIcon />}
		<div>
			<CourseName>{course.title}</CourseName>
			<CourseStatus>{registered ? t('registered') : ''}</CourseStatus>
		</div>
	</HeaderBox>
);

const OptionPaint = styled('div').attrs(cxm('option'))`
	display: block;
	font-size: 14px;
	font-weight: 400;
	line-height: 19px;
	padding: 15px;
	cursor: pointer;
	color: black;
	border-bottom: solid 1px #eaeaea;
	background-color: #f7f7f7;
	text-decoration: none;
`;

export const Option = props =>
	!props.onClick && props.as !== 'a' ? null : <OptionPaint {...props} />;

const decorate = (children, icon) => (
	<>
		{icon && <i className="icon-delete" />}
		<span>{children}</span>
	</>
);

export const DestructiveOption = styled(Option).attrs(
	({ children, className, icon = true, ...props }) => ({
		...props,
		icon: void 0,
		className: cx('destructive', className),
		children: decorate(children, icon),
	})
)`
	color: red;
	i {
		margin-right: 10px;
	}
`;

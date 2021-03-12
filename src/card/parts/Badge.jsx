import cx from 'classnames';
export const CourseCardBadge = styled('div').attrs(props => ({
	...props,
	className: cx('nti-course-card-badge', props.className),
	'data-testid': 'badge',
}))`
	font: normal 600 0.625rem/2.4 var(--body-font-family);
	color: white;
	text-transform: uppercase;
	text-align: center;
	border-radius: 2px;
	padding: 0 10px;
	margin: 5px 0 5px 5px;

	@media (--respond-to-handhelds) {
		font-size: 8px;

		i {
			font-size: 8px;
		}
	}

	i {
		font-size: 1rem;
		display: inline-block;
		vertical-align: middle;
	}

	span {
		display: inline-block;
		vertical-align: middle;
	}

	&.green {
		background-color: var(--primary-green);
	}

	&.blue {
		background-color: var(--primary-blue);
	}

	&.grey {
		background-color: var(--secondary-grey);
	}

	&.black {
		background-color: rgba(0, 0, 0, 0.6);
	}

	&.orange {
		background-color: var(--secondary-orange);
	}

	&.white {
		background-color: #fff;
		color: var(--secondary-grey);
	}
`;

export default CourseCardBadge;

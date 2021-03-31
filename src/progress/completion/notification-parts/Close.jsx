// import React from 'react';

export const stop = e => (e.preventDefault(), e.stopPropagation());

export const Close = styled('a').attrs(props => ({
	href: '#',
	className: 'icon-light-x',
	onClick(e) {
		stop(e);
		props.onClick?.(e);
	},
}))`
	/* produces a 22px square glyph box with 6px padding all around */
	font-size: 34px;
	cursor: pointer;
	text-decoration: none;

	&,
	&:link {
		color: var(--primary-grey);
	}

	opacity: 0.2;

	&:hover,
	&:focus {
		opacity: 1;
	}
`;

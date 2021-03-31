import { Translate } from './strings.js';

export const ViewCertificate = styled(Translate).attrs({
	as: 'a',
	localeKey: 'viewCertificate',
})`
	/* margin: 3.125rem auto 1.25rem; */
	color: var(--tertiary-grey);
	font-size: 1rem;
	font-weight: normal;
	line-height: 1.8125;
	text-decoration: none;
`;

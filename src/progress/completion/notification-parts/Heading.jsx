import { Translate } from './strings';

export const Heading = styled(Translate).attrs({
	as: 'h1',
	localeKey: 'congratulations',
})`
	margin: 3.125rem auto 1.25rem;
	color: var(--secondary-grey);
	font-size: 2rem;
	font-weight: 300;
	line-height: 1.34375;
`;

export default Heading;

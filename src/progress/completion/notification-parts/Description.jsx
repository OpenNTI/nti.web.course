import { Translate } from './strings';

export const Description = styled(Translate).attrs({
	as: 'p',
	localeKey: 'description',
})`
	margin: 1.25rem auto 3.125rem;
	color: var(--secondary-grey);
	font-size: 1rem;
	line-height: 1.8125;
	text-align: center;
	white-space: pre-wrap;
`;

export default Description;

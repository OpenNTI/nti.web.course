
import { AssetIcon, Text } from '@nti/web-commons';

const Title = styled(Text.Base)`
	font-size: 1.875rem;
	font-weight: 300;
	line-height: 1.3;

	&.small {
		font-size: 1.25rem;
	}
`;

const Description = styled(Text.Base)`
	font-size: 0.875rem;
	line-height: 1.7;
`;

const Icon = styled(AssetIcon)`
	box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
`;

const Container = styled.div`
	display: grid;
	grid-template-columns: 100px 1fr;
	grid-template-rows: auto auto;
	gap: 0.5rem;
	padding: 3.5rem 2rem;

	&.small {
		padding: 0.5rem 1rem;
		grid-template-columns: 80px 1fr;
		grid-template-rows: 1.75rem 1fr;
		row-gap: 0.5rem;

		& ${Icon} {
			width: 80px;
			height: 100px;
			grid-column: 1 / 1;
			grid-row: 1 / 3;
		}

		& ${Title} {
			grid-column: 2 / 2;
			grid-row: 1 / 1;
		}

		& ${Description} {
			grid-column: 2 / 2;
			grid-row: 2 / 2;
		}
	}

	& ${Icon} {
		width: 100px;
		height: 125px;
		grid-column: 1 / 1;
		grid-row: 1 / span 2;
	}
`;

/**
 * Render info about the scorm package
 *
 * @param {{Item: {}, small: boolean}} props
 * @returns {JSX.Element}
 */
export default function ScormInfo({ item, small }) {
	return (
		<Container small={small}>
			<Icon src={item.icon} mimeType={item.MimeType} />
			<Title small={small}>{item.title}</Title>
			<Description>{item.description}</Description>
		</Container>
	);
}

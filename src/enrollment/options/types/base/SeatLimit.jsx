
import SeatLimitDisplay from '../../../../info/inline/components/seat-limit/components/Display';
import PaddedContainer from '../../common/PaddedContainer';

export default function BaseSeatLimit({ option }) {
	return (
		<PaddedContainer>
			<SeatLimitDisplay catalogEntry={option.catalogEntry} />
		</PaddedContainer>
	);
}

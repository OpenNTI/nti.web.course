import React from 'react';

import Container from './components/Container';
import Display from './components/Display';

SeatLimitView.hasData = (catalogEntry, { enrollmentAccess }) =>
	enrollmentAccess?.isAdministrative;
export default function SeatLimitView({ catalogEntry }) {
	return (
		<Container>
			<Display catalogEntry={catalogEntry} admin />
		</Container>
	);
}

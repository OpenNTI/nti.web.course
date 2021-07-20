export { default as View } from './View';
export { default as Edit } from './Edit';

export const ID = 'COURSE_SEAT_LIMIT';

const MimeType = 'application/vnd.nextthought.courses.seatlimit';

export function saveSeatLimit(course, instance, { PendingSeatLimit }) {
	const { SeatLimit } = PendingSeatLimit ?? {};
	const payload = SeatLimit
		? { seat_limit: { MimeType, max_seats: SeatLimit.MaxSeats } }
		: { seat_limit: null };

	return course.save(payload);
}

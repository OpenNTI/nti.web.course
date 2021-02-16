import { getScormStatus } from '../EnrollmentProgress';

/* eslint-env jest */
describe('Enrollment Progress', () => {
	test('Null CourseProgress', () => {
		const enrollment = { CourseProgress: null };
		expect(getScormStatus(enrollment)).toBe('');
	});

	test('Null Completed', () => {
		const enrollment = { CourseProgress: {} };
		expect(getScormStatus(enrollment)).toBe('');
	});

	test('Passed', () => {
		const enrollment = {
			CourseProgress: {
				Completed: true,
				CompletedItem: { Success: true },
			},
		};
		expect(getScormStatus(enrollment)).toBe('passed');
	});

	test('Failed', () => {
		const enrollment = {
			CourseProgress: {
				Completed: true,
				CompletedItem: { Success: false },
			},
		};
		expect(getScormStatus(enrollment)).toBe('failed');
	});

	test('Incompleted', () => {
		const enrollment = { CourseProgress: { Completed: false } };
		expect(getScormStatus(enrollment)).toBe('incomplete');
	});
});

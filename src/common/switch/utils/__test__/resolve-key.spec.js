/* eslint-env jest */
import resolveKey from '../resolve-key';
import {NEXT, PREVIOUS} from '../../Constants';

function makeItem (name) {
	return {
		props: {name}
	};
}

describe('resolve-key', () => {
	test('Resolves name', () => {
		const names = ['a', 'b', 'c', 'd'];
		const key = resolveKey(names.map(makeItem), 'a', 'b');

		expect(key).toEqual('b');
	});

	test('Resolve NEXT', () => {
		const names = ['a', 'b', 'c', 'd'];
		const key = resolveKey(names.map(makeItem), 'a', NEXT);

		expect(key).toEqual('b');
	});

	test('Resolve PREVIOUS', () => {
		const names = ['a', 'b', 'c', 'd'];
		const key = resolveKey(names.map(makeItem), 'b', PREVIOUS);

		expect(key).toEqual('a');
	});
});

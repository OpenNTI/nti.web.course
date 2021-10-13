/* eslint-env jest */
import TestRenderer from 'react-test-renderer';

import { Input } from '@nti/web-commons';

import Tab from '../Tab';

describe('Course Navigation Tabs Editor Tab', () => {
	test('snapshot', () => {
		const tab = { id: 'activity', label: 'Stream', default: 'Activity' };

		const testRender = TestRenderer.create(<Tab tab={tab} />);

		expect(testRender.toJSON()).toMatchSnapshot();
	});

	test('Renders a text input with appropriate value and placeholder', () => {
		const tab = {
			id: 'activity',
			label: 'Test Tab',
			default: 'Test Tab Default',
		};
		const testRender = TestRenderer.create(<Tab tab={tab} />);

		const inputCmp = testRender.root.findByType(Input.Text);

		expect(inputCmp.props.value).toEqual(tab.label);
		expect(inputCmp.props.placeholder).toEqual(tab.default);
	});

	test('Changing the input calls onTabChange with the correct arguments', () => {
		const tab = {
			id: 'activity',
			label: 'Test Tab',
			default: 'Test TabDefault',
		};
		const onTabChange = jest.fn();
		const testRender = TestRenderer.create(
			<Tab tab={tab} onTabChange={onTabChange} />
		);

		const inputCmp = testRender.root.findByType(Input.Text);

		inputCmp.props.onChange('Test Tab Update');

		expect(onTabChange).toHaveBeenCalledWith('activity', 'Test Tab Update');
	});
});

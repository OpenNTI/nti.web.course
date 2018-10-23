import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';

import OptionList from '../OptionList';

class TestCmp extends React.Component {
	static propTypes = {
		option: PropTypes.object,
		selected: PropTypes.bool
	}

	render () {
		const {option, selected} = this.props;

		return (
			<div>
				<div>Option {option.id}</div>
				{selected && <div>Selected</div>}
			</div>
		);
	}
}

/* eslint-env jest */
describe('Course enrollment options common option list ', () => {
	test('Two items, second selected', async () => {
		const selected = {
			ListItem: TestCmp,
			id: '2'
		};

		const options = [
			{
				ListItem: TestCmp,
				id: '1'
			},
			selected
		];

		const cmp = renderer.create(<OptionList options={options} selected={selected}/>);

		const tree = cmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

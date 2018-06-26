import React from 'react';
import PropTypes from 'prop-types';

export default class CourseEnrollmentOptionList extends React.Component {
	static propTypes = {
		options: PropTypes.arrayOf(
			PropTypes.shape({
				ListItem: PropTypes.func.isRequired
			})
		),
		selectedOption: PropTypes.object,
		selectOption: PropTypes.func
	}


	selectOption = (option) => {
		const {selectOption} = this.props;

		if (selectOption) {
			selectOption(option);
		}
	}


	render () {
		const {options, selectedOption} = this.props;

		return (
			<ul className="nti-course-enrollment-option-list">
				{options.map((option, key) => {
					const {ListItem} = option;

					return (
						<li key={key}>
							<ListItem option={option} selected={selectedOption === option} onSelect={this.selectOption} />
						</li>
					);
				})}
			</ul>
		);
	}
}

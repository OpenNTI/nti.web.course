import './OptionList.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class CourseEnrollmentOptionList extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		options: PropTypes.arrayOf(
			PropTypes.shape({
				ListItem: PropTypes.func.isRequired
			})
		),
		selected: PropTypes.object,
		selectOption: PropTypes.func
	}


	selectOption = (option) => {
		const {selectOption} = this.props;

		if (selectOption) {
			selectOption(option);
		}
	}


	render () {
		const {options, selected, className} = this.props;

		return (
			<ul className={cx('nti-course-enrollment-option-list', className, {selected})}>
				{options.map((option, key) => {
					const {ListItem} = option;
					const isSelected = option === selected;

					return (
						<li key={key} className={cx({selected: isSelected && options.length > 1})}>
							<ListItem option={option} onSelect={this.selectOption} selected={isSelected}/>
						</li>
					);
				})}
			</ul>
		);
	}
}

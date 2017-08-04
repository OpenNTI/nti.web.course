import React from 'react';
import PropTypes from 'prop-types';
import { DayPickerRange } from 'nti-web-commons';

export default class CourseDatesPicker extends React.Component {
	static propTypes = {
		startDate: PropTypes.object,
		endDate: PropTypes.object,
		updateStartDate: PropTypes.func,
		updateEndDate: PropTypes.func
	}

	constructor (props) {
		super(props);
		this.state = {selectedType: 'Start'};
	}

	render () {
		return (<div className="course-panel-choosedates">
			<DayPickerRange
				startDate={this.props.startDate} endDate={this.props.endDate}
				updateStartDate={this.props.updateStartDate}
				updateEndDate={this.props.updateEndDate}
			/>
		</div>
		);
	}
}

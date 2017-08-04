import React from 'react';
import PropTypes from 'prop-types';
import { Input} from 'nti-web-commons';

export default class CourseMeta extends React.Component {
	static propTypes = {
		courseName: PropTypes.string,
		identifier: PropTypes.string,
		description: PropTypes.string,
		updateState: PropTypes.func
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	updateState () {
		if(this.props.updateState) {
			this.props.updateState(this.state.courseName, this.state.identifier, this.state.description);
		}
	}

	render () {
		const updateCourseName = (value) => {
			this.setState({courseName : value}, () => {
				this.updateState();
			});
		};

		const updateIDNumber = (value) => {
			this.setState({identifier : value}, () => {
				this.updateState();
			});
		};

		const updateDescription = (value) => {
			this.setState({description : value}, () => {
				this.updateState();
			});
		};

		return (<div className="course-panel-getstarted-form">
			<Input.Text placeholder="Course Name" value={this.props.courseName} onChange={updateCourseName}/>
			<Input.Text placeholder="Identification Number (i.e. UCOL-3224)" value={this.props.identifier} onChange={updateIDNumber}/>
			<Input.Text placeholder="Description" className="area" value={this.props.description} onChange={updateDescription}/>
		</div>
		);
	}
}

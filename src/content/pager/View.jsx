import React from 'react';
import PropTypes from 'prop-types';

import Store from './Store';

export default
@Store.connect()
class ContentPager extends React.Component {
	static deriveBindingFromProps (props) {
		return {
			course: props.course,
			lesson: props.lesson,
			selection: props.selection
		};
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		lesson: PropTypes.oneOfType(
			PropTypes.string,
			PropTypes.object
		).isRequired,
		selection: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.arrayOf(
				PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.object
				])
			)
		])
	}


	render () {
		return (
			<div>
				Content Pager
			</div>
		);
	}
}

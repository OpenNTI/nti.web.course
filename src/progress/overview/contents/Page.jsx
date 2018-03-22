import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';

import Overview from '../../../overview/lesson/OverviewContents';
import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import Loading from './Loading';

ExtraColumn.propTypes = {
	item: PropTypes.object
};
function ExtraColumn ({item}) {
	return (
		<div>
			Extra Column
		</div>
	);
}

export default class ProgressOverviewContentsPage extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		page: PropTypes.object,
		error: PropTypes.object,
		pageHeight: PropTypes.number,
		course: PropTypes.object
	}


	static childContextTypes = {
		router: PropTypes.object
	}


	getChildContext () {
		return {
			router: {
				disabled: true
			}
		};
	}


	render () {
		const {loading, page, pageHeight, course} = this.props;
		const overview = page && page.Items[0];
		const outlineNode = overview && overview.parent();
		const available = outlineNode && outlineNode.getAvailableBeginning();
		const ending = outlineNode && outlineNode.getAvailableEnding();
		const dateFormat = 'MMMM, D YYYY';

		return (
			<div className="progress-overview-contents-page">
				{loading && (<Loading pageHeight={pageHeight} />)}
				{overview && overview.Items && overview.Items.length && (
					<React.Fragment>
						<PaddedContainer className="header">
							<div className="sub-title">
								{available && (<DateTime format={dateFormat} date={available} />)}
								{!available && ending && (<DateTime format={dateFormat} date={ending} />)}
							</div>
							<div className="title">
								{overview.title}
							</div>
						</PaddedContainer>
						<Overview
							overview={overview}
							outlineNode={outlineNode}
							course={course}

							layout={Overview.List}
							requiredOnly={true}

							extraColumns={[ExtraColumn]}
						/>
					</React.Fragment>
				)}
			</div>
		);
	}
}

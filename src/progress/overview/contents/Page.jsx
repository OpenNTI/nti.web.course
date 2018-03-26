import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DateTime} from 'nti-web-commons';

import Overview from '../../../overview/lesson/OverviewContents';
import PaddedContainer from '../../../overview/lesson/common/PaddedContainer';

import {filterOutNonRequiredItems} from './utils';
import Loading from './Loading';
import CompletedDate from './CompletedDate';


export default class ProgressOverviewContentsPage extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		page: PropTypes.object,
		error: PropTypes.object,
		pageHeight: PropTypes.number,
		course: PropTypes.object,
		completedItems: PropTypes.object
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

	getOverview () {
		const {page, completedItems} = this.props;
		const overview = page && page.Items[0];

		if (!overview) { return null; }



		return filterOutNonRequiredItems(overview, completedItems);
	}


	render () {
		const {loading, pageHeight, course, completedItems} = this.props;
		const overview = this.getOverview();
		const outlineNode = overview && overview.parent();
		const available = outlineNode && outlineNode.getAvailableBeginning();
		const ending = outlineNode && outlineNode.getAvailableEnding();
		const dateFormat = 'MMMM, D YYYY';
		const empty = overview && (!overview.Items || !overview.Items.length);

		return (
			<div className={cx('progress-overview-contents-page', {empty})}>
				{loading && (<Loading pageHeight={pageHeight} />)}
				{!loading && overview && (
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
						{
							overview.Items && overview.Items.length ?
								(
									<Overview
										overview={overview}
										outlineNode={outlineNode}
										course={course}

										layout={Overview.List}
										requiredOnly={true}

										completedItems={completedItems}
										extraColumns={[CompletedDate]}
									/>
								) :
								null
						}

					</React.Fragment>
				)}
			</div>
		);
	}
}

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Loading } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Styles from './LoadAll.css';

const cx = classnames.bind(Styles);
const t = scoped('course.info.inline.components.facilitators.Edit', {
	seeAll: 'See All Facilitators',
	hideAll: 'Hide Hidden Facilitators',
});

LoadAllFacilitators.propTypes = {
	hasMoreFacilitators: PropTypes.bool,
	showingFullFacilitatorSet: PropTypes.bool,
	loadingFullFacilitators: PropTypes.bool,
	showFullFacilitatorSet: PropTypes.func,
	hideFullFacilitatorSet: PropTypes.func,
};
export default function LoadAllFacilitators({
	hasMoreFacilitators,
	showingFullFacilitatorSet,
	loadingFullFacilitators,
	showFullFacilitatorSet,
	hideFullFacilitatorSet,
}) {
	if (!hasMoreFacilitators) {
		return null;
	}

	const handler = showingFullFacilitatorSet
		? hideFullFacilitatorSet
		: showFullFacilitatorSet;

	return (
		<div className={cx('load-all-facilitators')}>
			{loadingFullFacilitators ? (
				<Loading.Spinner />
			) : (
				<span className={cx('load-all')} onClick={handler}>
					{showingFullFacilitatorSet ? t('hideAll') : t('seeAll')}
				</span>
			)}
		</div>
	);
}

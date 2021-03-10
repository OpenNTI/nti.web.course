import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { LinkTo } from '@nti/web-routing';
import { EmptyList, FillToBottom } from '@nti/web-commons';
import { NoteSummary } from '@nti/web-discussions';

import styles from './Sidebar.css';

const cx = classnames.bind(styles);

export default class Sidebar extends React.Component {
	static propTypes = {
		notes: PropTypes.array,
	};

	render() {
		const { notes = [] } = this.props;
		const empty = !(notes || []).length;

		return (
			<FillToBottom limit className={cx('sidebar-container')}>
				{empty ? (
					<EmptyList
						className={cx('empty')}
						type="user-generated-data"
					/>
				) : (
					<ul className={cx('note-list')}>
						{notes.map(note => (
							<li key={note.getID()}>
								<LinkTo.Object object={note}>
									<NoteSummary note={note} />
								</LinkTo.Object>
							</li>
						))}
					</ul>
				)}
			</FillToBottom>
		);
	}
}

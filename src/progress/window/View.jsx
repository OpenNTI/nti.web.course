import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {DisplayName} from '@nti/web-commons';
import {getService} from '@nti/web-client';

import UserGradeCard from '../widgets/UserGradeCard';

import Pager from './Pager';

const t = scoped('course.components.progress-window.View', {
	email: 'Email',
	export: 'Export',
	search: 'Search'
});

export default class ProgressWindow extends React.Component {
	static propTypes = {
		user: PropTypes.string,
		initialPage: PropTypes.number,
		totalPages: PropTypes.number,
		onClose: PropTypes.func,
		onEmail: PropTypes.func,
		prevLink: PropTypes.string,
		nextLink: PropTypes.string
	}

	constructor (props) {
		super(props);

		this.state = {
			currentPage: props.initialPage,
			currentUser: props.user,
			prevLink: props.prevLink,
			nextLink: props.nextLink
		};
	}

	close = () => {
		const {onClose} = this.props;

		onClose && onClose();
	}

	onPageChange = async (newPage) => {
		const {prevLink, nextLink, currentPage} = this.state;
		const service = await getService();

		let newData;

		if(newPage > currentPage && nextLink) {
			newData = await service.get(nextLink);
		}
		else if(newPage < currentPage && prevLink) {
			newData = await service.get(prevLink);
		}

		if(newData) {
			this.setState({
				currentPage: newPage,
				prevLink: newData.Links && newData.Links.filter(x => x.rel === 'batch-prev').map(x => x.href)[0],
				nextLink: newData.Links && newData.Links.filter(x => x.rel === 'batch-next').map(x => x.href)[0],
				currentUser: newData.Items[0].Username
			});
		}
	}

	renderHeader () {
		return (
			<div className="header">
				<DisplayName entity={this.state.currentUser}/>
				<Pager
					current={this.state.currentPage}
					total={this.props.totalPages}
					onPageChange={this.onPageChange}
					prevLink={this.state.prevLink}
					nextLink={this.state.nextLink}/>
				<div className="close-button" onClick={this.close}>
					<i className="icon-light-x"/>
				</div>
			</div>
		);
	}

	renderStudentInfo () {
		// TODO: Pull actual user grade data
		return (
			<div className="student-info">
				<UserGradeCard grade={87} user={this.state.currentUser}/>
			</div>
		);
	}

	onSearchChange = (searchTerm) => {
		this.setState({searchTerm});
	}

	onEmail = () => {
		const {onEmail} = this.props;

		onEmail && onEmail(this.state.currentUser);
	}

	renderControls () {
		// when searching is supported, add these in the toolbar
		// <i className="icon-search"/>
		// <Input.Text placeholder={t('search')} value={this.state.searchTerm} onChange={this.onSearchChange}/>
		//
		// What to do for export?
		// <div className="btn secondary">{t('export')}</div>

		return (
			<div className="toolbar">
				{this.props.onEmail ? <div className="btn primary" onClick={this.onEmail}>{t('email')}</div> : null}
			</div>
		);
	}

	renderContent () {
		// insert infinite-scrolling content item list
	}

	renderItems () {
		return (
			<div className="content-items">
				{this.renderContent()}
			</div>
		);
	}

	render () {
		return (
			<div className="progress-window">
				{this.renderHeader()}
				{this.renderStudentInfo()}
				{this.renderControls()}
				{this.renderItems()}
			</div>
		);
	}
}

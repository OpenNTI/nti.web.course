import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Input, DialogButtons} from '@nti/web-commons';
import {getService} from '@nti/web-client';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.common.PositionSelect', {
	save: 'Save',
	cancel: 'Cancel'
});

// TODO: belongs in OverviewGroup model or somewhere else?
const COLOR_CHOICES = [
	'F9824E',
	'F5D420',
	'81C8DC',
	'A5C959',
	'F9869E',
	'A8699D',
	'C7D470',
	'6B718E',
	'D8AF7E',
	'59C997',
	'5474D6',
	'CE78E0',
	'F5A620',
	'7B8CDF',
	'D3545B',
	'728957'
];

export default class LessonOverviewPositionSelect extends React.Component {
	attachSectionFlyoutRef = x => this.sectionFlyout = x

	attachRankFlyoutRef = x => this.rankFlyout = x

	static propTypes = {
		lessonOverview: PropTypes.object.isRequired
	}

	state = {}

	componentDidMount () {
		this.setState({selectedRank: 1, selectedSection: this.props.lessonOverview.Items[0]});
	}

	renderSectionInfo (section) {
		return (
			<div className="section-select-info">
				<div className="color-preview" style={{backgroundColor: '#' + section.accentColor}}/>
				<div className="name">{section.title}</div>
			</div>
		);
	}

	renderSectionTrigger () {
		return <div className="section-trigger">{this.renderSectionInfo(this.state.selectedSection || {})}</div>;
	}

	renderSectionOption = (section) => {
		const className = cx('section-option', {selected: section === this.state.selectedSection});

		return (
			<div
				className={className}
				key={section.getID()}
				onClick={() => {
					this.setState({selectedSection: section});

					if(this.sectionFlyout) {
						this.sectionFlyout.dismiss();
					}
				}}
			>
				{this.renderSectionInfo(section)}
			</div>
		);
	}

	enterCreateMode = () => {
		this.setState({inCreationMode: true, hexValue: COLOR_CHOICES[0]});
	}

	onCancel = () => {
		this.setState({inCreationMode: false, hexValue: null, sectionName: null});
	}

	onSave = async () => {
		const {lessonOverview} = this.props;
		const {sectionName, hexValue} = this.state;

		if(!sectionName) {
			this.setState({error: 'Title is required'});
			return;
		}

		if(!hexValue) {
			this.setState({error: 'Color is required'});
			return;
		}

		try {
			const contentsLink = lessonOverview.getLink('ordered-contents');

			if(!contentsLink) {
				this.setState({error: 'No contents link'});
				return;
			}

			const content = {
				MimeType: 'application/vnd.nextthought.nticourseoverviewgroup',
				accentColor: hexValue,
				title: sectionName
			};

			const service = await getService();
			const newSection = await service.postParseResponse(contentsLink, content);
			await lessonOverview.refresh();

			this.setState({selectedSection: newSection, inCreationMode: false, hexValue: null, sectionName: null});
		}
		catch (e) {
			this.setState({error: e.message || e});
		}
	}

	sectionNameChange = (val) => {
		this.setState({sectionName: val});
	}

	hexValueChange = (val) => {
		this.setState({hexValue: val});
	}

	renderColorPreview = (hex) => {
		const cls = cx('color-sample', {selected: hex === this.state.hexValue});

		return (
			<li
				className={cls}
				onClick={() => {this.setState({hexValue: hex});}}
				style={{backgroundColor: '#' + hex}}
			/>
		);
	}

	renderCreateNewSection () {
		const {error} = this.state;

		return (
			<div className="create-section-form">
				{error && <div className="error">{error}</div>}
				<div className="contents">
					<Input.Text className="name-input" value={this.state.sectionName} onChange={this.sectionNameChange} placeholder="Section Name"/>
					<div className="label">Choose a color</div>
					<span>#</span><Input.Text value={this.state.hexValue} onChange={this.hexValueChange} className="hex-input"/>
					<ul className="color-samples">
						{COLOR_CHOICES.map(this.renderColorPreview)}
					</ul>
				</div>
				<DialogButtons
					buttons={[
						{
							label: t('cancel'),
							onClick: this.onCancel,
						},
						{
							label: t('save'),
							onClick: this.onSave
						}
					]}
				/>
			</div>
		);
	}

	renderSectionSelect () {
		return (
			<Flyout.Triggered
				className="section-select"
				trigger={this.renderSectionTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachSectionFlyoutRef}
			>
				<div className="section-select-flyout">
					{!this.state.inCreationMode && this.props.lessonOverview.Items.map(this.renderSectionOption)}
					{!this.state.inCreationMode && <div className="add-new" onClick={this.enterCreateMode}>+ Add New</div>}
					{this.state.inCreationMode && this.renderCreateNewSection()}
				</div>
			</Flyout.Triggered>
		);
	}

	renderRankTrigger (disabled) {
		const className = cx('rank-trigger', {disabled});

		return <div className={className}>{this.state.selectedRank}</div>;
	}

	renderRankOption = (rank) => {
		return (
			<li
				key={rank}
				onClick={() => {
					this.setState({selectedRank: rank + 1});

					if(this.rankFlyout) {
						this.rankFlyout.dismiss();
					}
				}}
				className="rank-option"
			>
				{rank + 1}
			</li>
		);
	}

	renderRankSelect () {
		const {selectedSection} = this.state;

		if(!selectedSection) {
			return null;
		}

		const {Items} = selectedSection;

		if(!Items || Items.length === 0) {
			return this.renderRankTrigger(true);
		}

		let availableRanks = Items.map((val, i) => i);

		availableRanks.push(availableRanks.length);

		return (
			<Flyout.Triggered
				className="rank-select"
				trigger={this.renderRankTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachRankFlyoutRef}
			>
				<ul className="rank-select-flyout">
					{availableRanks.map(this.renderRankOption)}
				</ul>
			</Flyout.Triggered>
		);
	}

	render () {
		return <div className="overview-position-select">{this.renderSectionSelect()}{this.renderRankSelect()}</div>;
	}
}

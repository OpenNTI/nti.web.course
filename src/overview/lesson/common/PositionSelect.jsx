import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Input, DialogButtons} from '@nti/web-commons';
import {getService} from '@nti/web-client';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.common.PositionSelect', {
	save: 'Save',
	cancel: 'Cancel',
	invalidColor: 'Please enter a valid color.',
	missingRequired: 'Please fill out all required fields.',
	noLink: 'No content link.',
	addNew: '+ Create a section',
	sectionName: 'Section Name',
	chooseColor: 'Choose a Color'
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

const hex16Re = /^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i;
const hex8Re = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i;

const isValidHexColor = function (code) {
	return hex16Re.test(code) || hex8Re.test(code);
};

export default class LessonOverviewPositionSelect extends React.Component {
	attachSectionFlyoutRef = x => this.sectionFlyout = x
	attachRankFlyoutRef = x => this.rankFlyout = x

	static propTypes = {
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		item: PropTypes.object,
		onChange: PropTypes.func
	}

	state = {}

	async componentDidMount () {
		const {lessonOverview, overviewGroup, onChange, item} = this.props;

		const providedOverviewGroup = lessonOverview.Items.filter(x=>x.getID() === overviewGroup.getID())[0];

		let selectedRank = (providedOverviewGroup.Items || []).length + 1;

		if(item) {
			(providedOverviewGroup.Items || []).forEach((i, index) => {
				if(i.NTIID === item.NTIID) {
					selectedRank = index + 1;
				}
			});
		}

		const service = await getService();

		// initial state is the last position of the provided overview group
		this.setState({
			selectedRank,
			selectedSection: providedOverviewGroup,
			canInputColor: service.capabilities.canDoAdvancedEditing
		});

		if(onChange) {
			onChange(providedOverviewGroup, selectedRank);
		}
	}

	renderSectionInfo (section) {
		return (
			<div className="section-select-info">
				<div className="color-preview" style={{backgroundColor: '#' + section.accentColor}}/>
				<div className="name">{section.title}</div>
			</div>
		);
	}

	renderSectionOption = (section) => {
		const className = cx('section-option', {selected: section === this.state.selectedSection});

		return (
			<div
				className={className}
				key={section.getID()}
				onClick={() => {
					// auto-select the last rank available for the newly selected section
					this.updateValues(section, (section.Items || []).length + 1);

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

	updateValues (selectedSection, selectedRank) {
		const {onChange} = this.props;

		this.setState({selectedSection, selectedRank});

		if(onChange) {
			onChange(selectedSection, selectedRank);
		}
	}

	onSave = async () => {
		const {lessonOverview} = this.props;
		const {sectionName, hexValue} = this.state;

		this.setState({savingSection: true, error: null, errorField: null});

		if(!sectionName) {
			this.setState({savingSection: false, error: t('missingRequired'), errorField: 'sectionName'});
			return;
		}

		if(!hexValue || !isValidHexColor(hexValue)) {
			this.setState({savingSection: false, error: t('invalidColor')});
			return;
		}

		try {
			const contentsLink = lessonOverview.getLink('ordered-contents');

			if(!contentsLink) {
				this.setState({error: t('noLink')});
				return;
			}

			const content = {
				MimeType: 'application/vnd.nextthought.nticourseoverviewgroup',
				accentColor: hexValue && hexValue.replace(/#/g, ''),
				title: sectionName
			};

			const service = await getService();
			const newSection = await service.postParseResponse(contentsLink, content);
			await lessonOverview.refresh();

			this.updateValues(newSection, 1);

			this.setState({savingSection: false, inCreationMode: false, hexValue: null, sectionName: null});
		}
		catch (e) {
			this.setState({savingSection: false, error: e.message || e});
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
		const {error, errorField, savingSection, canInputColor} = this.state;

		const sectionNameInputCls = cx('name-input', {invalid: errorField === 'sectionName'});

		return (
			<div className="create-section-form">
				{error && <div className="error">{error}</div>}
				<div className="contents">
					<Input.Text className={sectionNameInputCls} value={this.state.sectionName} onChange={this.sectionNameChange} placeholder={t('sectionName')}/>
					<div className="label">{t('chooseColor')}</div>
					{canInputColor && <span>#</span>}
					{canInputColor && <Input.Text value={this.state.hexValue} onChange={this.hexValueChange} className="hex-input"/>}
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
							disabled: savingSection,
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
				trigger={<div className="section-trigger">{this.renderSectionInfo(this.state.selectedSection || {})}<i className="icon-chevron-down"/></div>}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachSectionFlyoutRef}
			>
				<div className="section-select-flyout">
					{!this.state.inCreationMode && this.props.lessonOverview.Items.map(this.renderSectionOption)}
					{!this.state.inCreationMode && <div className="add-new" onClick={this.enterCreateMode}>{t('addNew')}</div>}
					{this.state.inCreationMode && this.renderCreateNewSection()}
				</div>
			</Flyout.Triggered>
		);
	}

	renderRankTrigger (disabled) {
		const className = cx('rank-trigger', {disabled});

		return <div className={className}>{this.state.selectedRank}<i className="icon-chevron-down"/></div>;
	}

	renderRankOption = (rank) => {
		const className = cx('rank-option', {selected: rank + 1 === this.state.selectedRank});

		return (
			<li
				key={rank}
				onClick={() => {
					this.updateValues(this.state.selectedSection, rank + 1);

					if(this.rankFlyout) {
						this.rankFlyout.dismiss();
					}
				}}
				className={className}
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

		if(!this.props.item) {
			// if we're editing, the extra position option doesn't make sense
			// so only append this option when there is no provided item
			availableRanks.push(availableRanks.length);
		}

		return (
			<Flyout.Triggered
				className="rank-select"
				trigger={this.renderRankTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
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

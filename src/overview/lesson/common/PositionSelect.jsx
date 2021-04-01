import './PositionSelect.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Flyout, Input, DialogButtons } from '@nti/web-commons';
import { getService } from '@nti/web-client';
import { scoped } from '@nti/lib-locale';

import {AccentPicker} from '../items/group';

const t = scoped('course.overview.lesson.common.PositionSelect', {
	save: 'Save',
	cancel: 'Cancel',
	invalidColor: 'Please enter a valid color.',
	missingRequired: 'Please fill out all required fields.',
	noLink: 'No content link.',
	addNew: '+ Create a section',
	sectionName: 'Section Name',
	chooseColor: 'Choose a Color',
});

export default class LessonOverviewPositionSelect extends React.Component {
	attachSectionFlyoutRef = x => (this.sectionFlyout = x);
	attachRankFlyoutRef = x => (this.rankFlyout = x);

	static propTypes = {
		lessonOverview: PropTypes.object.isRequired,
		overviewGroup: PropTypes.object.isRequired,
		item: PropTypes.object,
		onChange: PropTypes.func,
	};

	state = {};

	async componentDidMount() {
		const { lessonOverview, overviewGroup, onChange, item } = this.props;

		const providedOverviewGroup = lessonOverview.Items.filter(
			x => x.getID() === overviewGroup.getID()
		)[0];

		let selectedRank = (providedOverviewGroup.Items || []).length + 1;

		if (item) {
			(providedOverviewGroup.Items || []).forEach((i, index) => {
				if (i.NTIID === item.NTIID) {
					selectedRank = index + 1;
				}
			});
		}

		const service = await getService();

		// initial state is the last position of the provided overview group
		this.setState({
			selectedRank,
			selectedSection: providedOverviewGroup,
			canInputColor: service.capabilities.canDoAdvancedEditing,
		});

		if (onChange) {
			onChange(providedOverviewGroup, selectedRank);
		}
	}

	renderSectionInfo(section) {
		return (
			<div className="section-select-info">
				<div
					className="color-preview"
					style={{ backgroundColor: '#' + section.accentColor }}
				/>
				<div className="name">{section.title}</div>
			</div>
		);
	}

	renderSectionOption = section => {
		const className = cx('section-option', {
			selected: section === this.state.selectedSection,
		});

		return (
			<div
				className={className}
				key={section.getID()}
				onClick={() => {
					// auto-select the last rank available for the newly selected section
					this.updateValues(
						section,
						(section.Items || []).length + 1
					);

					if (this.sectionFlyout) {
						this.sectionFlyout.dismiss();
					}
				}}
			>
				{this.renderSectionInfo(section)}
			</div>
		);
	};

	enterCreateMode = () => {
		this.setState({ inCreationMode: true, accentColor: AccentPicker.defaultColor});
	};

	onCancel = () => {
		this.setState({
			inCreationMode: false,
			hexValue: null,
			sectionName: null,
		});
	};

	updateValues(selectedSection, selectedRank) {
		const { onChange } = this.props;

		this.setState({ selectedSection, selectedRank });

		if (onChange) {
			onChange(selectedSection, selectedRank);
		}
	}

	onSave = async () => {
		const { lessonOverview } = this.props;
		const { sectionName, accentColor } = this.state;
		const hexValue = accentColor.hex.toString();

		this.setState({ savingSection: true, error: null, errorField: null });

		if (!sectionName) {
			this.setState({
				savingSection: false,
				error: t('missingRequired'),
				errorField: 'sectionName',
			});
			return;
		}

		try {
			const contentsLink = lessonOverview.getLink('ordered-contents');

			if (!contentsLink) {
				this.setState({ error: t('noLink') });
				return;
			}

			const content = {
				MimeType: 'application/vnd.nextthought.nticourseoverviewgroup',
				accentColor: hexValue && hexValue.replace(/#/g, ''),
				title: sectionName,
			};

			const service = await getService();
			const newSection = await service.postParseResponse(
				contentsLink,
				content
			);
			await lessonOverview.refresh();

			this.updateValues(newSection, 1);

			this.setState({
				savingSection: false,
				inCreationMode: false,
				hexValue: null,
				sectionName: null,
			});
		} catch (e) {
			this.setState({ savingSection: false, error: e.message || e });
		}
	};

	sectionNameChange = val => {
		this.setState({ sectionName: val });
	};

	hexValueChange = val => {
		this.setState({ hexValue: val });
	};

	onAccentChange = accentColor => this.setState({accentColor});

	renderColorPreview = hex => {
		const cls = cx('color-sample', {
			selected: hex === this.state.hexValue,
		});

		return (
			<li
				className={cls}
				onClick={() => {
					this.setState({ hexValue: hex });
				}}
				style={{ backgroundColor: '#' + hex }}
			/>
		);
	};

	renderCreateNewSection() {
		const { error, errorField, savingSection } = this.state;

		const sectionNameInputCls = cx('name-input', {
			invalid: errorField === 'sectionName',
		});

		debugger;

		return (
			<div className="create-section-form">
				{error && <div className="error">{error}</div>}
				<div className="contents">
					<Input.Text
						className={sectionNameInputCls}
						value={this.state.sectionName}
						onChange={this.sectionNameChange}
						placeholder={t('sectionName')}
					/>
					<AccentPicker value={this.state.accentColor} onChange={this.onAccentChange} />
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
							onClick: this.onSave,
						},
					]}
				/>
			</div>
		);
	}

	renderSectionSelect() {
		const flyoutProps = {};

		if (this.state.inCreationMode) {
			flyoutProps.open = true;
		}


		return (
			<Flyout.Triggered
				className="section-select"
				trigger={
					<div className="section-trigger">
						{this.renderSectionInfo(
							this.state.selectedSection || {}
						)}
						<i className="icon-chevron-down" />
					</div>
				}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachSectionFlyoutRef}
				{...flyoutProps}
			>
				<div className="section-select-flyout">
					{!this.state.inCreationMode &&
						this.props.lessonOverview.Items.map(
							this.renderSectionOption
						)}
					{!this.state.inCreationMode && (
						<div className="add-new" onClick={this.enterCreateMode}>
							{t('addNew')}
						</div>
					)}
					{this.state.inCreationMode && this.renderCreateNewSection()}
				</div>
			</Flyout.Triggered>
		);
	}

	renderRankTrigger(disabled) {
		const className = cx('rank-trigger', { disabled });

		return (
			<div className={className}>
				{this.state.selectedRank}
				<i className="icon-chevron-down" />
			</div>
		);
	}

	renderRankOption = rank => {
		const className = cx('rank-option', {
			selected: rank + 1 === this.state.selectedRank,
		});

		return (
			<li
				key={rank}
				onClick={() => {
					this.updateValues(this.state.selectedSection, rank + 1);

					if (this.rankFlyout) {
						this.rankFlyout.dismiss();
					}
				}}
				className={className}
			>
				{rank + 1}
			</li>
		);
	};

	renderRankSelect() {
		const { selectedSection } = this.state;

		if (!selectedSection) {
			return null;
		}

		const { Items } = selectedSection;

		if (!Items || Items.length === 0) {
			return this.renderRankTrigger(true);
		}

		let availableRanks = Items.map((val, i) => i);

		if (!this.props.item) {
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

	render() {
		return (
			<div className="overview-position-select">
				{this.renderSectionSelect()}
				{this.renderRankSelect()}
			</div>
		);
	}
}

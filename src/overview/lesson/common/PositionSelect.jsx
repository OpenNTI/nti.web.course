import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Input, DialogButtons} from '@nti/web-commons';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.overview.lesson.common.PositionSelect', {
	save: 'Save',
	cancel: 'Cancel'
});

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
	attachFlyoutRef = x => this.flyout = x

	static propTypes = {
		lessonOverview: PropTypes.object.isRequired
	}

	state = {}

	componentDidMount () {
		this.setState({selectedSection: this.props.lessonOverview.Items[0]});
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
		return <div className="section-select">{this.renderSectionInfo(this.state.selectedSection || {})}</div>;
	}

	renderSectionOption = (section) => {
		const className = cx('section-option', {selected: section === this.state.selectedSection});

		return (
			<div
				className={className}
				key={section.title}
				onClick={() => {
					this.setState({selectedSection: section});

					if(this.flyout) {
						this.flyout.dismiss();
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

	onSave = () => {
		this.setState({inCreationMode: false});
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
		return (
			<div className="create-section-form">
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
				className="sync-options"
				trigger={this.renderSectionTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachFlyoutRef}
			>
				<div className="section-select-flyout">
					{!this.state.inCreationMode && this.props.lessonOverview.Items.map(this.renderSectionOption)}
					{!this.state.inCreationMode && <div className="add-new" onClick={this.enterCreateMode}>+ Add New</div>}
					{this.state.inCreationMode && this.renderCreateNewSection()}
				</div>
			</Flyout.Triggered>
		);
	}

	render () {
		return <div className="overview-position-select">{this.renderSectionSelect()}</div>;
	}
}

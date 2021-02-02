import './Section.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt} from '@nti/web-commons';
import cx from 'classnames';


const t = scoped('course.info.inline.components.Section', {
	edit: 'Edit',
	cancel: 'Cancel',
	save: 'Save',
	done: 'Done',
	deleteBlock: 'Delete Block'
});

function isEmpty (value) {
	if (value instanceof Date) { return false; }

	return !value || (Array.isArray(value) && value.length === 0) || (Object.keys(value).length === 0);
}

/**
 * Wrapper for an editable section of a course.  The components provided via props
 * will be rendered in either View mode or Edit mode, depending on the isEditing prop.
 *
 * This component handles the cancel/save/delete controls.
 *
 * Components provided to this should define an onValueChange prop and invoke that callback in order
 * to provide values to this component that are to be saved to the catalogEntry.  In order for "Delete Block"
 * to work on a section, the underlying components should have a static FIELD_NAME defined on the
 * Edit version of the component.
 * @extends React.Component
 */

export default class Section extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object,
		courseInstance: PropTypes.object,
		facilitators: PropTypes.arrayOf(PropTypes.object),
		enrollmentAccess: PropTypes.object,
		components: PropTypes.arrayOf(PropTypes.object),
		onBeginEditing: PropTypes.func,
		onEndEditing: PropTypes.func,
		doSave: PropTypes.func,
		isEditing: PropTypes.bool,
		editable: PropTypes.bool,
		inlinePlacement: PropTypes.bool,
		hideDeleteBlock: PropTypes.bool,
		className: PropTypes.string,
		redemptionCodes: PropTypes.arrayOf(PropTypes.object),
		title: PropTypes.string,
		done: PropTypes.bool,
		hideCancel: PropTypes.bool
	}

	constructor (props) {
		super(props);

		const { components, catalogEntry, editable } = props;

		let hasData = editable;

		(components || []).forEach((cmp) => {
			const {getter} = cmp;
			const value = catalogEntry && (typeof getter === 'function' ? getter(catalogEntry) : catalogEntry[cmp.View.FIELD_NAME]);

			if(cmp.View.hasData) {
				// for special fields (like meeting times), it's not sufficient to just check
				// a single field value, so allow them to define a hasData to determine that
				hasData = hasData || cmp.View.hasData(catalogEntry, props);
			}
			else if((!getter && !cmp.View.FIELD_NAME) || !isEmpty(value)) {
				// if no FIELD_NAME is defined, don't assume it's no data, it may be pulled
				// from an API call rather than an object property
				hasData = true;
			}
		});

		this.state = {
			hasData,
			saveable: true
		};
	}

	beginEditing = () => {
		const { onBeginEditing } = this.props;

		onBeginEditing && onBeginEditing();
	}

	endEditing = () => {
		const { onEndEditing } = this.props;

		this.setState({ pendingChanges: {}, error: null, saveable: true });

		onEndEditing && onEndEditing();
	}

	componentDidUpdate (prevProps) {
		if (!this.props.isEditing && prevProps.isEditing) {
			// reset saveable state if we're leaving editing mode
			this.setState({ saveable: true });
		}
	}

	/**
	 * Provided to all underlying components as onValueChange.  When an underlying
	 * component invokes this method, we update the changes that need to be saved.  When
	 * the user clicks Save, these pending changes (if any) will be saved to the catalogEntry
	 *
	 * @param  {string} key     catalogEntry field name
	 * @param  {Object} value   catalogEntry field value
	 * @param  {string} error   store any errorsfound when updating values
	 * @returns {void}
	 */
	aggregateChanges = (key, value, error) => {
		const { pendingChanges } = this.state;

		const updated = { ...(pendingChanges || {}) };

		updated[key] = value;

		this.setState({ pendingChanges: updated, error });
	}

	savePendingChanges = () => {
		const { catalogEntry, onEndEditing, doSave } = this.props;
		const { pendingChanges, saveable, error } = this.state;

		if(!saveable || error) {
			return;
		}

		if(doSave) {
			// instead of doing the default key-value save, do custom logic if specified
			doSave(pendingChanges).then((value) => {
				onEndEditing && onEndEditing(value);
			}).catch(e => this.setState({error: e}));
		}
		else if(pendingChanges && Object.keys(pendingChanges).length > 0) {
			// do a standard key-value PUT on the catalogEntry.  this covers 90%
			// of save scenarios (title, description, StartDate/EndDate, etc)
			catalogEntry.save(pendingChanges).then(() => {
				this.setState({ pendingChanges: {} });

				onEndEditing && onEndEditing(catalogEntry);
			}).catch(e => {
				this.setState({
					error: e
				});
			});
		}
		else {
			// nothing to save, end editing
			onEndEditing && onEndEditing();
		}
	}

	deleteBlock = () => {
		Prompt.areYouSure('This will remove selected field values').then(() => {
			const { components } = this.props;
			const valueToSave = {};

			(components || []).forEach((cmp) => {
				if(cmp.Edit.FIELD_NAME) {
					valueToSave[cmp.Edit.FIELD_NAME] = null;
				}
			});

			if(Object.keys(valueToSave).length > 0) {
				this.setState({ pendingChanges: valueToSave }, () => {
					this.savePendingChanges();
				});
			}
		});
	}

	renderCmp = (cmp) => {
		const { error } = this.state;
		const { isEditing, onEndEditing, catalogEntry, courseInstance, redemptionCodes, facilitators, enrollmentAccess, editable, ...otherProps } = this.props;

		const Cmp = isEditing ? cmp.Edit : cmp.View;

		return (
			<Cmp
				{...otherProps}
				key={cmp.ID}
				catalogEntry={catalogEntry}
				courseInstance={courseInstance}
				redemptionCodes={redemptionCodes}
				enrollmentAccess={enrollmentAccess}
				facilitators={facilitators}
				editable={editable}
				error={error && error.field === cmp.View.FIELD_NAME && error}
				onValueChange={this.aggregateChanges}
				onEndEditing={onEndEditing}
				toggleSaveable={this.toggleSaveable}
			/>
		);
	}

	toggleSaveable = (enabled) => {
		this.setState({saveable : enabled});
	}


	isEditable () {
		const {editable, components, catalogEntry, courseInstance} = this.props;

		return editable && components.some(c => !c.isEditable || c.isEditable(catalogEntry, courseInstance));
	}

	renderEditButton () {
		if(this.props.isEditing) {
			return null;
		}

		if(this.isEditable()) {
			const className = cx('edit-course-info', { 'indented' : !this.props.inlinePlacement && !this.props.title });

			return <div className={className} onClick={this.beginEditing}>{t('edit')}</div>;
		}

		return null;
	}

	renderTitleWithEditButton () {
		const { title } = this.props;

		return (
			<div className="title-with-edit">
				<div className="field-label">{title}</div>
				{this.renderEditButton()}
			</div>
		);
	}

	renderDelete () {
		const { hideDeleteBlock } = this.props;

		if(!hideDeleteBlock) {
			return (<div className="delete-block" onClick={this.deleteBlock}><i className="icon-trash"/>{t('deleteBlock')}</div>);
		}

		return null;
	}

	renderSave () {
		const {saveable} = this.state;
		const {done} = this.props;

		const className = cx('save', { disabled: !saveable });

		return <div className={className} onClick={this.savePendingChanges}>{done ? t('done') : t('save')}</div>;
	}

	renderControls () {
		const { isEditing, hideCancel } = this.props;

		if (isEditing) {
			return (
				<div className="section-controls">
					{this.renderDelete()}
					<div className="buttons">
						{!hideCancel && <div className="cancel" onClick={this.endEditing}>{t('cancel')}</div>}
						{this.renderSave()}
					</div>
				</div>
			);
		}

		return null;
	}

	render () {
		const { hasData } = this.state;
		const { components, className, title, isEditing } = this.props;

		const containerCls = cx('course-info-editor-section', { 'edit' : isEditing });

		if(!hasData) {
			return null;
		}

		return (
			<div className={className}>
				<div className={containerCls}>
					<div className="contents">
						{title ? this.renderTitleWithEditButton() : null}
						{components.map(this.renderCmp)}
						{!title ? this.renderEditButton() : null}
					</div>
					{this.renderControls()}
				</div>
			</div>
		);
	}
}

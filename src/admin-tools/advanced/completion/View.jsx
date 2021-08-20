import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { Input, Loading, Text, Icons } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Store from './Store';
// import Credit from './Credit';
import Badges from './Badges';
import { CompletionCertificates } from './Certificates';

const t = scoped('course.admin-tools.advanced.completion.View', {
	title: 'Completion Requirements',
	description:
		'Configure the completion criteria your learners need to meet to earn Credit, Certificates, and Badges.',
	disclaimer:
		'Be sure to confirm all course content is final before allowing completion tracking, as further edits will impact learner reports.',
	awardTitle: 'Awards Upon Completion',
	cancel: 'Cancel',
	save: 'Save',
	completable: 'Completable',
	certificates: 'Award Certificate on Completion',
	percentage: 'Percentage (1 to 100)',
	defaultRequired: 'Required by Default',
	assignments: 'Assignments',
	types: {
		Assignments: 'Assignments',
	},
	typeDescriptions: {
		Videos: 'Learners must view 95%% of the total runtime to complete a required video. A watch history timeline becomes available to learners once they have started a video.',
	},
});

const Paragraph = styled(Text.Base)`
	font-size: 0.875rem;
	line-height: 1.3;
	color: var(--primary-grey);
`;

const Disclaimer = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 1.125rem;
	padding: 0.75rem 1rem;
	align-items: flex-start;
	background: var(--panel-background-alt);

	& > *:first-child {
		flex: 0 0 auto;
		font-size: 1.125rem;
		margin-right: 0.5rem;
	}

	& ${Paragraph} {
		flex: 1 1 auto;
	}
`;

class CourseAdminCompletion extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		page: PropTypes.bool,
		store: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		completable: PropTypes.bool,
		certificationPolicy: PropTypes.shape({
			offersCompletionCertificate: PropTypes.bool,
			certificateRendererName: PropTypes.string,
		}),
		percentage: PropTypes.number,
		disabled: PropTypes.bool,
		defaultRequiredDisabled: PropTypes.bool,
		defaultRequirables: PropTypes.array,
		completableToggleDisabled: PropTypes.bool,
		updateDisabled: PropTypes.bool,
		error: PropTypes.string,
		onChange: PropTypes.func,
	};

	state = {};

	componentDidMount() {
		const { course, store } = this.props;

		store.load(course);
	}

	componentDidUpdate(prevProps) {
		if (this.props.course.getID() !== prevProps.course.getID()) {
			this.props.store.load(this.props.course);
		} else if (prevProps.percentage !== this.props.percentage) {
			this.setState({
				percentage: this.props.percentage,
			});
		}
	}

	onCompletionPolicyChange = () => {
		const isCompletable = !this.props.completable; // toggle the old value

		this.onSave(
			isCompletable,
			isCompletable ? 100 : this.props.percentage ?? 100,
			this.props.certificationPolicy
		);
	};

	renderCompletableToggle() {
		const {
			completable,
			disabled: nonEditor,
			completableToggleDisabled,
		} = this.props;
		const disabled = nonEditor || completableToggleDisabled;
		const className = cx('completion-control', 'no-border', { disabled });

		return (
			<>
				<div className={className}>
					<div className="label">
						<Text.Base className="title" as="h1">
							{t('title')}
						</Text.Base>
					</div>
					<div className="control">
						<Input.Toggle
							disabled={disabled}
							value={completable}
							onChange={this.onCompletionPolicyChange}
						/>
					</div>
				</div>
				<div className="completion-control no-border">
					<div className="label">
						<Paragraph>{t('description')}</Paragraph>
						<Disclaimer>
							<Icons.Alert.Round />
							<Paragraph>{t('disclaimer')}</Paragraph>
						</Disclaimer>
					</div>
					<div className="control" />
				</div>
			</>
		);
	}

	onCertificationChange = newValues => {
		this.onSave(this.props.completable, this.props.percentage, {
			...newValues,
		});
	};

	onPercentageChange = percentage => {
		if (this.percentageTimeout) {
			clearTimeout(this.percentageTimeout);
			delete this.percentageTimeout;
		}

		this.setState({ percentage }, () => {
			this.percentageTimeout = setTimeout(() => {
				this.onSave(
					this.props.completable,
					percentage,
					this.props.certificationPolicy
				);
			}, 500);
		});
	};

	async saveDefaultPolicy(label, value) {
		const { store, onChange } = this.props;

		const savedCourse = await store.saveDefaultPolicy(label, value);

		if (onChange) {
			onChange(savedCourse);
		}
	}

	renderDefaultRequiredToggle = (defaultRequirable, disabled) => {
		const { label, isDefault } = defaultRequirable;
		const text = t.isMissing(`types.${label}`)
			? label
			: t(`types.${label}`);

		const description = t.isMissing(`typeDescriptions.${label}`)
			? null
			: t(`typeDescriptions.${label}`);

		const className = cx('completion-control', {
			disabled,
			'has-description': description,
		});

		return (
			<React.Fragment key={label}>
				<div className={className}>
					<div className="label">{text}</div>
					<div className="control">
						<Input.Toggle
							disabled={disabled}
							value={isDefault}
							onChange={() => {
								this.saveDefaultPolicy(label, !isDefault);
							}}
						/>
					</div>
				</div>
				{description && (
					<Paragraph className="description">{description}</Paragraph>
				)}
			</React.Fragment>
		);
	};

	renderDefaultRequiredSection() {
		const {
			completable,
			defaultRequirables,
			disabled: nonEditor,
			defaultRequiredDisabled,
		} = this.props;
		const disabled = !completable || nonEditor || defaultRequiredDisabled;
		const className = cx('default-required-container', { disabled });

		return (
			<div className={className}>
				<div className="header">{t('defaultRequired')}</div>
				<div className="items">
					{defaultRequirables.map(defaultRequirable =>
						this.renderDefaultRequiredToggle(
							defaultRequirable,
							disabled
						)
					)}
				</div>
			</div>
		);
	}

	renderPercentage() {
		const { completable, disabled: nonEditor, updateDisabled } = this.props;
		const disabled = !completable || nonEditor || updateDisabled;
		const className = cx('completion-control', { disabled });

		return (
			<div className={className}>
				<div className="label">{t('percentage')}</div>
				<div className="control">
					<Input.Number
						min={1}
						max={100}
						className="nti-text-input"
						constrain
						disabled={disabled}
						value={this.state.percentage}
						onChange={this.onPercentageChange}
					/>
				</div>
			</div>
		);
	}

	async onSave(completable, percentage, certificationPolicy) {
		const { store, onChange } = this.props;

		const savedCourse = await store.save(
			completable,
			percentage,
			certificationPolicy
		);

		if (onChange) {
			onChange(savedCourse);
		}
	}

	render() {
		const {
			loading,
			error,
			page,
			course,
			completable,
			disabled: nonEditor,
			certificationPolicy: {
				offersCompletionCertificate,
				certificateRendererName,
			} = {},
			updateDisabled,
		} = this.props;
		const disabled = !completable || nonEditor || updateDisabled;

		return (
			<div
				className={cx('course-admin-completion', {
					'completion-page': page,
				})}
			>
				{loading && <Loading.Ellipsis />}
				{!loading && (
					<div className="content">
						<div className="error">{error || ''}</div>
						<div className="group">
							{this.renderCompletableToggle()}
							{this.renderPercentage()}
							{this.renderDefaultRequiredSection()}
						</div>
						<div className="group">
							<Text.Base className="title">
								{t('awardTitle')}
							</Text.Base>
							{/* <Credit course={course} disabled={disabled} /> */}
							<CompletionCertificates
								label={t('certificates')}
								onChange={
									disabled
										? undefined
										: this.onCertificationChange
								}
								offersCompletionCertificate={
									offersCompletionCertificate
								}
								certificateRendererName={
									certificateRendererName
								}
							/>
							<Badges course={course} disabled={disabled} />
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default decorate(CourseAdminCompletion, [
	Store.connect([
		'loading',
		'completable',
		'certificationPolicy',
		'certificateTemplates',
		'percentage',
		'disabled',
		'defaultRequiredDisabled',
		'defaultRequirables',
		'completableToggleDisabled',
		'updateDisabled',
		'error',
	]),
]);

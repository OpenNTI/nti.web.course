import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';

import WizardPanel from '../WizardPanel';

const mockService = () => ({
	getObject: function (ntiid) {
		if (ntiid === 'someNTIID') {
			// the actual catalogEntry
			return Promise.resolve({
				CatalogEntry: {
					save: function () {},
					getLink: function () {
						return 'importLink';
					},
				},
			});
		}
	},
	put: url => {
		if (url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	},
	post: function (url) {
		if (url === 'defaultURL') {
			return Promise.resolve({
				NTIID: 'someNTIID',
			});
		}
	},
	get: function (url) {
		if (url === 'adminURL') {
			return Promise.resolve({
				Items: {
					DefaultAPIImported: {
						href: 'defaultURL',
					},
				},
			});
		}

		return Promise.reject('Invalid url');
	},
	getWorkspace: function (name) {
		if (name === 'Courses') {
			return {
				getLink: function (rel) {
					if (rel === 'AdminLevels') {
						return 'adminURL';
					}
				},
			};
		}
	},
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		username: 'TestUser',
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () =>
				Promise.resolve(global.$AppConfig.nodeService),
		},
	};
};

const onAfter = () => {
	//un-mock getService()
	const { $AppConfig } = global;
	delete $AppConfig.nodeInterface;
	delete $AppConfig.nodeService;
};

/* eslint-env jest */
describe('Import panel test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	const mockSave = jest.fn();
	const catalogEntry = {
		save: () => {
			mockSave();
			return Promise.resolve();
		},
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	SaveButton.propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string,
	};

	function SaveButton({ onSave, label }) {
		function save() {
			onSave();
		}

		return (
			<div onClick={save}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	test('Test initial appearance is correct', () => {
		const { container } = render(
			<WizardPanel
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		);

		const input = container.querySelector('input');

		expect(input.getAttribute('type')).toEqual('file');
		expect(input.getAttribute('accept')).toEqual('.zip');
	});
});

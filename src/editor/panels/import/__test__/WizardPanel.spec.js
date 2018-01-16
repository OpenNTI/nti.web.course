import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import WizardPanel from '../WizardPanel';

let didImportData = false;

const mockService = () => ({
	getObject: function (ntiid) {
		if(ntiid === 'someNTIID') {
			// the actual catalogEntry
			return Promise.resolve({
				CatalogEntry: {
					save: function () {
					},
					getLink: function () {
						return 'importLink';
					}
				}
			});
		}
	},
	put: (url) => {
		if(url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	},
	post: function (url) {
		if(url === 'defaultURL') {
			return Promise.resolve({
				NTIID: 'someNTIID'
			});
		}
		else if(url === 'importLink') {
			didImportData = true;
		}
	},
	get: function (url) {
		if(url === 'adminURL') {
			return Promise.resolve({
				Items: {
					DefaultAPIImported: {
						href: 'defaultURL'
					}
				}
			});
		}

		return Promise.reject('Invalid url');
	},
	getWorkspace: function (name) {
		if(name === 'Courses') {
			return {
				getLink: function (rel) {
					if(rel === 'AdminLevels') {
						return 'adminURL';
					}
				}
			};
		}
	}
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		username: 'TestUser',
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () => Promise.resolve(global.$AppConfig.nodeService)
		}
	};
};

const onAfter = () => {
	//unmock getService()
	const {$AppConfig} = global;
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
		}
	};
	const onCancel = jest.fn();
	const afterSave = jest.fn();
	const buttonLabel = 'Test Label';

	SaveButton.propTypes = {
		onSave: PropTypes.func,
		label: PropTypes.string
	};

	function SaveButton ({onSave, label}) {
		return (
			<div onClick={onSave}>
				<div className="course-panel-continue">{label}</div>
			</div>
		);
	}

	test('Test initial appearance is correct', () => {
		const cmp = mount(
			<WizardPanel
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		);

		const input = cmp.find('input').first();

		expect(input.prop('type')).toEqual('file');
		expect(input.prop('accept')).toEqual('.zip');
	});

	test('Test successful file upload', (done) => {
		didImportData = false;

		const cmp = mount(
			<WizardPanel
				catalogEntry={catalogEntry}
				saveCmp={SaveButton}
				onCancel={onCancel}
				afterSave={afterSave}
				buttonLabel={buttonLabel}
			/>
		);

		const input = cmp.find('input').first();
		const saveBtn = cmp.find('.course-panel-continue').first();

		saveBtn.simulate('click');

		// first verify that clicking the save button with no file properly raises an error
		expect(cmp.state().error).toEqual('Must provide an import file');
		expect(cmp.find('.course-import-error').first().text()).toEqual('Must provide an import file');

		// verify that the remove current file button does not exist
		expect(cmp.find('.file-select-reset').first().exists()).toBe(false);

		// simulate file selection
		input.simulate('change', {
			target: {
				files: [
					{
						name: 'someFile'
					}
				]
			}
		});

		// now remove file button should appear and the file name should be visible
		expect(cmp.find('.file-select-reset').first().text()).toEqual('x');
		expect(cmp.find('.file-select-filename').first().text()).toEqual('someFile');


		// simulate a save
		saveBtn.simulate('click');

		setTimeout(function () {
			expect(cmp.state().error).toBe(null); // error cleared on successful import
			expect(didImportData).toBe(true);
			expect(afterSave).toHaveBeenCalled();

			done();
		}, 200);
	});
});

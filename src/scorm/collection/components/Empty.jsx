import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Input} from '@nti/web-commons';

import Store from '../Store';
import {ACCEPTS_FILES} from '../Constants';

import Container from './PaddedContainer';

const allowedTypes = ACCEPTS_FILES.reduce((acc, file) => ({...acc, [file]: true}), {});

const t = scoped('course.scorm.collection.components.Empty', {
	title: 'Drag a SCORM Package to Upload, or',
	requirements: 'Must be a .zip file.',
	uploading: {
		header: 'Uploading your file.',
		subHeader: 'This may take a moment.'
	}
});


export default
@Store.monitor(['uploadPackage'])
class EmptyScormCollection extends React.Component {
	static propTypes = {
		uploadPackage: PropTypes.func
	}


	onFileChange = (file) => {
		const {uploadPackage} = this.props;

		if (uploadPackage) {
			uploadPackage(file);
		}
	}


	render () {
		return (
			<>
				<Container>
					<Input.FileDrop
						getString={t}
						onChange={this.onFileChange}
						sizeLimit={Infinity}
						allowedTypes={allowedTypes}
					/>
				</Container>
			</>
		);
	}
}
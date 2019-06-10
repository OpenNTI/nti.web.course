import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Input, Errors} from '@nti/web-commons';

import Store from '../Store';
import {ACCEPTS_FILES} from '../Constants';

import Container from './PaddedContainer';

const allowedTypes = ACCEPTS_FILES.reduce((acc, file) => ({...acc, [file]: true}), {});

const t = scoped('course.scorm.collection.components.Empty', {
	title: 'Drag a SCORM Package to Upload, or',
	requirements: 'Must be a .zip file.',
});

export default
@Store.monitor(['uploadPackage', 'uploadError'])
class EmptyScormCollection extends React.Component {
	static propTypes = {
		uploadPackage: PropTypes.func,
		uploadError: PropTypes.object
	}


	onFileChange = (file) => {
		const {uploadPackage} = this.props;

		if (uploadPackage) {
			uploadPackage(file);
		}
	}


	render () {
		const {uploadError} = this.props;

		return (
			<>
				{uploadError && (<Errors.Bar error={uploadError} />)}
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
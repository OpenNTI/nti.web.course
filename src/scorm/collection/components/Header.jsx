import React, { useCallback } from 'react';

import { scoped } from '@nti/lib-locale';
import { Input, Search } from '@nti/web-commons';
import { Button } from '@nti/web-core';

import Store from '../Store';

const t = scoped('course.scorm.collection.components.Header', {
	upload: 'Upload a SCORM Package',
});

//#region 🎨

const HeaderContainer = styled('div').attrs({
	className: 'scorm-collection-header',
})`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const FileInputWrapper = styled(Input.FileInputWrapper)`
	flex: 0 0 auto;
	cursor: pointer;
`;

const UploadIcon = styled('i').attrs({ className: 'icon-upload' })`
	margin-right: 0.3rem;
`;

const UploadButton = styled(Button).attrs({
	className: 'scorm-upload-button',
	rounded: true,
})`
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
`;

const SearchField = styled(Search)`
	flex: 0 0 auto;
	box-shadow: none;
	background: white;
	border-bottom: 1px solid var(--border-grey-light);
	border-radius: 0;
	width: 350px;
`;

//#endregion

export default function ScormCollectionHeader() {
	const { uploadPackage, filter, setFilter } = Store.useValue();

	const onFileChanged = useCallback(
		files => {
			uploadPackage?.(files?.[0]);
		},
		[uploadPackage]
	);

	return (
		<HeaderContainer>
			<FileInputWrapper className="upload" onChange={onFileChanged}>
				<UploadButton>
					<UploadIcon />
					<span>{t('upload')}</span>
				</UploadButton>
			</FileInputWrapper>
			<SearchField
				className="search"
				value={filter}
				onChange={setFilter}
			/>
		</HeaderContainer>
	);
}

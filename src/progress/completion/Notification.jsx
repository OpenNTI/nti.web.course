import React from 'react';
// import cx from 'classnames';
import {Prompt} from '@nti/web-commons';

import {
	Frame,
	CertificateIcon,
	Heading,
	Description,
	ViewCertificate,
} from './notification-parts';


const Receiver = ({children: renderer, ...props}) => renderer(props);


export default function Notification (props) {
	return (
		<Prompt.Dialog>
			<Receiver>
				{({onDismiss}) => (
					<Frame onDismiss={onDismiss}>

						<CertificateIcon/>
						<ViewCertificate />

						<Heading />
						<Description/>

					</Frame>
				)}
			</Receiver>
		</Prompt.Dialog>
	);
}

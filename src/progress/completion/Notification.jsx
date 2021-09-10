import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// import cx from 'classnames';
import { Prompt } from '@nti/web-commons';
import { useChanges } from '@nti/web-core';

import {
	Frame,
	CertificateIcon,
	Heading,
	Description,
	ViewCertificate,
} from './notification-parts/index.js';

const Receiver = ({ children: renderer, ...props }) => renderer(props);

Notification.propTypes = {
	course: PropTypes.shape({
		PreferredAccess: PropTypes.shape({
			acknowledgeCourseCompletion: PropTypes.func,
			hasCompletionAcknowledgmentRequest: PropTypes.bool,
		}),
	}),
	viewCertificateAction: PropTypes.shape({
		href: PropTypes.string,
		onClick: PropTypes.func,
	}),
};

export default function Notification({
	course,
	viewCertificateAction: viewCertificate,
}) {
	const { PreferredAccess: enrollment } = course || {};
	useChanges(enrollment);

	const [show, setShow] = useState(false);

	const acknowledge = useCallback(() => {
		enrollment.acknowledgeCourseCompletion();
		setShow(false);
	}, [enrollment]);

	const isComplete = enrollment?.hasCompletionAcknowledgmentRequest;

	useEffect(() => {
		// Set show only after a delay to let routes settle
		const timeout = isComplete && setTimeout(() => setShow(true), 500);
		return () => {
			clearTimeout(timeout);
		};
	}, [isComplete, acknowledge, enrollment]);

	return !show ? null : (
		<Prompt.Dialog onBeforeDismiss={acknowledge} closeOnMaskClick={false}>
			<Receiver>
				{({ onDismiss }) => (
					<Frame onDismiss={onDismiss}>
						<CertificateIcon />

						{viewCertificate && (
							<ViewCertificate {...viewCertificate} />
						)}

						<Heading />
						<Description />
					</Frame>
				)}
			</Receiver>
		</Prompt.Dialog>
	);
}

import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'nti-web-commons';
import {LinkTo} from 'nti-web-routing';

import PaddedContainer from '../../common/PaddedContainer';

/*
Internal Links:
	NTIID:			"tag:nextthought.com,2011-10:OU-RelatedWorkRef...:digestion_and_metabolism_textbook1"
	creator:		"Openstax, Heather Ketchum, and Eric Bright"
	desc:			"Read this material about Digestion and Metabolism."
	icon:			"resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
	label:			"Digestion and Metabolism Textbook Reading 1"
	href:			"tag:nextthought.com,2011-10:OU-HTML-...:digestion_and_metabolism_textbook1"
	target-NTIID:	"tag:nextthought.com,2011-10:OU-HTML-...:digestion_and_metabolism_textbook1"
	targetMimeType:	"application/vnd.nextthought.content"
		visibility:	"everyone"

External Links:
	NTIID:			"tag:nextthought.com,2011-10:OU-RelatedWorkRef-...:library_guide_ou.2"
	creator:		"University of Oklahoma Libraries"
	desc:			"This guide is designed to provide additional resources to help you study."
	icon:			"resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
	label:			"Library Guide for Human Physiology"
	href:			"http://guides.ou.edu/biol2124_humanphysiology"
	target-NTIID:	"tag:nextthought.com,2011-10:NTI-UUID-dbbb93c8d79d8de6e1edcbe8685c07c9"
	targetMimeType:	"application/vnd.nextthought.externallink"
	visibility:		"everyone"
*/


LessonOverviewRelatedWorkGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object,
	commentLabel: PropTypes.node,
	requiredLabel: PropTypes.node
};
export default function LessonOverviewRelatedWorkGridItem ({item, course, commentLabel, requiredLabel}) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<Card
					data-ntiid={item.NTIID}
					item={item}
					contentPackage={course}
					labels={[commentLabel, requiredLabel]}
				/>
			</LinkTo.Object>
		</PaddedContainer>
	);
}

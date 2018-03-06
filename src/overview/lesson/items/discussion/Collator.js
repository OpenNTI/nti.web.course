export const COLLATED_MIME_TYPE = 'application/vnd.nextthought.collated-discussions';
export const MIME_TYPE = 'application/vnd.nextthought.discussion';
export const isDiscussion = x => (x && x.MimeType || '').startsWith(MIME_TYPE);

export class DiscussionGroup {
	MimeType = COLLATED_MIME_TYPE
	Items = []
}

const peek = x => x[x.length - 1];

export function collateDiscussions (items) {
	const output = [];

	for (let item of items) {
		if (!isDiscussion(item)) {
			output.push(item);
			continue;
		}

		let last = peek(output);
		if (!last || !(last instanceof DiscussionGroup)) {
			last = new DiscussionGroup;
			output.push(last);
		}

		last.Items.push(item);
	}

	return output;
}

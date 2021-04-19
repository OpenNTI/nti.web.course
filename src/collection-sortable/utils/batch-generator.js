import { getService } from '@nti/web-client';

import combineGroups from './combine-groups';

const BatchSize = 20;

export default async function* batchGenerator(collection, params, grouper) {
	const service = await getService();
	const rel = params.rel ?? 'self';

	let offset = 0;
	let done = false;

	while (!done) {
		const batch = await service.getBatch(collection.getLink(rel), {
			batchSize: BatchSize,
			batchStart: offset,
			...params,
		});

		if (batch.Items.length < BatchSize) {
			done = true;
		}

		const groups = grouper
			? combineGroups(
					batch.Items.map(i => ({
						name: grouper(i),
						parent: params.rel,
						Items: [i],
					}))
			  )
			: [{ name: rel, Items: batch.Items }];

		yield groups;
	}
}
import getPurchasable from './get-purchasable'; 

export default async function savePrice (entry, instance, pending) {
	const purchasable = getPurchasable(entry);

	if (pending?.price == null) {
		if (purchasable) {
			await purchasable.delete();
		}

		return;
	}


	const resp = purchasable ?
		await purchasable.save(pending.price) :
		await entry.postToLink('CreateCoursePurchasable', pending.price);

	if (!purchasable) {
		await entry.refresh();
		entry.onChange();
	}

	return resp;
}
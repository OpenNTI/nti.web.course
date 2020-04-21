import getPurchasable from './get-purchasable';

async function makeFree (entry) {
	const purchasable = getPurchasable(entry);

	if (!purchasable) { return; }

	return await purchasable.save({Public: false});
}

async function setPrice (entry, instance, {amount, currency}) {
	if (!amount) { throw new Error('Must have a price'); }

	const purchasable = getPurchasable(entry);
	const dollars = amount / 100;

	const resp = purchasable ?
		await purchasable.save({Amount: dollars, Currency: currency, Public: true}) :
		await entry.postToLink('CreateCoursePurchasable', {Amount: dollars, Currency: currency});

	//If we didn't have a purchasable, we need to refresh the
	//catalog entry to get the StoreEnrollment option
	if (!purchasable) {
		await entry.refresh();
		entry.onChange();
	}

	return resp;
}

export default async function savePrice (entry, instance, pending) {
	return pending?.price ? setPrice(entry, instance, pending?.price) : makeFree(entry, instance, pending?.price);
}
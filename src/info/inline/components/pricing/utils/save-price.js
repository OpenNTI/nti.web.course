import getPurchasable from './get-purchasable';

async function setOpenEnrollment (entry, allow) {
	const vendorInfo = await entry.fetchLink('VendorInfo');

	const deny = !allow;
	const payload = {...vendorInfo};

	if (vendorInfo?.NTI?.DenyOpenEnrollment === deny) { return; }

	if (!payload.NTI) {
		payload.NTI = {DenyOpenEnrollment: deny};
	} else {
		payload.NTI.DenyOpenEnrollment = deny;
	}

	await entry.putToLink('VendorInfo', payload);
}

async function makeFree (entry) {
	const purchasable = getPurchasable(entry);

	await setOpenEnrollment(entry, true);

	if (purchasable) {
		await purchasable.save({Public: false});
	}

	await entry.refresh();
	entry.onChange();

	return entry;
}

async function setPrice (entry, instance, {amount, currency}) {
	if (!amount) { throw new Error('Must have a price'); }

	const purchasable = getPurchasable(entry);
	const dollars = amount / 100;

	await setOpenEnrollment(entry, false);

	const saving = purchasable ?
		purchasable.save({Amount: dollars, Currency: currency, Public: true}) :
		entry.postToLink('CreateCoursePurchasable', {Amount: dollars, Currency: currency});

	await saving;
	await entry.refresh();
	entry.onChange();

	return entry;
}

export default async function savePrice (entry, instance, pending) {
	return pending?.price ? setPrice(entry, instance, pending?.price) : makeFree(entry, instance, pending?.price);
}
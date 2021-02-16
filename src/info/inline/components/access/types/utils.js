export const getPurchaseOption = course =>
	course?.getEnrollmentOptions()?.getEnrollmentOptionForPurchase();
export const getOpenOption = course =>
	course?.getEnrollmentOptions()?.getEnrollmentOptionForOpen();

export const getPurchasable = course =>
	getPurchaseOption(course)?.getPurchasable();
export const getPriceFromPurchasable = purchasable => ({
	amount: (purchasable?.amount ?? 0) * 100,
	currency: purchasable.currency,
});
export const getPrice = course => {
	const option = getPurchaseOption(course);
	const purchasable = getPurchasable(course);

	return purchasable && option?.enabled
		? getPriceFromPurchasable(purchasable)
		: null;
};

export const setOpenEnrollment = async (course, allow) => {
	const vendorInfo = await course.fetchLink('VendorInfo');

	const deny = !allow;

	if (vendorInfo?.NTI?.DenyOpenEnrollment === deny) {
		return;
	}

	await course.putToLink('VendorInfo', {
		vendorInfo,
		NTI: {
			...(vendorInfo.NTI || {}),
			DenyOpenEnrollment: deny,
		},
	});
};

export const setPrice = async (course, price) => {
	const purchasable = getPurchasable(course);

	if (!price) {
		await purchasable?.save({ Public: false });
		return;
	}

	const { amount, currency } = price;
	const dollars = amount / 100;

	const saving = purchasable
		? purchasable.save({
				Amount: dollars,
				Currency: currency,
				Public: true,
		  })
		: course.postToLink('CreateCoursePurchasable', {
				Amount: dollars,
				Currency: currency,
		  });

	await saving;
};

export const update = async course => {
	await course.refresh();
	course.onChange();
	return course;
};

export default function sortOptions (options) {
	return options && options
		.filter(option => option.isAvailable())
		.sort((a, b) => {
			const aPrice = a.getPrice();
			const bPrice = b.getPrice();

			if (aPrice && bPrice) {
				return aPrice - bPrice;
			} else if (aPrice && !bPrice) {
				return -1;
			} else if (!aPrice && bPrice) {
				return 1;
			} else {
				return a.ORDER - b.ORDER;
			}
		});
}

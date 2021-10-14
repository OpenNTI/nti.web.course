export default class Store {
	constructor(dataSource) {
		this.dataSource = dataSource;

		this.cache = {};
		this.queue = [];
	}

	async getTotalCount() {
		const page = await this.dataSource.loadPage(1, { sort: 'by-lesson' });

		return page.pageCount;
	}

	async loadPage(page) {
		if (this.cache[page]) {
			return this.cache[page];
		}

		return this.queueCall(page, async () => {
			const batch = await this.dataSource.loadPage(page, {
				sort: 'by-lesson',
			});

			this.cache[page] = batch;

			return batch;
		});
	}

	async queueCall(page, fn) {
		const popQueue = async () => {
			this.running = true;
			const next = this.queue[0];

			this.queue = this.queue.slice(1);

			if (next) {
				try {
					await next.fn();
				} finally {
					popQueue();
				}
			} else {
				this.running = false;
			}
		};

		return new Promise(fulfill => {
			this.queue.push({
				page,
				fn: () => {
					const resp = fn();
					fulfill(resp);

					return resp;
				},
			});

			if (!this.running) {
				popQueue();
			}
		});
	}

	cancelLoadPage(page) {
		this.queue = this.queue.filter(item => item.page !== page);
	}
}

export default class Store {
	constructor (dataSource) {
		this.dataSource = dataSource;

		this.cache = {};
	}


	async getTotalCount () {
		const page = await this.dataSource.loadPage(2, {sort: 'by-lesson'});

		return page.TotalPageCount;
	}


	async loadPage (page) {
		if (this.cache[page]) {
			return this.cache[page];
		}

		const batch = await this.dataSource.loadPage(page, {sort: 'by-lesson'});

		this.cache[page] = batch;

		return batch;
	}


	cancelLoadPage () {}
}

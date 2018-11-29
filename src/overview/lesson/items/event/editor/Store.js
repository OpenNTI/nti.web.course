import {getService} from '@nti/web-client';
import {Stores} from '@nti/lib-store';
import {Models} from '@nti/lib-interfaces';

function safeContains (fieldValue, target) {
	return fieldValue && fieldValue.toLowerCase().indexOf(target.toLowerCase()) >= 0;
}

export default class CourseEventsStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true,
			createError: null,
			events: []
		});
	}

	async deleteEvent (event) {
		await event.delete();

		await this.load();
	}

	async createEvent (course, event, title, description, location, startDate, endDate, img) {
		this.set({
			saving: true,
			createError: null
		});

		try {
			const calendar = await course.fetchLinkParsed('CourseCalendar');
			const service = await getService();
			const formData = new FormData();

			formData.append('MimeType', Models.calendar.CourseCalendarEvent.MimeType);

			if(title) {
				formData.append('title', title);
			}

			if(description) {
				formData.append('description', description);
			}

			if(location) {
				formData.append('location', location);
			}

			if(startDate) {
				formData.append('start_time', startDate.toISOString());
			}

			if(endDate) {
				formData.append('end_time', endDate.toISOString());
			}

			if(img !== undefined) {
				formData.append('icon', img || null);
			}
			else if (event && event.icon) {
				formData.append('icon', event.icon);
			}

			let calendarEvent;

			if(event) {
				calendarEvent = await service.putParseResponse(event.getLink('edit'), formData);
			}
			else {
				calendarEvent = await service.postParseResponse(calendar.getLink('create_calendar_event'), formData);
			}

			// on successful event creation, call load to resync with server?

			this.set({
				saving: false
			});

			return calendarEvent;
		}
		catch (e) {
			let createError = e.message || e;

			if(e.code === 'RequiredMissing') {
				createError = 'Missing required field: ' + e.field;
			}

			this.set({
				loading: false,
				saving: false,
				createError
			});

			return null;
		}
	}

	doSearch (term) {
		this.searchTerm = term;
		this.set({searchTerm: term, loading: true});

		this.searchTimeout = setTimeout(() => {
			if(this.searchTerm !== term) {
				return;
			}

			this.load(term);
		}, 500);
	}

	async load (searchTerm) {
		const {course} = this.binding;

		const calendar = await course.fetchLinkParsed('CourseCalendar');
		let contents = await calendar.fetchLinkParsed('contents');

		if(this.searchTerm && this.searchTerm !== searchTerm) {
			return;
		}

		if(this.searchTerm) {
			contents = contents.filter(i => {
				return safeContains(i.title, this.searchTerm)
					|| safeContains(i.description, this.searchTerm)
					|| safeContains(i.location, this.searchTerm);
			});
		}

		// get list of events from the server
		this.set({
			loading: false,
			events: contents
		});
	}
}

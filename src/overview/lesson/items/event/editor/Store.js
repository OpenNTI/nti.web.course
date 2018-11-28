import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';
import {Models} from '@nti/lib-interfaces';

export default
@mixin(Mixins.Searchable)
class CourseEventsStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true,
			createError: null,
			events: []
		});
	}

	async createEvent (course, event, title, description, location, startDate, endDate, img) {
		this.set({
			loading: true,
			createError: null
		});

		try {
			const calendar = await course.fetchLinkParsed('CourseCalendar');
			const service = await getService();
			const formData = new FormData();

			formData.append('MimeType', Models.calendar.CourseCalendarEvent.MimeType);
			formData.append('title', title);
			formData.append('description', description);
			formData.append('location', location);
			formData.append('start_time', startDate.toISOString());
			formData.append('end_time', endDate.toISOString());

			if(img !== undefined) {
				formData.append('icon', img || null);
			}
			else if (event && event.icon) {
				formData.append('icon', event.icon);
			}

			let calendarEvent;

			if(event) {
				calendarEvent = await service.putParseResponse(calendar.getLink('edit'), formData);
			}
			else {
				calendarEvent = await service.postParseResponse(calendar.getLink('create_calendar_event'), formData);
			}

			// on successful event creation, call load to resync with server?

			this.set({
				loading: false
			});

			return calendarEvent;
		}
		catch (e) {
			this.set({
				loading: false,
				createError: e.message || e
			});
		}
	}

	async load () {
		const {course} = this.binding;

		const calendar = await course.fetchLinkParsed('CourseCalendar');
		const contents = await calendar.fetchLinkParsed('contents');

		// get list of events from the server
		this.set({
			loading: false,
			events: contents
		});
	}
}

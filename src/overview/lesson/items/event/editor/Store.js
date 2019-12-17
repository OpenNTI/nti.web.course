import {getService} from '@nti/web-client';
import {Stores} from '@nti/lib-store';
import {Models} from '@nti/lib-interfaces';
import AppDispatcher from '@nti/lib-dispatcher';
import {Events} from '@nti/web-session';

function safeContains (fieldValue, target) {
	return fieldValue && fieldValue.toLowerCase().indexOf(target.toLowerCase()) >= 0;
}

function getFormDataForCreation (data) {
	const formData = new FormData();
	const keys = Object.keys(data);

	for (let key of keys) {
		const value = data[key];

		if (value != null) {
			formData.append(key, value);
		}
	}

	return formData;
}

function getFormDataForUpdate (newData, oldData) {
	const formData = new FormData();
	let didChange = false;

	const maybeAdd = (key) => {
		if (newData[key] !== oldData[key]) {
			didChange = true;
			formData.append(key, newData[key]);
		}
	};

	if (newData.icon !== undefined) {
		didChange = true;
		formData.append('icon', newData.icon);
	}

	maybeAdd('MimeType');
	maybeAdd('title');
	maybeAdd('description');
	maybeAdd('location');
	maybeAdd('start_time');
	maybeAdd('end_time');

	return didChange ? formData : null;
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

		AppDispatcher.handleRequestAction({
			type: 'Calendar-Event-Deleted',
			data: {
				calendarEvent: event
			}
		});

		await this.load(this.searchTerm);
	}

	async createEvent (course, event, title, description, location, startDate, endDate, img) {
		this.set({
			saving: true,
			createError: null
		});

		try {
			const calendar = await course.fetchLinkParsed('CourseCalendar');
			const service = await getService();
			const newData = {
				MimeType: Models.calendar.CourseCalendarEvent.MimeType,
				title, description, location,
				icon: img,
				'start_time': startDate && startDate.toISOString(),
				'end_time': endDate && endDate.toISOString()
			};
			const oldData = !event ? null :
				{
					MimeType: event.MimeType,
					title: event.title,
					description: event.description,
					location: event.location,
					icon: event.icon,
					'start_time': event.getStartTime() && event.getStartTime().toISOString(),
					'end_time': event.getEndTime() && event.getEndTime().toISOString()
				};
			const formData = oldData ? getFormDataForUpdate(newData, oldData) : getFormDataForCreation(newData);

			if (!formData && event) {
				return event;
			}

			let calendarEvent;
			let type = 'Calendar-Event-Created';

			if(event) {
				type = 'Calendar-Event-Changed';
				const raw = await service.put(event.getLink('edit'), formData);
				await event.refresh(calendarEvent);
				calendarEvent = event;
				Events.emit(Events.EVENT_UPDATED, raw);
			}
			else {
				calendarEvent = await service.postParseResponse(calendar.getLink('create_calendar_event'), formData);
			}

			// on successful event creation, call load to resync with server?

			this.set({
				saving: false
			});

			AppDispatcher.handleRequestAction({
				type,
				data: {
					calendarEvent
				}
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

		if(this.searchTerm && this.searchTerm !== searchTerm) {
			return;
		}

		let events, error;

		try {
			const {course} = this.binding;
			const calendar = await course.fetchLinkParsed('CourseCalendar');
			events = await calendar.fetchLinkParsed('contents', {'exclude_dynamic_events': true});

			if(this.searchTerm) {
				events = events.filter(i => {
					return safeContains(i.title, this.searchTerm)
					|| safeContains(i.description, this.searchTerm)
					|| safeContains(i.location, this.searchTerm);
				});
			}

		}
		catch (e) {
			error = e;
		}

		this.set({
			loading: false,
			events,
			error
		});

	}
}

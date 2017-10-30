export function getWeekdaysFrom (entry) {
	if(entry && entry.Schedule) {
		// days could either be old format (["MWF"]) or new format (["M", "W", "F"])
		// so just join entries together to make the old format and treat it that way
		const days = entry.Schedule.days && entry.Schedule.days.join('');

		let selectedWeekdays = [];

		if(days.indexOf('M') >= 0) {
			selectedWeekdays.push('monday');
		}
		if(days.indexOf('T') >= 0) {
			selectedWeekdays.push('tuesday');
		}
		if(days.indexOf('W') >= 0) {
			selectedWeekdays.push('wednesday');
		}
		if(days.indexOf('R') >= 0) {
			selectedWeekdays.push('thursday');
		}
		if(days.indexOf('F') >= 0) {
			selectedWeekdays.push('friday');
		}
		if(days.indexOf('S') >= 0) {
			selectedWeekdays.push('saturday');
		}
		if(days.indexOf('N') >= 0) {
			selectedWeekdays.push('sunday');
		}

		return selectedWeekdays;
	}

	return [];
}

export function getDateStr (dateStr) {
	if(!dateStr) {
		let d = new Date();
		d.setHours(9);
		d.setMinutes(0);

		return d;
	}

	let d = new Date();

	const parts = dateStr.split(':');

	d.setHours(parts[0]);
	d.setMinutes(parts[1]);

	return d;
}

export function convertToTimeStr (time) {
	if(!time) {
		return '';
	}

	const parts = time.split(':');

	const hours = parseInt(parts[0], 10) % 12;
	const minutes = parts[1];
	const amPm = parseInt(parts[0], 10) >= 12 ? 'PM' : 'AM';

	return (hours || 12) + ':' + minutes + ' ' + amPm;
}

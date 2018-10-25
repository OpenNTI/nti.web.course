import {EventEmitter} from 'events';

const COUNTDOWN_THRESHOLD = 1000 * 60 * 60; // one hour
const MINUTE_THRESHOLD = 1000 * 60;

export const States = {
	Unregistered: 'unregistered',
	UnregisteredStartingSoon: 'unregistered-starting-soon',
	UnregisteredStartingInMinute: 'unregistered-starting-in-minute',
	RegisteredInactive: 'registered-inactive',
	RegisteredStartingSoon: 'registered-starting-soon',
	RegisteredStartingInMinute: 'registered-starting-in-minute',
	RegisteredActive: 'registered-active',
	RegisteredExpiringSoon: 'registered-expiring-soon',
	Expired: 'expired'
};

export default class WebinarStateManager extends EventEmitter {
	constructor (webinar, onStatusChange) {
		super();

		if(webinar) {
			this.webinar = webinar;
		}

		if(onStatusChange) {
			this.onStatusChange = onStatusChange;
		}
	}

	onTick = (clock) => {
		const currentState = this.currentState;

		const targetTime = currentState === States.RegisteredStartingSoon || currentState === States.UnregisteredStartingSoon
			? this.webinar.getNearestSession().getStartTime()
			: this.webinar.getNearestSession().getEndTime();

		const remainingTime = targetTime - clock.current;
		const needsToRecalculate = currentState === States.RegisteredStartingSoon || currentState === States.UnregisteredStartingSoon
			&& remainingTime <= MINUTE_THRESHOLD;

		if(remainingTime <= 0 || needsToRecalculate) {
			this.calculateState();
		}
		else {
			this.remainingTime = targetTime - clock.current;

			this.emit('change', this);
		}
	}

	// only allow one timeout any given time
	schedule (timeout) {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => { this.calculateState(); }, timeout);
	}

	isSessionStartingWithinMinute (session, now) {
		return session.getStartTime() > now && (session.getStartTime() - MINUTE_THRESHOLD) < now;
	}

	isSessionStartingInMoreThanAMinute (session, now) {
		return !this.isSessionStartingWithinMinute(session, now) && session.getStartTime() > now && (session.getStartTime() - COUNTDOWN_THRESHOLD) < now;
	}

	isSessionFarFromStarting (session, now) {
		return session.getStartTime() > now && (session.getStartTime() - COUNTDOWN_THRESHOLD) >= now;
	}

	isSessionExpiringSoon (session, now) {
		return session.getEndTime() >= now && session.getEndTime() - COUNTDOWN_THRESHOLD <= now;
	}

	isSessionActive (session, now) {
		return session.getStartTime() < now && (session.getEndTime() - COUNTDOWN_THRESHOLD) >= now;
	}

	async calculateState () {
		// the links can change on state changes (Join becomes available or unavailable, for example)
		await this.webinar.refresh();

		let newState = null;

		const nearestSession = this.webinar.getNearestSession();
		const now = Date.now();
		const isUnregistered = this.webinar && !this.webinar.isExpired() && !this.webinar.isJoinable() && this.webinar.hasLink('WebinarRegistrationFields');

		// unjoinable means the webinar is 'available' (not expired), but has neither the join nor registration fields links.  This can happen if
		// one GoToWebinar account was used to add webinars to a lesson, then the site is connected to a different GoToWebinar account,
		// leaving those previously added webinars in this unjoinable state
		const unJoinable = !this.webinar || (!this.webinar.isExpired() && !this.webinar.hasLink('JoinWebinar') && !this.webinar.hasLink('WebinarRegistrationFields'));

		if(this.webinar.isExpired() || unJoinable) {
			newState = { currentState: States.Expired };
		}
		else if(this.isSessionStartingWithinMinute(nearestSession, now)) {
			newState = { currentState: isUnregistered ? States.UnregisteredStartingInMinute : States.RegisteredStartingInMinute };

			this.schedule(Math.min(MINUTE_THRESHOLD, nearestSession.getStartTime() - now)); // recalculate when we expect the webinar to start
		}
		else if(this.isSessionFarFromStarting(nearestSession, now)) {
			newState = { currentState: isUnregistered ? States.Unregistered : States.RegisteredInactive };

			this.schedule(nearestSession.getStartTime() - COUNTDOWN_THRESHOLD - now); // recalculate when we get to the countdown threshold
		}
		else if(this.isSessionStartingInMoreThanAMinute(nearestSession, now)) {
			newState = {
				currentState: isUnregistered ? States.UnregisteredStartingSoon : States.RegisteredStartingSoon,
				remainingTime: nearestSession.getStartTime() - now
			};
		}
		else if(this.isSessionExpiringSoon(nearestSession, now)) {
			newState = {
				currentState: isUnregistered ? States.Unregistered : States.RegisteredExpiringSoon,
				remainingTime: nearestSession.getEndTime() - now
			};

			if(isUnregistered) {
				this.schedule(newState.remainingTime); // unregistered doesn't have an expiration countdown, starting counting down now
			}
		}
		else if(this.isSessionActive(nearestSession, now)) {
			newState = { currentState: isUnregistered ? States.Unregistered : States.RegisteredActive };

			this.schedule(nearestSession.getEndTime() - COUNTDOWN_THRESHOLD - now); // recalculate when we hit the expiration countdown threshold
		}
		else if(isUnregistered) {
			newState = { currentState: States.Unregistered };
		}

		if(newState) {
			if(this.onStatusChange) {
				this.onStatusChange(newState.currentState);
			}

			this.currentState = newState.currentState;
			this.remainingTime = newState.remainingTime;

			this.emit('change', this);
		}
	}
}

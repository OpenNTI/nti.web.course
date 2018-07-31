import {Stores} from '@nti/lib-store';

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

export default class WebinarStateStore extends Stores.SimpleStore {
	onTick = (clock) => {
		const currentState = this.get('currentState');

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
			this.set('remainingTime',  targetTime - clock.current);

			this.emitChange('remainingTime');
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
		return session.getStartTime() > now && (session.getStartTime() - COUNTDOWN_THRESHOLD) < now;
	}

	isSessionFarFromStarting (session, now) {
		return session.getStartTime() > now && (session.getStartTime() - COUNTDOWN_THRESHOLD) >= now;
	}

	isSessionExpiringSoon (session, now) {
		return session.getEndTime() - COUNTDOWN_THRESHOLD <= now;
	}

	isSessionActive (session, now) {
		return session.getStartTime() < now && (session.getEndTime() - COUNTDOWN_THRESHOLD) >= now;
	}

	calculateState (webinar, onStatusChange) {
		let newState = null;

		if(webinar) {
			this.webinar = webinar;
		}

		if(onStatusChange) {
			this.onStatusChange = onStatusChange;
		}

		const nearestSession = this.webinar.getNearestSession();
		const now = Date.now();
		const isUnregistered = this.webinar && !this.webinar.isExpired() && !this.webinar.isJoinable() && this.webinar.hasLink('WebinarRegistrationFields');

		if(this.webinar.isExpired()) {
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

			this.set('currentState', newState.currentState);
			this.set('remainingTime', newState.remainingTime);

			this.emitChange('currentState', 'remainingTime');
		}
	}
}

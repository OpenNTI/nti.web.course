/* eslint-env jest */
import StateManager, {States} from '../StateManager';

function itemBuilder () {
	return {
		_session: null,
		_isExpired: false,
		_isJoinable: false,
		_hasJoinLink: false,
		_hasRegistrationLink: false,

		session: function (val) {
			this._session = val;
			return this;
		},

		expired: function () {
			this._isExpired = true;
			return this;
		},

		joinable: function () {
			this._isJoinable = true;
			return this;
		},

		hasJoinLink: function () {
			this._hasJoinLink = true;
			return this;
		},

		hasRegistrationLink: function () {
			this._hasRegistrationLink = true;
			return this;
		},

		build: function () {
			return {
				getNearestSession: () => {
					return this._session || getMockSession();
				},
				refresh: () => { return Promise.resolve(); },
				isExpired: () => this._isExpired,
				isJoinable: () => this._isJoinable,
				hasLink: (link) => {
					if(link === 'JoinWebinar') {
						return this._hasJoinLink;
					}

					if(link === 'WebinarRegistrationFields') {
						return this._hasRegistrationLink;
					}

					return false;
				}
			};
		}
	};
}

function getMockSession (startTime, endTime) {
	return {
		getStartTime () { return startTime && new Date(startTime); },
		getEndTime () { return endTime && new Date(endTime); }
	};
}

const _30_SECONDS = 1000 * 30;
const _2_MINUTES = 1000 * 120;
const _30_MINUTES = 1000 * 60 * 30;
const _90_MINUTES = 1000 * 60 * 90;

describe('Webinar state manager utility tests', () => {
	const manager = new StateManager();
	const now = Date.now();

	test('Test isSessionStartingWithinMinute', () => {
		expect(manager.isSessionStartingWithinMinute(getMockSession(now + _30_SECONDS), now)).toBe(true); // starts 30 seconds from now
		expect(manager.isSessionStartingWithinMinute(getMockSession(now - _30_SECONDS), now)).toBe(false); // already started
		expect(manager.isSessionStartingWithinMinute(getMockSession(now + _2_MINUTES), now)).toBe(false); // starts 2 minutes from now
	});

	test('Test isSessionStartingInMoreThanAMinute', () => {
		expect(manager.isSessionStartingInMoreThanAMinute(getMockSession(now + _30_SECONDS), now)).toBe(false); // starts 30 seconds from now
		expect(manager.isSessionStartingInMoreThanAMinute(getMockSession(now - _30_SECONDS), now)).toBe(false); // already started
		expect(manager.isSessionStartingInMoreThanAMinute(getMockSession(now + _2_MINUTES), now)).toBe(true); // starts 2 minutes from now
	});

	test('Test isSessionFarFromStarting', () => {
		expect(manager.isSessionFarFromStarting(getMockSession(now + _30_SECONDS), now)).toBe(false); // starts 30 seconds from now
		expect(manager.isSessionFarFromStarting(getMockSession(now - _30_SECONDS), now)).toBe(false); // already started
		expect(manager.isSessionFarFromStarting(getMockSession(now + _90_MINUTES), now)).toBe(true); // starts 90 minutes from now
	});

	test('Test isSessionExpiringSoon', () => {
		expect(manager.isSessionExpiringSoon(getMockSession(null, now + _30_SECONDS), now)).toBe(true); // ends 30 seconds from now
		expect(manager.isSessionExpiringSoon(getMockSession(null, now + _30_MINUTES), now)).toBe(true); // ends 30 minutes from now
		expect(manager.isSessionExpiringSoon(getMockSession(null, now - _30_SECONDS), now)).toBe(false); // already ended
		expect(manager.isSessionExpiringSoon(getMockSession(null, now + _90_MINUTES), now)).toBe(false); // ends 90 minutes from now
	});

	test('Test isSessionActive', () => {
		expect(manager.isSessionActive(getMockSession(now + _30_SECONDS, now + _90_MINUTES), now)).toBe(false); // starts 30 seconds from now, ends 90 minutes from now
		expect(manager.isSessionActive(getMockSession(now - _30_SECONDS, now + _90_MINUTES), now)).toBe(true); // already started, ends 90 minutes from now
		expect(manager.isSessionActive(getMockSession(now - _90_MINUTES, now - _30_MINUTES), now)).toBe(false); // already ended
		expect(manager.isSessionActive(getMockSession(now - _30_SECONDS, now + _30_MINUTES), now)).toBe(false); // already started, ends 30 minutes from now (active must be before countdown)
	});
});

describe('Webinar state manager calculateState tests', () => {
	let state = {};
	const onStatusChange = newState => { state = newState; };

	beforeEach(() => {
		state = {};
	});

	test('Test webinar expired', async () => {
		const webinar = itemBuilder().expired().build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.Expired);
	});

	test('Test webinar unjoinable', async () => {
		const webinar = itemBuilder().build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.Expired);
	});

	test('Test webinar registered, starting within one minute', async () => {
		const webinar = itemBuilder().hasJoinLink().session(getMockSession(Date.now() + _30_SECONDS)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.RegisteredStartingInMinute);
	});

	test('Test webinar unregistered, starting within one minute', async () => {
		const webinar = itemBuilder().hasRegistrationLink().session(getMockSession(Date.now() + _30_SECONDS)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.UnregisteredStartingInMinute);
	});

	test('Test webinar registered, far from starting', async () => {
		const webinar = itemBuilder().hasJoinLink().session(getMockSession(Date.now() + _90_MINUTES)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.RegisteredInactive);
	});

	test('Test webinar unregistered, far from starting', async () => {
		const webinar = itemBuilder().hasRegistrationLink().session(getMockSession(Date.now() + _90_MINUTES)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.Unregistered);
	});

	test('Test webinar registered, starting in more than a minute (but less than an hour)', async () => {
		const webinar = itemBuilder().hasJoinLink().session(getMockSession(Date.now() + _30_MINUTES)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.RegisteredStartingSoon);
	});

	test('Test webinar unregistered, starting in more than a minute (but less than an hour)', async () => {
		const webinar = itemBuilder().hasRegistrationLink().session(getMockSession(Date.now() + _30_MINUTES)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.UnregisteredStartingSoon);
	});

	test('Test webinar registered, expiring soon', async () => {
		const webinar = itemBuilder().hasJoinLink().session(getMockSession(null, Date.now() + _30_SECONDS)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.RegisteredExpiringSoon);
	});

	test('Test webinar unregistered, expiring soon', async () => {
		const webinar = itemBuilder().hasRegistrationLink().session(getMockSession(null, Date.now() + _30_SECONDS)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.Unregistered);
	});

	test('Test webinar registered, active', async () => {
		const webinar = itemBuilder().hasJoinLink().session(getMockSession(Date.now() - _30_MINUTES, Date.now() + _90_MINUTES)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.RegisteredActive);
	});

	test('Test webinar unregistered, active', async () => {
		const webinar = itemBuilder().hasRegistrationLink().session(getMockSession(Date.now() - _30_MINUTES, Date.now() + _90_MINUTES)).build();
		const manager = new StateManager(webinar, onStatusChange);

		await manager.calculateState();

		expect(state).toEqual(States.Unregistered);
	});
});

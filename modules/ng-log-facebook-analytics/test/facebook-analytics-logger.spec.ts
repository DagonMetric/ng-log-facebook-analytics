import { LogLevel } from '@dagonmetric/ng-log';

import { FacebookAnalyticsLogger } from '../src/facebook-analytics-logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

describe('FacebookAnalyticsLogger', () => {
    let logger: FacebookAnalyticsLogger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fbq: any;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        window.fbq = fbq = jasmine.createSpy('fbq');

        logger = new FacebookAnalyticsLogger('test', {});
    });

    it("should work with 'log' method", () => {
        const message = 'This is a message.';
        const err = new Error(message);
        const properties = {
            key1: 'value1'
        };

        logger.log(LogLevel.Trace, err, { properties });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'trace', {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            message: `${err}`,
            level: 'trace',
            key1: 'value1'
        });

        logger.log(LogLevel.Debug, message, { properties });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'trace', {
            message,
            level: 'debug',
            key1: 'value1'
        });

        logger.log(LogLevel.Info, message, { properties });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'trace', {
            message,
            level: 'info',
            key1: 'value1'
        });

        logger.log(LogLevel.Warn, message, { properties });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'trace', {
            message,
            level: 'warn',
            key1: 'value1'
        });

        logger.log(LogLevel.Error, message, { properties });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'exception', {
            description: message,
            fatal: false,
            key1: 'value1'
        });

        logger.log(LogLevel.Critical, err, { properties });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'exception', {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            description: `${err}`,
            fatal: true,
            key1: 'value1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        void expect(fbq.calls.count()).toEqual(6);
    });

    it("should not track 'log' when 'logLevel' is 'None'", () => {
        logger.log(LogLevel.None, 'This is a message.');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        void expect(fbq.calls.count()).toEqual(0);
    });

    it("should work with 'startTrackPage' and 'stopTrackPage'", () => {
        logger.startTrackPage('home');
        logger.stopTrackPage('home');

        void expect(fbq).toHaveBeenCalled();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        void expect(fbq.calls.count()).toEqual(1);
    });

    it("should work with 'trackPageView'", () => {
        logger.trackPageView({
            name: 'home',
            uri: 'https://example.com/home',
            ref_uri: 'https://somewhere.com/',
            page_type: 'formPage',
            is_logged_in: false,
            properties: {
                key1: 'value1'
            }
        });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'page_view', {
            page_title: 'home',
            page_location: 'https://example.com/home',
            key1: 'value1',
            ref_uri: 'https://somewhere.com/',
            page_type: 'formPage',
            is_logged_in: false
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        void expect(fbq.calls.count()).toEqual(1);
    });

    it("should log an error when 'startTrackPage' was called more than once for the same event without calling stop", () => {
        logger.startTrackPage('home1');

        spyOn(console, 'error');

        logger.startTrackPage('home1');
        expect(console.error).toHaveBeenCalledWith(
            "The 'startTrackPage' was called more than once for this event without calling stop, name: home1."
        );
    });

    it("should log an error when calling 'startTrackPage', 'stopTrackPage' or 'trackPageView' if name could not be detected", () => {
        spyOn(console, 'error');

        logger.startTrackPage();
        expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');

        logger.stopTrackPage();
        expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');

        logger.trackPageView();
        expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');
    });

    it("should log an error when calling 'stopTrackPage' without a corresponding start", () => {
        spyOn(console, 'error');

        logger.startTrackPage('home1');
        logger.stopTrackPage('home2');
        expect(console.error).toHaveBeenCalledWith(
            "The 'stopTrackPage' was called without a corresponding start, name: home2."
        );
    });

    it("should work with 'startTrackEvent' and 'stopTrackEvent'", () => {
        const eventName = 'event1';
        logger.startTrackEvent(eventName);
        logger.stopTrackEvent(eventName);

        void expect(fbq).toHaveBeenCalled();
    });

    it("should work with 'trackEvent'", () => {
        logger.trackEvent({
            name: 'event1',
            properties: {
                key1: 'value1'
            }
        });
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'event1', {
            key1: 'value1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        void expect(fbq.calls.count()).toEqual(1);
    });

    it("should log an error when 'startTrackEvent' was called more than once for the same event without calling stop", () => {
        logger.startTrackEvent('event1');

        spyOn(console, 'error');

        logger.startTrackEvent('event1');
        expect(console.error).toHaveBeenCalledWith(
            "The 'startTrackEvent' was called more than once for this event without calling stop, name: event1."
        );
    });

    it("should log an error when calling 'stopTrackEvent' without a corresponding start", () => {
        spyOn(console, 'error');

        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event2');
        expect(console.error).toHaveBeenCalledWith(
            "The 'stopTrackEvent' was called without a corresponding start, name: event2."
        );
    });
});

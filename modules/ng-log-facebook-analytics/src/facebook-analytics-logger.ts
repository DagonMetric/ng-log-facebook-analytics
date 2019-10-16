/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { EventInfo, EventTimingInfo, Logger, LogInfo, LogLevel, PageViewInfo, PageViewTimingInfo } from '@dagonmetric/ng-log';

import { UserInfo } from './user-info';

// tslint:disable: no-typeof-undefined no-any no-unsafe-any

declare let fbq: any;
declare let FB: any;

const facebookStandardEventNames = [
    'AddPaymentInfo',
    'AddToCart',
    'AddToWishlist',
    'CompleteRegistration',
    'CustomizeProduct',
    'Donate',
    'FindLocation',
    'InitiateCheckout',
    'Lead',
    'PageView',
    'Purchase',
    'Schedule',
    'Search',
    'StartTrial',
    'SubmitApplication',
    'Subscribe',
    'ViewContent'
];

/**
 * Facebook analytics implementation for `Logger`.
 */
export class FacebookAnalyticsLogger extends Logger {
    private readonly _eventTiming: Map<string, number> = new Map<string, number>();

    constructor(
        readonly name: string,
        private readonly _userInfo: UserInfo) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        // tslint:disable-next-line: no-any
        const properties: { [key: string]: any } = logInfo && logInfo.properties ? { ...logInfo.properties } : {};

        if (this._userInfo.userId) {
            properties.user_id = this._userInfo.userId;
        }

        if (this._userInfo.accountId) {
            properties.account_id = this._userInfo.accountId;
        }

        if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            properties.description = typeof message === 'string' ? message : `${message}`;
            properties.fatal = logLevel === LogLevel.Critical;

            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'exception', properties);
            } else if (typeof FB !== 'undefined') {
                FB.AppEvents.logEvent('exception', null, properties);
            }
        } else {
            let level: string;
            if (logLevel === LogLevel.Trace) {
                level = 'trace';
            } else if (logLevel === LogLevel.Debug) {
                level = 'debug';
            } else if (logLevel === LogLevel.Info) {
                level = 'info';
            } else {
                level = 'warn';
            }

            properties.message = typeof message === 'string' ? message : `${message}`;
            properties.level = level;

            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'trace', properties);
            } else if (typeof FB !== 'undefined') {
                FB.AppEvents.logEvent('trace', null, properties);
            }
        }
    }

    startTrackPage(name?: string): void {
        if (name == null) {
            name = window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackPage' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        this._eventTiming.set(name, +new Date());
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        if (name == null) {
            name = window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackPage' was called without a corresponding start, name: ${name}.`);

            return;
        }

        this._eventTiming.delete(name);

        const duration = Math.max(+new Date() - start, 0);
        const properties = this.getMappedPageViewProps(pageViewInfo);
        properties.page_title = name;
        properties.duration = duration;

        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'page_view', properties);
        } else if (typeof FB !== 'undefined') {
            FB.AppEvents.logEvent('page_view', null, properties);
        }
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        const properties = this.getMappedPageViewProps(pageViewInfo);
        if (pageViewInfo && pageViewInfo.name) {
            properties.page_title = pageViewInfo.name;
        }

        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'page_view', properties);
        } else if (typeof FB !== 'undefined') {
            FB.AppEvents.logEvent('page_view', null, properties);
        }
    }

    startTrackEvent(name: string): void {
        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackEvent' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        this._eventTiming.set(name, +new Date());
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        this._eventTiming.delete(name);

        const duration = Math.max(+new Date() - start, 0);
        const properties = this.getMappedEventProps(eventInfo);
        properties.duration = duration;

        if (typeof fbq !== 'undefined') {
            const foundStandardName = facebookStandardEventNames.find(e => e.toUpperCase() === name.toUpperCase());
            if (foundStandardName) {
                fbq('track', foundStandardName, properties);
            } else {
                fbq('trackCustom', name, properties);
            }
        } else if (typeof FB !== 'undefined') {
            FB.AppEvents.logEvent(name, null, properties);
        }
    }

    trackEvent(eventInfo: EventInfo): void {
        const properties = this.getMappedEventProps(eventInfo);

        if (typeof fbq !== 'undefined') {
            const foundStandardName = facebookStandardEventNames.find(e => e.toUpperCase() === eventInfo.name.toUpperCase());
            if (foundStandardName) {
                fbq('track', foundStandardName, properties);
            } else {
                fbq('trackCustom', eventInfo.name, properties);
            }
        } else if (typeof FB !== 'undefined') {
            FB.AppEvents.logEvent(eventInfo.name, null, properties);
        }
    }

    flush(): void {
        // Do nothing
    }

    private getMappedEventProps(eventInfo?: EventTimingInfo): { [key: string]: any } {
        if (!eventInfo) {
            return {};
        }

        const mappedProps: { [key: string]: any } = {
            ...eventInfo.properties,
            ...eventInfo.measurements
        };

        if (this._userInfo.userId) {
            mappedProps.user_id = this._userInfo.userId;
        }

        if (this._userInfo.accountId) {
            mappedProps.account_id = this._userInfo.accountId;
        }

        return mappedProps;
    }

    private getMappedPageViewProps(pageViewInfo?: PageViewTimingInfo): { [key: string]: any } {
        if (!pageViewInfo) {
            return {};
        }

        const mappedProps: { [key: string]: any } = {
            ...pageViewInfo.properties,
            ...pageViewInfo.measurements
        };

        if (pageViewInfo.uri) {
            if (pageViewInfo.uri.startsWith('/')) {
                mappedProps.page_path = pageViewInfo.uri;
            } else {
                mappedProps.page_location = pageViewInfo.uri;
            }
        }

        if (pageViewInfo.ref_uri) {
            mappedProps.ref_uri = pageViewInfo.ref_uri;
        }

        if (pageViewInfo.page_type) {
            mappedProps.page_type = pageViewInfo.page_type;
        }

        if (pageViewInfo.is_logged_in != null) {
            mappedProps.is_logged_in = pageViewInfo.is_logged_in;
        }

        if (this._userInfo.userId) {
            mappedProps.user_id = this._userInfo.userId;
        }

        if (this._userInfo.accountId) {
            mappedProps.account_id = this._userInfo.accountId;
        }

        return mappedProps;
    }
}

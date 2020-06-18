/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@angular/core';

import {
    EventInfo,
    EventTimingInfo,
    LogInfo,
    LogLevel,
    Logger,
    LoggerProvider,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

import { FacebookAnalyticsLogger } from './facebook-analytics-logger';
import { UserInfo } from './user-info';

/**
 * Logger provider factory for `FacebookAnalyticsLogger`.
 */
@Injectable({
    providedIn: 'any'
})
export class FacebookAnalyticsLoggerProvider extends Logger implements LoggerProvider {
    private currentLoggerInternal?: FacebookAnalyticsLogger;
    private readonly userInfo: UserInfo = {};

    get name(): string {
        return 'facebookAnalytics';
    }

    get currentLogger(): FacebookAnalyticsLogger {
        if (this.currentLoggerInternal) {
            return this.currentLoggerInternal;
        }

        this.currentLoggerInternal = new FacebookAnalyticsLogger('', this.userInfo);

        return this.currentLoggerInternal;
    }

    constructor() {
        super();
    }

    createLogger(category: string): Logger {
        return new FacebookAnalyticsLogger(category, this.userInfo);
    }

    setUserProperties(userId: string, accountId?: string): void {
        this.userInfo.userId = userId;
        this.userInfo.accountId = accountId;
    }

    clearUserProperties(): void {
        this.userInfo.userId = undefined;
        this.userInfo.accountId = undefined;
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        this.currentLogger.log(logLevel, message, logInfo);
    }

    startTrackPage(name?: string): void {
        this.currentLogger.startTrackPage(name);
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        this.currentLogger.stopTrackPage(name, pageViewInfo);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        this.currentLogger.trackPageView(pageViewInfo);
    }

    startTrackEvent(name: string): void {
        this.currentLogger.startTrackEvent(name);
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        this.currentLogger.stopTrackEvent(name, eventInfo);
    }

    trackEvent(eventInfo: EventInfo): void {
        this.currentLogger.trackEvent(eventInfo);
    }

    flush(): void {
        this.currentLogger.flush();
    }
}

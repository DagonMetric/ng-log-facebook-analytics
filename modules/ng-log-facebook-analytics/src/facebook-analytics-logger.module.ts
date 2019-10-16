/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';

import { LOGGER_PROVIDER } from '@dagonmetric/ng-log';

import { FacebookAnalyticsLoggerProvider } from './facebook-analytics-logger-provider';

/**
 * The `NGMODULE` for providing `LOGGER_PROVIDER` with `FacebookAnalyticsLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LOGGER_PROVIDER,
            useClass: FacebookAnalyticsLoggerProvider,
            multi: true
        }
    ]
})
export class FacebookAnalyticsLoggerModule { }

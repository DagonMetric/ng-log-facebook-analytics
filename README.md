# Angular Facebook Pixel Analytics Implementation for NG-LOG

[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-log-facebook-analytics.svg)](https://www.npmjs.com/package/@dagonmetric/ng-log-facebook-analytics)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Facebook Pixel Analytics implementation for [@dagonmetric/ng-log](https://github.com/DagonMetric/ng-log) - vendor-agnostic logging, analytics and telemetry service abstractions for Angular applications.

## Getting Started

### Prerequisites

The following npm packages are required before using this module.

* @dagonmetric/ng-log >= v2.2.0 [npm](https://www.npmjs.com/package/@dagonmetric/ng-log)

### Add Facebook JavaScript SDK or Facebook Pixel Code Snippet

#### To Add Facebook Pixel

Copy & paste Facebook pixel code to your site from [Facebook pixel setup guide](https://www.facebook.com/business/m/pixel-setup-get-started).

#### To Add Facebook JavaScript SDK

Copy & paste Facebook sdk code to your site from [acebook SDK for JavaScript](https://developers.facebook.com/docs/javascript/).

### Installation

npm

```bash
npm install @dagonmetric/ng-log-facebook-analytics
```

or yarn

```bash
yarn add @dagonmetric/ng-log-facebook-analytics
```

### Module Setup (app.module.ts)

```typescript
import { LogModule } from '@dagonmetric/ng-log';
import { FacebookAnalyticsLoggerModule } from '@dagonmetric/ng-log-facebook-analytics';

@NgModule({
  imports: [
    // Other module imports

    // ng-log modules
    LogModule,
    FacebookAnalyticsLoggerModule
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { LogService } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private readonly _logService: LogService) { }

  ngOnInit(): void {
    // Track traces
    this._logService.trace('Testing trace');
    this._logService.debug('Testing debug');
    this._logService.info('Testing info');
    this._logService.warn('Testing warn');

    // Track exceptions
    this._logService.error(new Error('Testing error'));
    this._logService.fatal(new Error('Testing critical'));

    // Track page view
    this._logService.trackPageView({
      name: 'My Angular App',
      uri: '/home'
    });

    // Track page view with timing
    this._logService.startTrackPage('about');
    this._logService.stopTrackPage('about', { uri: '/about' });

    // Track custom event
    this._logService.trackEvent({
      name: 'video_auto_play_start',
      properties: {
        non_interaction: true
      }
    });

    // Track custom event with timing
    this._logService.startTrackEvent('video_auto_play');
    this._logService.stopTrackEvent('video_auto_play', {
      properties: {
        non_interaction: true
      }
    });

    // Set user properties
    this._logService.setUserProperties('<Authenticated User Id>', '<Account Id>');

    // Clear user properties
    this._logService.clearUserProperties();
  }
}
```

## Related Projects

* [ng-log](https://github.com/DagonMetric/ng-log) -vendor-agnostic logging, analytics and telemetry service abstractions and some implementations
* [ng-log-applicationinsights](https://github.com/DagonMetric/ng-log-applicationinsights) - Microsoft Azure Application Insights implementation for `ng-log`
* [ng-log-firebase-analytics](https://github.com/DagonMetric/ng-log-firebase-analytics) - Firebase Analytics implementation for `ng-log`
* [ng-log-gtag](https://github.com/DagonMetric/ng-log-gtag) - Angular Google Analytics (gtag.js) logger implementation for `ng-log`

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log-facebook-analytics/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log-facebook-analytics/blob/master/LICENSE) license.

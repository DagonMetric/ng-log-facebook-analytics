# Angular Facebook Pixel Analytics Integration for NG-LOG

[![GitHub Actions Status](https://github.com/DagonMetric/ng-log-facebook-analytics/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-log-facebook-analytics/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-log/_apis/build/status/DagonMetric.ng-log-facebook-analytics?branchName=master)](https://dev.azure.com/DagonMetric/ng-log/_build?definitionId=21)
[![npm version](https://badge.fury.io/js/%40dagonmetric%2Fng-log-facebook-analytics.svg)](https://www.npmjs.com/package/@dagonmetric/ng-log-facebook-analytics)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Facebook Pixel Analytics integration of [DagonMetric/ng-log](https://github.com/DagonMetric/ng-log) for Angular applications.

## Getting Started

### Prerequisites

You can use either Facebook Pixel or Facebook JavaScript SDK to log events.

#### To Add Facebook Pixel

Copy & paste Facebook pixel code to your site from [Facebook pixel setup guide](https://www.facebook.com/business/m/pixel-setup-get-started).

#### To Add Facebook JavaScript SDK

Copy & paste Facebook sdk code to your site from [acebook SDK for JavaScript](https://developers.facebook.com/docs/javascript/).

### Installation

npm

```bash
npm install @dagonmetric/ng-log @dagonmetric/ng-log-facebook-analytics
```

or yarn

```bash
yarn add @dagonmetric/ng-log @dagonmetric/ng-log-facebook-analytics
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

Live edit [app.module.ts in stackblitz](https://stackblitz.com/github/dagonmetric/ng-log-facebook-analytics/tree/master/samples/demo-app?file=src%2Fapp%2Fapp.module.ts)

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { LogService } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private readonly logService: LogService) { }

  ngOnInit(): void {
    // Track traces
    this.logService.trace('Testing trace');
    this.logService.debug('Testing debug');
    this.logService.info('Testing info');
    this.logService.warn('Testing warn');

    // Track exceptions
    this.logService.error(new Error('Testing error'));
    this.logService.fatal(new Error('Testing critical'));

    // Track page view
    this.logService.trackPageView({
      name: 'My Angular App',
      uri: '/home'
    });

    // Track page view with timing
    this.logService.startTrackPage('about');
    this.logService.stopTrackPage('about', { uri: '/about' });

    // Track custom event
    this.logService.trackEvent({
      name: 'video_auto_play_start',
      properties: {
        non_interaction: true
      }
    });

    // Track custom event with timing
    this.logService.startTrackEvent('video_auto_play');
    this.logService.stopTrackEvent('video_auto_play', {
      properties: {
        non_interaction: true
      }
    });

    // Set user properties
    this.logService.setUserProperties('<Authenticated User Id>', '<Account Id>');

    // Clear user properties
    this.logService.clearUserProperties();
  }
}
```

Live edit [app.component.ts in stackblitz](https://stackblitz.com/github/dagonmetric/ng-log-facebook-analytics/tree/master/samples/demo-app?file=src%2Fapp%2Fapp.component.ts)

## Samples

* Demo app [view source](https://github.com/DagonMetric/ng-log-facebook-analytics/tree/master/samples/demo-app) / [live edit in stackblitz](https://stackblitz.com/github/dagonmetric/ng-log-facebook-analytics/tree/master/samples/demo-app)

## Related Projects

* [ng-log](https://github.com/DagonMetric/ng-log) - Vendor-agnostic logging, analytics and telemetry service abstractions and some implementations for Angular applications
* [ng-log-applicationinsights](https://github.com/DagonMetric/ng-log-applicationinsights) - Microsoft Azure Application Insights implementation for `ng-log`
* [ng-log-firebase-analytics](https://github.com/DagonMetric/ng-log-firebase-analytics) - Firebase Analytics implementation for `ng-log`
* [ng-log-gtag](https://github.com/DagonMetric/ng-log-gtag) - Angular Google Analytics (gtag.js) logger implementation for `ng-log`

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log-facebook-analytics/blob/master/CONTRIBUTING.md) page.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log-facebook-analytics/blob/master/LICENSE) license.

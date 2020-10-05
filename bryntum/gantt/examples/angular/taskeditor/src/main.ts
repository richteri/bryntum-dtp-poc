import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Moved from polyfills.ts to main.ts for proper support of UMD bundle which contains polyfills.
// Revert this change to use project module bundle.
import 'zone.js/dist/zone';  // Included with Angular CLI.

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

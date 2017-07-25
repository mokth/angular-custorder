import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
//import { platformBrowser } from "@angular/platform-browser";

if (environment.production) {
  enableProdMode();
}

//platformBrowser().bootstrapModuleFactory(AppModule);
platformBrowserDynamic().bootstrapModule(AppModule);

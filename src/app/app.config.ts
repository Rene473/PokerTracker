import { registerLocaleData } from '@angular/common';
import localeEnNz from '@angular/common/locales/en-NZ';
import {
    ApplicationConfig,
    DEFAULT_CURRENCY_CODE,
    LOCALE_ID,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';

registerLocaleData(localeEnNz);

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'NZD' },
        { provide: LOCALE_ID, useValue: 'en-NZ' },
    ],
};

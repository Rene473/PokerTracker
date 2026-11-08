/// <reference types="vite/client" />

import '@angular/compiler';
import 'zone.js';

import {
    provideZoneChangeDetection,
    ɵresolveComponentResources,
} from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { afterEach, beforeEach } from 'vitest';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

const componentResources = import.meta.glob('/src/app/**/*.{html,scss}', {
    eager: true,
    import: 'default',
    query: '?raw',
});

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
);

afterEach(() => getTestBed().resetTestingModule());

beforeEach(async () => {
    getTestBed().configureTestingModule({
        providers: [provideZoneChangeDetection()],
    });
    await ɵresolveComponentResources(async (url) => {
        const resourcePath = url.replace(/^\.\//, '').replace(/\\/g, '/');
        const resourceKey = Object.keys(componentResources).find((path) =>
            path.endsWith(resourcePath),
        );

        if (!resourceKey) {
            throw new Error(
                `Unable to load Angular component resource: ${url}`,
            );
        }

        return String(componentResources[resourceKey]);
    });
});

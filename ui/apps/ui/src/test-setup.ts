import '@angular/localize/init';
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { TextEncoder } from 'util';

// jsdom lacks it, and compiling templates with i18n attributes needs it
Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder });

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

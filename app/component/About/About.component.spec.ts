/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  async, inject
} from '@angular/core/testing';

import { AboutComponent } from './About.component';

describe('Component: About', () => {
  it('should create an instance', () => {
    let component = new AboutComponent();
    expect(component).toBeTruthy();
  });
});

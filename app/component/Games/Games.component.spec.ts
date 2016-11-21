/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  async, inject
} from '@angular/core/testing';

import { GamesComponent } from './Games.component';

describe('Component: Games', () => {
  it('should create an instance', () => {
    let component = new GamesComponent();
    expect(component).toBeTruthy();
  });
});

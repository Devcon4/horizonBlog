import { NgModule }       from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from "@angular/common";
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { appRouterProviders } from './app.routes';

import { HomeComponent } from './component/Home';
import { AboutComponent } from './component/About';
import { GamesComponent } from './component/Games';

@NgModule({
	declarations: [
		AppComponent,
        HomeComponent,
        AboutComponent,
        GamesComponent
	],
	imports: [
		appRouterProviders,
		BrowserModule,
		RouterModule,
		FormsModule,
		HttpModule,
		MdCheckboxModule
	],
	bootstrap: [AppComponent],
	providers: [
		{provide: LocationStrategy, useClass: HashLocationStrategy},
		HttpModule,
	],
})
export class AppModule {
}
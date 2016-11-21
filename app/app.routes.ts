import { AppComponent } from "./app.component";
import { RouterModule, Routes } from '@angular/router';

import { HomeRoutes } from './component/Home/Home.routes';
import { GamesRoutes } from './component/Games/Games.routes';
import { AboutRoutes } from './component/About/About.routes';
/**import GO Here*/

const routes: Routes = [
    ...HomeRoutes,
    ...GamesRoutes,
    ...AboutRoutes,
    /**routes GO Here */

    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
];

export const appRouterProviders = RouterModule.forRoot(routes);
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SHARED_CONSTANTS } from './shared/shared-constants';

const routes: Routes = [
    {
        path: SHARED_CONSTANTS.ROUTES.JSON_VALIDATOR,
        loadChildren: () => import('./views/json-validator/json-validator.module').then(m => m.JsonValidatorModule)
    },
    {
        path: SHARED_CONSTANTS.ROUTES.STRING_UTILITIES_CALCULATOR,
        loadChildren: () => import('./views/string-utilities/string-utilities.module').then(m => m.StringUtilitiesModule)
    },
    {
        path: '**',
        redirectTo: 'json-validator'
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {
        initialNavigation: 'enabled'
    }) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SHARED_CONSTANTS } from './shared/shared-constants';

const routes: Routes = [
    {
        path: SHARED_CONSTANTS.ROUTES.JSON_VALIDATOR,
        loadChildren: () => import('./views/json-validator/json-validator.module').then(m => m.JsonValidatorModule)
    },
    {
        path: SHARED_CONSTANTS.ROUTES.STRING_LENGTH,
        loadChildren: () => import('./views/string-length/string-length.module').then(m => m.StringLengthModule)
    },
    {
        path: '**',
        redirectTo: 'json-validator'
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }

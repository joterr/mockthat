import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'json-validator',
        loadChildren: () => import('./views/json-validator/json-validator.module').then(m => m.JsonValidatorModule)
    },
    {
        path: 'rest-api',
        loadChildren: () => import('./views/rest-api/rest-api.module').then(m => m.RestApiModule)
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

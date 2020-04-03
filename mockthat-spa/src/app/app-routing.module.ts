import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'json-validator',
        loadChildren: () => import('./views/json-validator/json-validator.module').then(m => m.JsonValidatorModule)
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

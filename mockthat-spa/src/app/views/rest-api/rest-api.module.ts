import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestApiComponent } from './rest-api.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RestApiComponent
  ],
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: RestApiComponent }
    ])
  ]
})
export class RestApiModule { }

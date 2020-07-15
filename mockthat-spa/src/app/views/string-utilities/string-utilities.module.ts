import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StringUtilitiesComponent } from './string-utilities.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    StringUtilitiesComponent
  ],
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: StringUtilitiesComponent }
    ])
  ]
})
export class StringUtilitiesModule { }

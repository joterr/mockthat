import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StringLengthComponent } from './string-length.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    StringLengthComponent
  ],
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: StringLengthComponent }
    ])
  ]
})
export class StringLengthModule { }

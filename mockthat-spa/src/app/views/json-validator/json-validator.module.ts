import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JsonValidatorComponent } from './json-validator.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    JsonValidatorComponent
  ],
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: JsonValidatorComponent }
    ])
  ]
})
export class JsonValidatorModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JsonValidatorComponent } from './json-validator.component';

@NgModule({
  declarations: [
    JsonValidatorComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: JsonValidatorComponent }
    ]),
    CommonModule
  ]
})
export class JsonValidatorModule { }

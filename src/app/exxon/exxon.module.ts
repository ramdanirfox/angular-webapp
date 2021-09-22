import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExxonRoutingModule } from './exxon-routing.module';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ExxonRoutingModule,
    MaterialModule
  ]
})
export class ExxonModule { }

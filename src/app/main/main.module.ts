import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MaterialModule } from '../shared/material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import { ConfigComponent } from './config/config.component';
import { NotaComponent } from './nota/nota.component';
import { DocviewComponent } from './docview/docview.component';
import { FileChunkComponent } from './file-chunk/file-chunk.component';


@NgModule({
  declarations: [
    MainComponent,
    ConfigComponent,
    NotaComponent,
    DocviewComponent,
    FileChunkComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class MainModule { }

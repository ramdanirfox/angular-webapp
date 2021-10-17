import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwimpieComponent } from './components/swimpie/swimpie.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SwimtableComponent } from './components/swimtable/swimtable.component';

const COMPONENTS = [
  SwimpieComponent,
  SwimtableComponent
];

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    // npm install @types/d3 --save-dev
    NgxChartsModule,
    NgxDatatableModule
  ],
  exports: [
    COMPONENTS
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found.component';
import { ConfigComponent } from './config/config.component';
import { MainComponent } from './main.component';
import { RT_MAIN } from './main.routes';

const R_MAIN = new RT_MAIN();
const routes: Routes = [
  {
    path: '',
    redirectTo: R_MAIN.CONFIG,
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: R_MAIN.CONFIG,
        component: ConfigComponent,
        data: { animation: '0'}
      }/* ,
      {
        path: R_ACCOUNT.SIGNUP,
        component: ,
        data: { animation: '1'}
      } */
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RT_APP } from './app.routes';
import { NotFoundComponent } from './not-found.component';

const R_APP = new RT_APP();
const routes: Routes = [
  {
    path: '',
    redirectTo: R_APP.ACCOUNT,
    pathMatch: 'full'
  },
  {
    path: R_APP.ACCOUNT,
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: R_APP.EXXON,
    loadChildren: () => import('./exxon/exxon.module').then(m => m.ExxonModule)
  },
  {
    path: R_APP.MAIN,
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

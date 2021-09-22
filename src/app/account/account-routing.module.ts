import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found.component';
import { RT_ACCOUNT } from './account.routes';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const R_ACCOUNT = new RT_ACCOUNT();
const routes: Routes = [
  {
    path: '',
    redirectTo: R_ACCOUNT.LOGIN,
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: R_ACCOUNT.LOGIN,
        component: LoginComponent,
        data: { animation: '0'}
      },
      {
        path: R_ACCOUNT.SIGNUP,
        component: SignupComponent,
        data: { animation: '1'}
      }
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
export class AccountRoutingModule { }

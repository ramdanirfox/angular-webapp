import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found.component';
import { AccountComponent } from './account.component';
import { RT_ACCOUNT } from './account.routes';
import { ExampleComponent } from './example/example.component';
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
    component: AccountComponent,
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
      },
      {
        path: R_ACCOUNT.EXAMPLE,
        component: ExampleComponent,
        data: { animation: '2'}
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

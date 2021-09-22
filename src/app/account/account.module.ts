import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AccountComponent } from './account.component';
import { NotFoundComponent } from '../not-found.component';
import { MaterialModule } from '../shared/material.module';
import { AccountService } from './account.service';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }

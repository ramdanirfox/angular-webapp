import { Component, OnInit } from '@angular/core';
import { RT_ACCOUNT } from '../account.routes';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = '';
  password = '';
  R_ACCOUNT = new RT_ACCOUNT();
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  login(form: any) {
    console.log('Form', this.user, this.password);
    this.accountService.login({ user: this.user, password: this.password }).subscribe(x => {
      console.log('->res login', x);
    })
  }

}

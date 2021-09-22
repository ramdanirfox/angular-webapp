import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = '';
  password = '';
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

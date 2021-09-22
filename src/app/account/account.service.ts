import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators';

const SERVER = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) { }

  login(form: any) {
    const url = SERVER + '/user/login'
    const body = { user: form.user, password: form.password };
    return this.httpClient.post(url, body).pipe(map((x) => {
      return x;
    }));
  }
}

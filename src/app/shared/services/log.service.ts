import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  enabled = true;

  constructor() { }

  log(message?: any, ...optionalParams: any[]) {
    if (this.enabled) {
      console.log('MyLOG : ', message, ...optionalParams);
    }
  }
}

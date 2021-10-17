import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GeisaRequestEvent } from '../shared/model/service.model';
import { copy } from '../shared/util/common-helper';
const SERVER = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private httpClient: HttpClient) { }

  genericFn(param: any) {
    const url = SERVER + '/.netlify/functions/awsabroad';
    const body = JSON.stringify(param);
    return this.httpClient.post(url, body);
  }

  genericFnEvt<V = {[keyof: string]: any }>(param: any): Observable<GeisaRequestEvent<V>> {
    const url = SERVER + '/.netlify/functions/awsabroad';
    const body = JSON.stringify(param);
    return this.httpClient.post(url, body, {observe: 'events'}).pipe(map(x => {
      console.log('xnya', x);
      const modRes: GeisaRequestEvent<V> = this.resultEventModifier<V>(x);
      return modRes;
    }))
  }
  
  resultEventModifier<V>(res: any): GeisaRequestEvent<V> {
    let modRes = new GeisaRequestEvent<V>();
    if (!res.type) {
      modRes = {
        url: '',
        uploadLoaded: 0,
        uploadTotal: 0,
        uploadPercent: 0,
        body: undefined,
        downloadLoaded: 0,
        downloadTotal: 0,
        downloadPercent: 0,
        headers: undefined,
        type: res.type,
        status: 0
      };
    }
    else if (res.type == 1) {
      modRes = {
        url: '',
        uploadLoaded: res.loaded,
        uploadTotal: res.total,
        uploadPercent: Number(((res.loaded / res.total) * 100).toFixed(1)),
        body: undefined,
        downloadLoaded: 0,
        downloadTotal: 0,
        downloadPercent: 0,
        headers: undefined,
        type: res.type,
        status: 0
      };
    }
    else if (res.type == 2) {
      modRes = {
        url: '',
        uploadLoaded: 1,
        uploadTotal: 1,
        uploadPercent: 100,
        body: undefined,
        downloadLoaded: 0,
        downloadTotal: 0,
        downloadPercent: 0,
        headers: undefined,
        type: res.type,
        status: res.status
      };
    }
    else if (res.type == 3) {
      modRes = {
        url: '',
        uploadLoaded: 1,
        uploadTotal: 1,
        uploadPercent: 100,
        body: undefined,
        downloadLoaded: res.loaded,
        downloadTotal: res.total,
        downloadPercent: Number(((res.loaded / res.total) * 100).toFixed(1)),
        headers: undefined,
        type: res.type,
        status: 0
      };
    }
    else if (res.type == 4) {
      modRes = Object.assign(modRes, copy(res.body));
      modRes = {
        url: res.url,
        uploadLoaded: 1,
        uploadTotal: 1,
        uploadPercent: 100,
        body: res.body,
        downloadLoaded: 2,
        downloadTotal: 2,
        downloadPercent: 100,
        headers: res.headers,
        type: res.type,
        status: res.status
      };
    }
    else {
    }
    return modRes;
  }
}

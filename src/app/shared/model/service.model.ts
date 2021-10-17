import { HttpHeaders } from "@angular/common/http";

export class GeisaRequestEvent<G> {
    status: 200 | 400 | 500 | number = 200;
    type: 1 | 2 | 3 | 4 = 1;
    url: string = '';
    uploadLoaded: number = 0;
    uploadTotal: number = 0;
    uploadPercent: number = 0;
    downloadLoaded: number = 0;
    downloadTotal: number = 0;
    downloadPercent: number = 0;
    body: G | undefined;
    headers: HttpHeaders | undefined;
  }
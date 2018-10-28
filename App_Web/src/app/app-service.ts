import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FireGeo } from './fireGeo';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  coordinatesStorage: FireGeo;

  constructor(private http: HttpClient) {
    this.coordinatesStorage = new FireGeo();
  }

  GetData() {
    const url = 'https://fire.iconx.app/api';

    return this.http.get(url);
  }

  SendData(data) {
    const url = 'https://fire.iconx.app/api/pictures';

    return this.http.post(url, data);
  }
}

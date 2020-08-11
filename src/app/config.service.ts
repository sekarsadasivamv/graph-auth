import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {
    Url: string;
  }
  
@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
  configUrl = 'assets/config.json';

getConfig() {
  // now returns an Observable of Config
  return this.http.get<Config>(this.configUrl);
}
}
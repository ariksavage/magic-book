import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  get(path: string) {
    return this.http.get('/api/'+path).toPromise().then((response: any) => {
      return this.handleResponse(response);
    });
  }

  post(path: string, data: any = {}) {
    const url = '/api/' + path;
    return this.http.post<any>(url, data).toPromise().then(response => {
      return this.handleResponse(response);
    });
  };

  handleResponse(response: any) {
    return response;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {

  constructor(private http: HttpClient) { }

  // Uses http.get() to load data from a single API endpoint
  getUserDetails() {
    return this.http.get('http://localhost:8080/api/v1/get-user-details').subscribe(res =>{
      console.log(res)
    });
  }
}

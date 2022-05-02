import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:1337/';
  thirdPartySignupData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private httpClient: HttpClient
  ) { }

  getLoggedInUser(){
    return JSON.parse(sessionStorage.getItem('login-user'));
  }

  getToken(){
    return sessionStorage.getItem('auth-token');
  }

  setToken(token){
    sessionStorage.setItem('auth-token', token);
  }

  setLoggedInUser(user){
    sessionStorage.setItem('login-user', JSON.stringify(user));
  }

  emailLogin(cred: any){
    let url = `${this.apiUrl}login`;
    console.log("\n\n ~ file: auth.service.ts ~ line 34 ~ url", url)
    return this.httpClient.post(url, cred);
  }
  
  logout(){
    sessionStorage.removeItem('auth-token')
    sessionStorage.removeItem('login-user')
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = 'http://localhost:1337/';

  constructor(
    private httpClient: HttpClient
  ) { }

  createOrder(payload){
    let url = `${this.apiUrl}order`;
    console.log("\n\n ~ file: auth.service.ts ~ line 34 ~ url", url)
    return this.httpClient.post(url, payload);
  }
}

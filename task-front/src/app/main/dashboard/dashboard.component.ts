import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {PaymentService} from '../../services/payment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rzp: any;
  user: any = {};

  rzpOptions: any = {
    key: 'rzp_test_KAsdFssTEcgTDp',
    amount: '100',
    currency: 'INR',
    name: 'Interview Task',
    description: 'Test Transaction',
    order_id: '',
    theme: {
        'color': '#3399cc'
    },
    handler: this.onSuccessPayment
  };

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
  }

  checkout(){
    // let payload = {
    //   name: this.user.name,
    //   user: this.user.id,
    //   amount: 100
    // };
    // this.paymentService.createOrder(payload).subscribe((res: any) => {
    //   if(res){
        // console.log('res: ', res);
        this.rzpOptions.prefill = {
          'name': this.user.name,
          'email': this.user.email,
          'contact': '9999999999'
      },
        this.rzp = new this.getWindow.Razorpay(this.rzpOptions);
        this.rzp.open();

        this.rzp.on('payment.failed', (response) =>{
          alert('payment failed');
          console.log('response.error.code: ', response.error.code);
          console.log('response.error.description: ', response.error.description);
          console.log('response.error.source: ', response.error.source);
          console.log('response.error.step: ', response.error.step);
          console.log('response.error.reason: ', response.error.reason);
          console.log('response.error.metadata.order_id: ', response.error.metadata.order_id);
          console.log('response.error.metadata.payment_id: ', response.error.metadata.payment_id);
        });
    //   }
    // }, (error: any) => {
    //   console.log('error: ', error);

    // });
  }

  get getWindow(): any{
    return window;
  }

  onSuccessPayment(response: any){
    console.log("\n\n ~ file: dashboard.component.ts ~ line 75 ~ response", response);
  }

  logout(){
    this.authService.logout();
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 200);
  }

}

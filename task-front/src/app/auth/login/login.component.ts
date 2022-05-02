import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  cred: any = {};

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private fb: FormBuilder
  ) {
    this.createForm();
   }

  createForm(){
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  emailLogin(){
    this.authService.emailLogin(this.cred).subscribe((res: any) => {
      if (res && res.authToken){
        this.authService.setToken(res.token);
        this.authService.setLoggedInUser(res.user);
        this.router.navigate(['/dashboard']);
      }
    }, (err: any) => {
      console.log('err: ',err);
    });
  }

  googleLogin(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: any) => {
      if(user){
        user.isThirdPartyLogin = true;
        delete user.response;
        this.authService.emailLogin(user).subscribe((res: any) => {
          if (res && res.authToken){
            this.authService.setToken(res.token);
            this.authService.setLoggedInUser(res.user);
            this.router.navigate(['/dashboard']);
          }
        }, (err: any) => {
          console.log('err: ',err);
        });
      }
    }).catch((err) => {
      console.log('error: ', err);
    });
  }

  facebookLogin(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user: any) => {
      if(user){
        user.isThirdPartyLogin = true;
        delete user.response;
        this.authService.emailLogin(user).subscribe((res: any) => {
          if (res && res.authToken){
            this.authService.setToken(res.token);
            this.authService.setLoggedInUser(res.user);
            this.router.navigate(['/dashboard']);
          }
        }, (err: any) => {
          console.log('err: ',err);
        });
      }
    }).catch((err) => {
      console.log('error: ', err);
    });
  }

}

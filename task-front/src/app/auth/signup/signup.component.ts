import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupUser: any = {};
  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private fb: FormBuilder
  ) {
    this.createForm();
   }

  ngOnInit(): void {
  }

  createForm(){
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  emailSignup(){
    this.authService.emailLogin(this.signupUser).subscribe((res: any) => {
      if (res && res.authToken){
        this.authService.setToken(res.token);
        this.authService.setLoggedInUser(res.user);
        this.router.navigate(['/dashboard'], {
        });
      }
    });
  }

  googleSignup(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res: any) => {
      if(res){
        console.log('40 res: ', res);
      }
    }).catch((err) => {
      console.log('error: ', err);
    });
  }

  facebookSignup(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((res: any) => {
      if(res){
        console.log('50 res: ', res);
      }
    }).catch((err) => {
      console.log('error: ', err);
    });
  }

}

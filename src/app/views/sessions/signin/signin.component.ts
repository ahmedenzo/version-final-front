import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';

// ... [imports]

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  isTwoFactorAuthRequired = false; // Determine if 2FA code is needed
  signinForm: UntypedFormGroup;
  errorMsg = '';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private jwtAuth: JwtAuthService,
    private egretLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signinForm = new UntypedFormGroup({
      username: new UntypedFormControl( '', Validators.required),
      password: new UntypedFormControl( '', Validators.required),
      qrcode : new UntypedFormControl('', Validators.pattern(/^\d+$/)), // Only a pattern validator
      rememberMe: new UntypedFormControl(true)
    });
}

    
  ngAfterViewInit() {
    this.autoSignIn();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(1);
    this._unsubscribeAll.complete();
  }

  signin() {
    const signinData = this.signinForm.value;
  
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
  
    this.jwtAuth.signin(signinData.username, signinData.password)
      .subscribe(
        (response: any) => {
          const roles = this.jwtAuth.roles;
          localStorage.setItem('roles', JSON.stringify(roles))
          console.log(this.jwtAuth.getUser());
          this.router.navigateByUrl('profile/settings');
        },
        (error: any) => {
          alert(error.error.message);
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';
        }
      );
    console.log(this.signinForm.value);
  }
  
  autoSignIn() {    
    if(this.jwtAuth.return === '/') {
      return
    }
    this.egretLoader.open(`Automatically Signing you in! \n Return url: ${this.jwtAuth.return.substring(0, 20)}...`, {width: '320px'});
    setTimeout(() => {
      this.signin();
      console.log('autoSignIn');
      this.egretLoader.close()
    }, 2000);
  }

}

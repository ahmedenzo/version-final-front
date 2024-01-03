import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  passwordResetToken: string;
  resetPasswordForm: FormGroup;
  successMessage: string;
  errorResponseMessage: string;
  isEmailSent = false;


  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  forgotPasswordForm: FormGroup;

  constructor(
    private jwtAuthService: JwtAuthService,
    private formBuilder: FormBuilder,
    private router: Router,

    
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });


  }

  ngOnInit(): void {
 
  }



  submitEmail() {
    const email = this.forgotPasswordForm.get('email').value;

    this.jwtAuthService.forgotPassword(email).subscribe(
      (response: any) => {
        this.successMessage = response.message;
        this.isEmailSent = true;
        this.router.navigateByUrl('sessions/signin');
      },
      (error: any) => {
        this.submitButton.disabled = false;
        this.progressBar.mode = 'indeterminate';
        this.errorResponseMessage = error.error.message || 'An error occurred. Please try again.';
      }
    ); 

    this.submitButton.disabled = true;
    this.progressBar.mode = 'determinate';
  }

 
}

import { Component, Input, OnInit } from '@angular/core';
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileComponent } from '../profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  @Input('appPasswordStrength') appPasswordStrength: boolean;
  username: any;
  email: any;
  id: number;
userr: any;
  roles: string[] = [];
  profileForm: FormGroup;
  passwordChangeForm: FormGroup;
  submitted: boolean = false;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  passwordChanged: boolean = false;
  constructor(private JwtAuthService: JwtAuthService, private formBuilder: FormBuilder, private ProfileComponent: ProfileComponent, private snackBar: MatSnackBar) { }

  ngOnInit() {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles=this.JwtAuthService.roles;
      this.roles = JSON.parse(storedRoles);
    } else {
      // Set roles from JWT Auth service
      this.roles = this.JwtAuthService.roles;
      // Store roles in Local Storage
      localStorage.setItem('roles', JSON.stringify(this.roles));
    }
    this.username =this.JwtAuthService.getUser()


    
    this.profileForm = this.formBuilder.group({
    
  
      username: [{value: this.username, disabled: true}, Validators.required],
      email: [{ value: '', disabled: true }],

      });
      this.getuser();

      this.passwordChangeForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      }, {
        validators: this.passwordsMatchValidator
      
      });
    
      
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (newPassword === confirmPassword) {
      return null; // Passwords match
    } else {
      return { passwordsMismatch: true }; // Passwords do not match
    }
  }



  
  



  
 

  getuser(){
    this.JwtAuthService.getUserByUsername(this.username).subscribe(
      user => {
        this.userr = user;
        this.email = user.email;
        this.id=user.id
      console.log(this.email)
        this.profileForm.patchValue({
          email: this.email
        });
      },
      error => {
        console.error(error);
      }
    );
  }


  changePassword() {
    if (this.passwordChangeForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.passwordChangeForm.value;
      this.JwtAuthService.changePassword(oldPassword, newPassword, confirmPassword)
        .subscribe(
          response => {
            console.log('Password changed successfully:', response);
            this.passwordChanged = true; // Set passwordChanged to true after successful password change
            this.resetForm(); // Reset the form
            this.openSnackBar('Password changed successfully');
          },
          error => {
            if (error === 'Old password is incorrect') {
              this.openSnackBar('Old password is incorrect');
            } else {
              console.error('Error changing password:', error);
              this.openSnackBar('Old password is incorrect'); // Display a generic error message for other errors
            }
          }
        );
    }
  }

  resetForm() {
    this.passwordChangeForm.reset(); // Reset the form
    Object.keys(this.passwordChangeForm.controls).forEach(key => {
      this.passwordChangeForm.controls[key].setErrors(null); // Reset the validity status of each form control
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
    });
  }
}

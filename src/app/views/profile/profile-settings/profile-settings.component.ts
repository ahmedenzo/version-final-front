import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProfileComponent } from '../profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  @Input('appPasswordStrength') appPasswordStrength: boolean;
  public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  public hasBaseDropZoneOver: boolean = false;
  private selectedFile: File | null = null;
  public uploadProgress: number | null = null;
  username :any
  email:any;
  data:any;
  id:number
  roles: string[] = [];
  profileForm: FormGroup;
  passwordChangeForm : FormGroup;
  userr: any;
  userData: any;
  submitted: boolean = false;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
 
  constructor(private JwtAuthService :JwtAuthService,private formBuilder: FormBuilder,private ProfileComponent:ProfileComponent,private snackBar:MatSnackBar) { }

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
      fullname: ['',],
      phone: ['',],
      username: [{value: this.username, disabled: true}, Validators.required],
      email: [{ value: '', disabled: true }],
      adresse: ['', ],
      website: ['',]
      });
      this.getuser();

      this.passwordChangeForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
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


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.appPasswordStrength) {
      return null; // Don't perform the check if the directive is not enabled
    }
  
    const password = control.value;
    const hasAlphabet = /[a-zA-Z]/.test(password); // Check for at least one alphabet character
    const hasDigit = /\d/.test(password); // Check for at least one digit
    const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password); // Check for at least one special character
  
    if (!hasAlphabet || !hasDigit || !hasSymbol) {
      return { weakPassword: true };
    }
  
    return null;
  }
  
  

  // ... other methods for changePassword and forgotPassword


  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
  console.log(user.email)
  this.uploadImage()
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
            this.passwordChangeForm.reset();
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
  
  
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
    });
  }


  uploadImage() {
    if (!this.selectedFile) {
      return;
    }

    this.JwtAuthService.uploadImage(this.id, this.selectedFile).subscribe(
      (progress) => {
        this.uploadProgress = progress;

        // Set imageUrl in ProfileComponent once upload is complete
        if (this.uploadProgress === 100) {
          this.ProfileComponent.getimage();
      
        }
      },
      (error) => {
        console.error(error);
      }
    );
   
  }

  onSubmit(): void {
 const formValues = this.profileForm.value;
    formValues.username = this.profileForm.get('username').value;
    
      this.JwtAuthService.completeProfile(formValues)
      .subscribe(response => {
        alert(response.message);
        console.log(response.message);
        this.userData = this.profileForm.value;

        this.profileForm.disable();
        this.submitted = true;
        this.ProfileComponent.getuserinformation();
      }, error => {
        console.log(error.message);
      });
  }
  onUpdate(): void {
    this.profileForm.enable();
    this.submitted = false;
  }
  forgotPassword() {
   


  }
  }

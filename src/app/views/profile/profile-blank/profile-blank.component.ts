import { Component, OnInit ,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { Erole, } from 'app/shared/models/user.model';
@Component({
  selector: 'app-profile-blank',
  templateUrl: './profile-blank.component.html',
  styleUrls: ['./profile-blank.component.css']
})
export class ProfileBlankComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ProfileBlankComponent>,
  private fb: FormBuilder,
  public jwtAuth: JwtAuthService,) { }
  roles: Erole[];
  ngOnInit() {
    this.buildItemForm(this.data.payload)
    this.jwtAuth.getAllRoles().subscribe((roles) => {
      this.roles = roles;
      console.log("test Roles")
      console.log(this.roles)
    });
  }
  buildItemForm(item){
    this.itemForm = this.fb.group({
      Role : [item.role|| '', Validators.required],
    
    });

  }
  submit() {
    const selectedRole = this.itemForm.get('Role').value;
    const roleName = selectedRole
    console.log(roleName)
    this.dialogRef.close(roleName);

  }
  
  
}

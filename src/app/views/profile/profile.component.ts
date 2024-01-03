import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { User } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { ImageService } from "app/shared/services/ImageService"; 




@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  activeView: string = "overview";
  userr:any
  user: Observable<User>;
  username :any
  id:number
  email:any
  phone:any
  bankname:any
  roles: string[] = [];
  imageUrl: any;
  fullname:any

  limitedAccessPermissions: { [key: string]: string[] } = {
    'Simple_User': ['Add Card', 'Confirmed Card'],
   
  };

  constructor(private router: ActivatedRoute, public jwtAuth: JwtAuthService,private imageService: ImageService) {this.roles = []}


  ngOnInit() {
   
    // Check if roles exist in Local Storage
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles=this.jwtAuth.roles;
      this.roles = JSON.parse(storedRoles);
    } else {
      // Set roles from JWT Auth service
      this.roles = this.jwtAuth.roles;
      // Store roles in Local Storage
      localStorage.setItem('roles', JSON.stringify(this.roles));
    }
  
    this.user = this.jwtAuth.user$;
    this.username = this.jwtAuth.getUser();
    console.log(this.username)
    console.log(this.roles)

    
    this.getuserinformation();
    console.log("user",this.getuserinformation())
    console.log(this.imageUrl)
  }
  



  getuserinformation(){
    this.jwtAuth.getUserByUsername(this.username).subscribe(
      user => {
        this.userr = user;
        this.email = user.email;
        this.phone=user.phone
        this.id=user.id
        this.fullname=user.fullname

        this.getimage();
      },
      error => {
        console.error(error);
      }
    );
  }

  getimage(){

    this.jwtAuth.getImage(this.id).subscribe(
      (data) => {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onloadend = () => {
          this.imageUrl = reader.result;
          this.imageService.setImage(this.imageUrl);
       
        };
      },
      (error) => {
        console.log(error);
      }
    );
  }
  }





import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent {

  
  token:string="";
  
  isAdmin:boolean=false;
  
userRole:string='';


 
constructor( private authService:AuthService){  
}
setUserDetails(token: string): void {
  this.authService.setUserRole(token); 
  this.isAdmin = this.authService.isAdmin();
  this.userRole = this.authService.getUserRole();
  
}


}

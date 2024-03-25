import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Token } from '@angular/compiler';
import { AppointmentsService } from '../../appointments.service';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  userRole!:string;
  isDoctor:boolean=false;
  isPatient:boolean=false;  
  isAdmin:boolean=false;

  constructor(private authService: AuthService,
  public appointments:AppointmentsService) {
    
  }
  checkUserRole(){
    this.isDoctor=this.userRole === 'doctor';
    this.isPatient=this.userRole === 'patient';
    this.isAdmin=this.userRole === 'admin';
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.checkUserRole();
    this.getToTal();
    console.log("aaaaaba?");   
    
  }

  getToTal():number{
    if(this.isDoctor){
      return this.appointments.getAppointmentsByDoctor.length;
  }
    if(this.isPatient){
      return this.appointments.getAppointmentsByPatient.length;
    }
    return 0;
  }

}

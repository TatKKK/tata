import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Token } from '@angular/compiler';
import { AppointmentsService } from '../../services/appointments.service';




@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  userId: number | null = null;
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
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole();
    this.checkUserRole();
    this.getToTal();
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

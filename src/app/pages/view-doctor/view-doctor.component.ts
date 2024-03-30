import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../models/doctor.model';
import { ChangeDetectorRef } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../models/appointment.model';
import { Day } from '../../models/appointment.model';

@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit {  
  token:string="";  
  isAdmin:boolean=false;  
  userRole:string='';
  userId!:number;

 

  doctorId: number | null = null;

  doctor!: Doctor;
  appointments:Appointment[]=[];
  appointment!:Appointment;
  Id:number | null | undefined;

  
constructor( private authService:AuthService,
  private route:ActivatedRoute,
  private doctorsService:DoctorsService,
  private changeDetectorRef: ChangeDetectorRef,
  public appointmentsService:AppointmentsService){  
}
setUserDetails(token: string): void {
  this.authService.setUserRole(token); 
  this.isAdmin = this.authService.isAdmin();
  this.userRole = this.authService.getUserRole();  
}

ngOnInit(): void {
  
  this.Id=this.authService.getUserId();
  this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.doctorId = +id;
      this.fetchDoctorAndAppointments(this.doctorId);
    } else {
      console.log('No doctor ID provided in the route');
    }
  });
}

private fetchDoctorAndAppointments(doctorId: number): void {
  this.doctorsService.getDoctor(doctorId).subscribe({
    next: (doctor) => {
      this.doctor = doctor;
      this.changeDetectorRef.detectChanges();
      if (doctor?.Id) {
        this.appointmentsService.getAppointmentsByDoctor(doctor.Id).subscribe({
          next: (appointments) => {
            this.appointments = appointments;
          },
          error: (err) => console.error('Error fetching appointments', err),
        });
      }
    },
    error: (err) => console.error('Failed to fetch doctor', err),
  });
}
}




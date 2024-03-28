import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../services/doctors.service';
import { Doctor } from '../../models/doctor.model';
import { ChangeDetectorRef } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';

@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit {  
  token:string="";  
  isAdmin:boolean=false;  
  userRole:string='';

  doctorId: number | null = null;

  doctor!: Doctor;

 
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
  this.route.params.subscribe(params => {
    const id=params['id'];
    if(id){
      this.doctorId=+id;    
      this.doctorsService.getDoctor(this.doctorId).subscribe({
        next: (doctor) => {
          this.doctor = doctor;
          this.changeDetectorRef.detectChanges();
          console.log(doctor);
          if (doctor && doctor.Id !== undefined && doctor.Id !== null) {
            this.appointmentsService.setCurrentDoctorId(doctor.Id);
          }
        },
        error: (err) => {
          console.error('Failed to fetch doctor', err);
        },
        complete: () => {
          console.log('Fetch doctor call completed');
        }
      });
    } else {
      console.log('No doctor ID provided in the route');
    }
  });
}



}



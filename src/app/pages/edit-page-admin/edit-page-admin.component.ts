import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { DoctorsService } from '../../services/doctors.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
@Component({
  selector: 'app-edit-page-admin',
  templateUrl: './edit-page-admin.component.html',
  styleUrls: ['./edit-page-admin.component.css', 
  '../../components/admin-header/admin-header.component.css']
})
export class EditPageAdminComponent implements OnInit {
  doctorId: number | null = null;

  doctor!: Doctor;

  constructor(private doctorsService: DoctorsService,
    private router:Router,
    private route: ActivatedRoute,
    private auth:AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    public appointmentsService:AppointmentsService) {}

  ngOnInit() {
    if((!this.auth.authenticate) || this.auth.getUserRole() !== 'admin') {
      alert('Not Authorized');
      this.router.navigate(['/']); 
      return;
    }

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

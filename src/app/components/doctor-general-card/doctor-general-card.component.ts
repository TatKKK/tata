import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../doctors.service';
import { ChangeDetectorRef } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { AppointmentsService } from '../../appointments.service';

@Component({
  selector: 'app-doctor-general-card',
  templateUrl: './doctor-general-card.component.html',
  styleUrl: './doctor-general-card.component.css'
})
export class DoctorGeneralCardComponent {

  doctor!:Doctor;

  constructor(
    private route: ActivatedRoute,
    public doctorsService:DoctorsService,
    public appointmentsService:AppointmentsService,
    private changeDetectorRef:ChangeDetectorRef
  ){}

  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.doctorsService.getDoctor(id).subscribe({
          next: (doctor) => {
            this.doctor = doctor;
            if (doctor && doctor.Id !== undefined && doctor.Id !== null) {
              this.appointmentsService.setCurrentDoctorId(doctor.Id);
            } else {
              console.error('Doctor ID is undefined or null');
            }
            this.changeDetectorRef.detectChanges(); 
            console.log(doctor); 
          },
          error: (err) => {
            console.error('Failed to fetch', err);
          },
          complete: () => {
            console.log('Fetch call completed');
          }
        });        
      }
    });
  }
  
  getStars(score: number | undefined) {
      const validScore = score ?? 1;
      return new Array(5).fill(false).map((_, index) => index < validScore);
    
  }
}



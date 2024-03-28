import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientsService } from '../../services/patients.service';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../services/appointments.service';

import { AuthService } from '../../services/auth/auth.service';



@Component({
  selector: 'app-patient-info-card',
  templateUrl: './patient-info-card.component.html',
  styleUrl: './patient-info-card.component.css'
})
export class PatientInfoCardComponent implements OnInit { 
  // @Input() userId: number | null = null;
  @Input() patient!:Patient;
  
  // patient: User = new User(null);
  // patient!:Patient;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientsService: PatientsService,
    private appointmentsService: AppointmentsService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ){}

  ngOnInit(): void {    
    if((!this.authService.authenticate) || this.authService.getUserRole() !== 'patient') {
      alert('Not Authorized');
      this.router.navigate(['/']); 
      return;
    }

    this.route.params.subscribe(params=>{
      const Email=params['Email'];
      if(Email){
        this.patientsService.getPatientByEmail(Email).subscribe({
          next:(patient)=>{
            this.patient=patient;
            this.changeDetectorRef.detectChanges(); 
            console.log(patient.Email);
            console.log(patient.Id)
            if (patient && patient.Id !== undefined && patient.Id !== null) {
              this.appointmentsService.setCurrentPatientId(patient.Id);
            }
          },
          error:(err)=>{
            console.error('failed to fetch patient',err);
          },
          complete:()=>{
            console.log("Fetch patient call completed");
          }
        });
      }
      else{
        console.log("no id/email");
      }
    });    
  }
  
getToTal():number{
  return this.appointmentsService.getAppointmentsByPatient.length;
}

}



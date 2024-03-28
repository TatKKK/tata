import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Doctor } from '../../models/doctor.model';
import { Appointment } from '../../models/appointment.model';
import { DoctorsService } from '../../services/doctors.service';
import { AppointmentsService } from '../../services/appointments.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { DialogEventsService } from '../../services/dialog-events.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs';

@Component({
  selector: 'app-view-doctor-dialog',
  templateUrl: './view-doctor-dialog.component.html',
  styleUrl: './view-doctor-dialog.component.css'
})
export class ViewDoctorDialogComponent implements OnInit {
  // constructor(@Inject(MAT_DIALOG_DATA) public data: { doctor:Doctor, appointments: Appointment[] }) { }
  doctor!:Doctor;
  userRole:string="";
  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public doctorsService: DoctorsService,
    public appointmentsService: AppointmentsService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private dialogEventsService: DialogEventsService,
    private dialogRef: MatDialogRef<ViewDoctorDialogComponent>,
  ) { }

  ngOnInit(): void {
    const closeSub = this.dialogEventsService.closeDialogs$.subscribe(shouldClose => {
      if (shouldClose) {
        this.dialogRef.close();
      }
    });

    this.subscriptions.add(closeSub);
    this.userRole = this.authService.getUserRole();
    
    console.log('Received data in dialog:', this.data.id);

    this.doctorsService.getDoctor(this.data.id).subscribe({
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

  ngOnDestroy():void{
    this.subscriptions.unsubscribe();
  }

 
}

import { Component, Input } from '@angular/core';
import { DoctorsService } from '../../doctors.service';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../../models/doctor.model';
import { AppointmentsService } from '../../appointments.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-admin',
  templateUrl: './doctor-admin.component.html',
  styleUrl: './doctor-admin.component.css'
})
export class DoctorAdminComponent {
  @Input() doctor!: Doctor;

  constructor(
    private auth:AuthService,
    private route: ActivatedRoute,
    private router:Router,
    private doctorsService: DoctorsService,
    public appointmentsService: AppointmentsService,
    private changeDetectorRef: ChangeDetectorRef,
    
  ){}

  ngOnInit(): void {
    if((!this.auth.authenticate) || this.auth.getUserRole() !== 'admin') {
      alert('Not Authorized');
      this.router.navigate(['/login']); 
      return;
    }

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.doctorsService.getDoctor(id).subscribe({
          next: (doctor) => {
            this.doctor = doctor;
            this.changeDetectorRef.detectChanges(); 
            console.log(doctor);
            if (doctor && doctor.Id !== undefined && doctor.Id !== null) {
              this.appointmentsService.setCurrentDoctorId(doctor.Id);
            }
          },
          error: (err) => console.error('Failed to fetch', err),
          complete: () => console.log('Fetch  call completed')
        });
      }
    });
  }

  getStars(score: number | undefined) {
    const validScore = score ?? 1;
    return new Array(5).fill(false).map((_, index) => index < validScore);
  }
  getTotal():number{
    return this.appointmentsService.getAppointmentsByDoctor.length;
  }

  deleteDoctor(doctor:Doctor):void{
    this.doctorsService.deleteDoctor(doctor).subscribe({
      next:()=>{
        this.doctorsService.doctors=this.doctorsService.doctors.filter(doc=>doc.id!==doctor.Id);
        this.doctorsService.refreshDoctors();
      },
      error:(error)=>{
        console.error('Error deleting doctor:', error);
      }
    })
  }

}

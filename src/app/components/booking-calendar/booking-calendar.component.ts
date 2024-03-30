import { Component,  OnInit, Input, OnDestroy } from '@angular/core';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { GologComponent } from '../../dialogs/golog/golog.component';
import { MatDialogComponent } from '../../dialogs/mat-dialog/mat-dialog.component';
import { AuthService } from '../../services/auth/auth.service';
import { Appointment } from '../../models/appointment.model';
import { AppointmentsService } from '../../services/appointments.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentBookingDialogComponent } from '../appointment-booking-dialog/appointment-booking-dialog.component';

import { Day } from '../../models/appointment.model';

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.css'
})
export class BookingCalendarComponent implements OnInit, OnDestroy{
  //icons  
  left=faAngleLeft;
  right=faAngleRight;

//jer iyos
  private destroy$ = new Subject<void>();

//Parentisgan shemosulebi  
  @Input() doctorId!: number;
  @Input() userId!:number
 
  @Input() appointments: Appointment[] = [];
  @Input() appointment!:Appointment;

  //logged in user id
  @Input() id!:number;
  
  days: Day[] = [];
  workingHours = Array.from({length: 9}, (_, i) => 9+i); // 9-17
  currentWeekStart: Date = new Date();
  currentDate:Date=new Date();

//Id kidev bevria..
// Id=this.authService.getUserId();

//yoveli shemtxvevistvis 
userRole!:string;
isDoctor:boolean=false;
isPatient:boolean=false;  
isAdmin:boolean=false;
isLoggedIn:boolean=false;
isDayOff!:boolean;

//dasvenebis dgebi..
predefinedDayOffs:Date[]=[
  new Date(2024, 3, 28),
  new Date(2024, 3, 29),
  new Date(2024, 4, 3),
]

checkUserRole(){
  this.isDoctor=this.userRole === 'doctor';
  this.isPatient=this.userRole === 'patient';
  this.isAdmin=this.userRole === 'admin';
}


  ngOnInit() {
  
    this.userRole = this.authService.getUserRole();   
    this.checkUserRole();
    this.isLoggedIn = this.authService.isLoggedInSync();
    this.appointments;
    console.log('Received appointments:', this.appointments);
 
    this.initializeDays();   
    this.goToCurrentWeek();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
constructor(
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private authService: AuthService,
  public appointmentService: AppointmentsService){
}
 
//kvira
  goToCurrentWeek() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); //კვირა
    this.currentWeekStart = new Date(date.setDate(diff));
    this.currentWeekStart.setHours(0, 0, 0, 0);
    this.initializeDays();
  }

  goToNextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 1);
    this.currentDate=new Date(this.currentWeekStart);
    this.initializeDays();
  }

  goToPreviousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 1);
    this.currentDate=new Date(this.currentWeekStart);
    this.initializeDays();
  }

goToNextMonth(){
  this.currentWeekStart.setMonth(this.currentWeekStart.getMonth()+1);
  this.currentWeekStart.setDate(1);
  this.currentDate=new Date(this.currentWeekStart);
  this.initializeDays();
}
goToPreviousMonth(){
  this.currentWeekStart.setMonth(this.currentWeekStart.getMonth()-1);
  this.currentWeekStart.setDate(1);
  this.currentDate=new Date(this.currentWeekStart);
  this.initializeDays();
}

initializeDays(): void {
  const startDate = new Date(this.currentWeekStart);
  startDate.setHours(0, 0, 0, 0);
  this.days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isDayOff = this.predefinedDayOffs.some(dayOff => dayOff.getTime() === date.getTime());
    const dayAppointments = this.appointments.filter(appointment => {
      const startTime = appointment.StartTime ? new Date(appointment.StartTime) : null;
      return startTime && startTime >= date && startTime < new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    });
    this.days.push({ date, appointments: dayAppointments, isWeekend, isDayOff });
  }
}

// //my bookings
isBookedByMe(day: Day, hour: number): boolean {
  return day.appointments.some(appointment => {
    const appointmentHour = appointment.StartTime?.getHours();
    const isSameHour = appointmentHour === hour;
    const isUserAppointment = appointment.PatientId === this.id; //logged in user tu eqimia da sxva eqimebs atvalierebs..
    return isSameHour && isUserAppointment;
  });
}

  isBookable(day: Day, hour: number): boolean {
    const isWeekend = day.isWeekend;
    const isBooked = day.appointments.some(appointment =>
      appointment.StartTime?.getHours() === hour && appointment.IsBooked
    );
    return !isWeekend && !isBooked;
  }
  

isAppointmentBooked(day: Day, hour: number): boolean {
  return day.appointments.some(appointment => 
    appointment.StartTime?.getHours() === hour && appointment.IsBooked
  );
}


getClassForSlot(day: Day, hour: number): string {
  if (this.isBookedByMe(day, hour)) {
    console.log("isBookedByMe");
    return 'my-booking'; 
  } else if (this.isAppointmentBooked(day, hour)) {
    console.log('booked');
    return 'booked'; 
  } else if (day.isWeekend) {
    return 'weekend'; 
  } else {
    return 'freeSlot'; 
  }
}


openDialogBasedOnAuth(day: Day, hour: number, event: MouseEvent) {
  event.preventDefault(); 
  if (this.authService.getToken()) {
    this.openBookingDialog(day, hour);
  } else {
    this.openLogDialog(event);
  }
}
  
  openLogDialog(event:MouseEvent):void{   
    event.preventDefault();
    
    const dialogRef=  this.dialog.open(GologComponent, {
      width:'30%'
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result === true){
      
      }
    })}
  
    openBookingDialog(day: Day, hour: number): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '50%';
    
      const dialogRef = this.dialog.open(AppointmentBookingDialogComponent, dialogConfig);
    
      dialogRef.afterClosed().subscribe(notes => {
        if (notes) {
          this.createAppointment(day, hour, notes);
        }
      });
    }
    
    createAppointment(day: Day, hour: number, notes: string): void {
      const startDate = new Date(day.date);
      startDate.setHours(hour, 0, 0, 0);
      // const endDate = new Date(startDate);
      // endDate.setHours(startDate.getHours() + 1); 
      const role=this.authService.getUserRole();
      const userId=this.authService.getUserId();
      let doctorId = null;
    let patientId = null;
    
    if (role === 'doctor') {
      doctorId = userId;
    } else if (role === 'patient') {
      patientId = userId;
    }else{
      patientId=161;
      doctorId=163;
    }
            
     const newAppointment={
      Id:0,
      DoctorId:doctorId,
      patientId:patientId,
      StartTime:startDate,
      Notes:notes,
      IsBooked: true
     }
        
     console.log(newAppointment +"new Appointment");

      this.appointmentService.createAppointment(newAppointment).subscribe({
        next: (appointment) => {
          console.log('Appointment booked successfully:', appointment);
          this.snackBar.open('Appointment booked successfully', 'Close', { duration: 5000 });
          this.refreshAppointments();
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.snackBar.open('Failed to book appointment', 'Close', { duration: 5000 });
        }
      });
    }

    

  
  onBookedSlotClick(day: Day, hour: number, event: MouseEvent): void {
    event.preventDefault();
    const appointmentId = this.getAppointmentId(day, hour);
    if (appointmentId) {
      const appointmentToDelete = day.appointments.find(a => a.id === appointmentId);
      if (appointmentToDelete) {
        this.deleteAppointment(appointmentToDelete);
      }
    } else {
      console.error('Appointment ID not found for the selected slot.');
    }
  }
  
  deleteAppointment(appointment: Appointment) {
    this.appointmentService.deleteAppointment(appointment).subscribe({
      next: () => {
        this.refreshAppointments();
      },
      error: (error) => {
        console.error('Failed to delete appointment:', error);
      }
    });
  }
  
  getAppointmentId(day: Day, hour: number): number | undefined {
    const appointment = day.appointments.find(a => 
      a.StartTime?.getHours() === hour && a.IsBooked);
    return appointment?.id;
  }
  

  refreshAppointments() {
    this.appointmentService.getAppointmentsByDoctor(this.doctorId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
      }
    });
  }
  // refreshAppointments() {
  //   this.appointmentService.getAppointmentsByDoctor(this.doctorId).subscribe({
  //     next: (appointments) => {
  //       this.appointments = appointments;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching appointments:', error);
  //     }
  //   });
  // }
  
}
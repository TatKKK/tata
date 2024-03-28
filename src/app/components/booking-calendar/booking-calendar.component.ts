import { Component, NgZoneOptions, OnInit, Input } from '@angular/core';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { GologComponent } from '../../dialogs/golog/golog.component';
import { MatDialogComponent } from '../../dialogs/mat-dialog/mat-dialog.component';
import { AuthService } from '../../services/auth/auth.service';
import { Appointment } from '../../models/appointment.model';
import { AppointmentsService } from '../../services/appointments.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


interface Day {
  date: Date;
  isWeekend:boolean;
  isDayOff:boolean;
  appointments:Appointment[];
  
}

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.css'
})
export class BookingCalendarComponent implements OnInit{
  left=faAngleLeft;
  right=faAngleRight;

  @Input() doctorId!: number;

//gavigo vinaa
userId=this.authService.getUserId();

userRole!:string;
isDoctor:boolean=false;
isPatient:boolean=false;  
isAdmin:boolean=false;
isLoggedIn:boolean=false;

checkUserRole(){
  this.isDoctor=this.userRole === 'doctor';
  this.isPatient=this.userRole === 'patient';
  this.isAdmin=this.userRole === 'admin';
}

  days: Day[] = [];
  appointments:Appointment[]=[];
  appointment!:Appointment;

  workingHours = Array.from({length: 9}, (_, i) => 9+i); // 9-17

  currentWeekStart: Date = new Date();
  currentDate:Date=new Date();
  isBookable(day: Day, hour: number): boolean {
    const isWeekend = day.isWeekend;
    const isBooked = day.appointments.some(appointment =>
      appointment.StartTime?.getHours() === hour && appointment.IsBooked
    );
    return !isWeekend && !isBooked;
  }
  
  isDayOff!:boolean;

  predefinedDayOffs:Date[]=[
    new Date(2024, 3, 28),
    new Date(2024, 3, 29),
    new Date(2024, 4, 3),
  ]

  ngOnInit() {
    this.userRole = this.authService.getUserRole();   
    this.checkUserRole();
    this.isLoggedIn = this.authService.isLoggedInSync();
    
    this.appointmentService.currentDoctorId$.subscribe((doctorId) => {
      if (doctorId) {
        this.appointmentService.getAppointmentsByDoctor(doctorId).subscribe({
          next: (appointments: Appointment[]) => {
            this.appointments = appointments;
            this.initializeDays();            
            // this.authService.isLoggedIn;
          },
          error: (err) => console.error('Error fetching appointments', err)
        });
      }
    });
    this.goToCurrentWeek();
    this.initializeDays();
   
  }
constructor(
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private authService: AuthService,
  public appointmentService: AppointmentsService){
}
  /*| ---  avtorizebulia tu ara  */
  



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


isAppointmentBooked(day: Day, hour: number): boolean {
  return day.appointments.some(appointment => 
    appointment.StartTime?.getHours() === hour && appointment.IsBooked
  );
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
      width:'25%'
    });
    // dialogRef.afterClosed().subscribe(result=>{
    //   if(result === true){
      
    //   }
    // })
  }

  openBookingDialog(day:Day, hour:number):void{
   
    const dialogConfig= new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = {
      day: day,
      hour: hour
    };
    const dialogRef = this.dialog.open(MatDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
       this.initializeDays();

       this.snackBar.open(`Appointment successfully booked for ${day.date.toDateString()} at ${hour}:00.`, 'Close', {
        duration: 5000,
      });
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
  
}
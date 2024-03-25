import { Component, NgZoneOptions, OnInit } from '@angular/core';
import { CalendarDay, CalendarEvent } from '../../models/calendar.model';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { GologComponent } from '../../dialogs/golog/golog.component';
import { MatDialogComponent } from '../../dialogs/mat-dialog/mat-dialog.component';
import { AuthService } from '../../auth.service';

import { AppointmentsService } from '../../appointments.service';
// import { Appointment } from '../../models/appointment.model';


interface Appointment {
  startTime: Date;
  endTime: Date;
}

interface Day {
  date: Date;
  appointments: Appointment[];
  isWeekend:boolean;
  isDayOff:boolean;
}

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.css'
})
export class BookingCalendarComponent implements OnInit{
  userRole!:string;
  isDoctor:boolean=false;
  isPatient:boolean=false;  
  checkUserRole(){
    this.isDoctor=this.userRole === 'doctor';
    this.isPatient=this.userRole === 'patient';
  }

  left=faAngleLeft;
  right=faAngleRight;
  days: Day[] = [];
  workingHours = Array.from({length: 9}, (_, i) => 9+i); // 9-17

  currentWeekStart: Date = new Date();
  currentDate:Date=new Date();

  isBookable(day: Day, hour: number): boolean {
    const isWeekend = day.isWeekend;
    const isBooked = this.isBooked(day, hour);
    return !isWeekend && !isBooked;
  }
  isDayOff!:boolean;

  predefinedDayOffs:Date[]=[
    new Date(2024, 3, 9),
    new Date(2024, 4, 9),
  ]

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.checkUserRole();
    this.goToCurrentWeek();
    this.initializeDays();
    this.generateRandomBookings();
  }
constructor(public dialog:MatDialog,
  private authService: AuthService){

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
    this.generateRandomBookings(); 
  }

  goToPreviousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 1);
    this.currentDate=new Date(this.currentWeekStart);
    this.initializeDays();
    this.generateRandomBookings(); 
  }
//tve
goToNextMonth(){
  this.currentWeekStart.setMonth(this.currentWeekStart.getMonth()+1);
  this.currentWeekStart.setDate(1);
  this.currentDate=new Date(this.currentWeekStart);
  // this.adjustWeekStart();
  this.initializeDays();
  this.generateRandomBookings();
}
goToPreviousMonth(){
  this.currentWeekStart.setMonth(this.currentWeekStart.getMonth()-1);
  this.currentWeekStart.setDate(1);
  this.currentDate=new Date(this.currentWeekStart);
  // this.adjustWeekStart();
  this.initializeDays();
  this.generateRandomBookings();
}

initializeDays() {
  const startDate = new Date(this.currentWeekStart);
  startDate.setHours(0, 0, 0, 0);
  
  this.days = [];
  for (let i = 0; i < 7; i++) { 
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isDayOff = this.predefinedDayOffs.some(
      dayOff => dayOff.getTime() === date.getTime()
    );
    this.days.push({ date, appointments: [], isWeekend, isDayOff });
  }
}


  generateRandomBookings() {
    this.days.forEach(day => {
      for (let hour = 9; hour < 17; hour++) { 
        if (Math.random() > 0.7) { 
          const startTime = new Date(day.date);
          startTime.setHours(hour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + 1);
          day.appointments.push({ startTime, endTime });
        }
      }
    });
  }

  isBooked(day: Day, hour: number): boolean {
    return day.appointments.some((appointment: { startTime: { getHours: () => number; }; }) =>
      appointment.startTime.getHours() === hour);
  }
  
  openLogDialog(event:MouseEvent):void{
    event.preventDefault();
    const dialogRef=  this.dialog.open(GologComponent, {
      width:'25%'
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result === true){
      
      }
    })
  }


  

}
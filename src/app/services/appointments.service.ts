import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Appointment } from '../models/appointment.model'
import { Observable, BehaviorSubject, catchError, of } from 'rxjs'
import { map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
public appointments:Appointment[]=[];
  constructor(private http:HttpClient,
              private authService:AuthService){

  }
  private currentDoctorId = new BehaviorSubject<number | null>(null)
  currentDoctorId$ = this.currentDoctorId.asObservable()

  setCurrentDoctorId (doctorId: number): void {
    this.currentDoctorId.next(doctorId)
  }

  private currentPatientId = new BehaviorSubject<number | null>(null)
  currentPatientId$ = this.currentPatientId.asObservable()

  setCurrentPatientId (patientId: number): void {
    this.currentPatientId.next(patientId)
  }

  private apiUrl = "https://localhost:7042/api/Appointments";

  createAppointment(appointment: Appointment): Observable<Appointment> {
    //gavigo vinaa
    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();

    if (role === 'doctor') {
      appointment.DoctorId = userId;
      console.log(appointment.DoctorId);
    } else if (role === 'patient') {
      appointment.PatientId = userId;
      console.log(appointment.PatientId);
    } else {
      appointment.DoctorId=85;
      appointment.PatientId=182;
    }

    let token=this.authService.getToken();    
      if(!this.authService.getToken()){
        alert('No Token');
      }
      let httpOptions={
        headers:new HttpHeaders({
          'Authorization':`Bearer ${token}`
        })
      };

    return this.http.post<Appointment>(`${this.apiUrl}/create`, appointment, httpOptions);
  }

  updateAppointmentStatus(appointment: Appointment, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, appointment);
  }

  deleteAppointment(appointment:Appointment): Observable<any> {
    let token = this.authService.getToken();
    if(!this.authService.getToken()){
      alert('No Token');
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
    return this.http.delete(`${this.apiUrl}/delte/${appointment.id}`, httpOptions);
  }

  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7042/api/Appointments/doctor/${doctorId}`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime + 'Z');
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime + 'Z');
        }
        return a;
      }))
    );
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7042/api/Appointments/patient/${patientId}`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime);
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime);
        }
        return a;
      }))
    );
  }
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Get_Appointments`).pipe(
      map(appointments => appointments.map(a => {
        if (a.StartTime) {
          a.StartTime = new Date(a.StartTime);
        }
        if (a.EndTime) {
          a.EndTime = new Date(a.EndTime);
        }
        return a;
      }))
    );
  }
  getCurrentDoctorId(): number | null {
    return this.currentDoctorId.value;
  }
  
  getCurrentPatientId(): number | null {
    return this.currentPatientId.value;
  }
  
}

  // //DOCTORS
  // private currentDoctorId = new BehaviorSubject<number | null>(null)
  // currentDoctorId$ = this.currentDoctorId.asObservable()

  // setCurrentDoctorId (doctorId: number): void {
  //   this.currentDoctorId.next(doctorId)
  // }

  // getAppointmentsByDoctor (doctorId: number): Observable<Appointment[]> {
  //   let httpOptions={
  //     headers:new HttpHeaders({
  //       "Content-Type":"application/json"
  //     })
  //   };
  //   return this.http.get<Appointment[]>(
  //     `https://localhost:7042/api/Appointments/appointments/doctor/${doctorId}`, httpOptions
  //   )
  //   .pipe(
  //     catchError(this.handleError<Appointment[]>('getAppointmentsByDoctor'))
  //   );
    
  // }

  // createAppointment (appointment: Appointment): Observable<Appointment> {
  //   return this.http.post<Appointment>(
  //     'https://localhost:7042/api/Appointments',
  //     appointment
  //   )
  // }

  // //Patients
  // private currentPatientId = new BehaviorSubject<number | null>(null)
  // currentPatientId$ = this.currentPatientId.asObservable()

  // setCurrentPatientId (patientId: number): void {
  //   this.currentDoctorId.next(patientId)
  // }
  // getAppointmentsByPatient (patientId: number): Observable<Appointment[]> {
  //   let httpOptions={
  //     headers:new HttpHeaders({
  //       "Content-Type":"application/json"
  //     })     
  //   }
  //   return this.http.get<Appointment[]>(
  //     `https://localhost:7042/api/Appointments/appointments/patient/${patientId}`, httpOptions
  //   ) 
  //   .pipe(
  //     catchError(this.handleError<Appointment[]>('getAppointmentsByPatient'))
  //   );
  // }


  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error(error);
  
  //     this.log(`${operation} failed: ${error.message}`);
  //     return of(result as T);
  //   };
  // }
  
  // private log(message: string) {
  //   console.log(message);
  // }
  
  
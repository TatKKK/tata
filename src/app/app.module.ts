import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CalendarCommonModule } from 'angular-calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import '@angular/common/locales/global/ka';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdduserComponent } from './pages/adduser/adduser.component';
import { LoginComponent } from './components/login/login.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogComponent } from './dialogs/mat-dialog/mat-dialog.component';
import { DoctorCardsComponent } from './components/doctor-cards/doctor-cards.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GologComponent } from './dialogs/golog/golog.component';
import { DoctorCategoryListComponent } from './components/doctor-category-list/doctor-category-list.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { PatientInfoCardComponent } from './components/patient-info-card/patient-info-card.component';
import { DoctorInfoCardComponent } from './components/doctor-info-card/doctor-info-card.component';
import { ViewDoctorComponent } from './pages/view-doctor/view-doctor.component';
import { AddDoctorComponent } from './pages/add-doctor/add-doctor.component';
import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';
import { DoctorGeneralCardComponent } from './components/doctor-general-card/doctor-general-card.component';
import { Router, RouterModule } from '@angular/router';
import { DoctorAdminComponent } from './components/doctor-admin/doctor-admin.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegistrationSuccessComponent } from './dialogs/registration-success/registration-success.component';
import { ActivationCodeComponent } from './dialogs/activation-code/activation-code.component';
import { DoctorsListAdminComponent } from './pages/doctors-list-admin/doctors-list-admin.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatSliderModule } from '@angular/material/slider';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
   AdduserComponent,
   MatDialogComponent,
   DoctorCardsComponent,
   SidebarComponent,
   GologComponent,
   DoctorCategoryListComponent,
   AddPatientComponent,
   UserPageComponent,
   PatientInfoCardComponent,
   DoctorInfoCardComponent,
   LoginComponent,
   ViewDoctorComponent,
   AddDoctorComponent,
   BookingCalendarComponent,
   DoctorGeneralCardComponent,
   DoctorAdminComponent,
   RegistrationSuccessComponent,
   ActivationCodeComponent,
   DoctorsListAdminComponent,
   AdminHeaderComponent,  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CalendarCommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatDialogModule,
    FontAwesomeModule, 
    RouterModule,
    MatProgressSpinnerModule,
    NgxSliderModule,
    MatSliderModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ka-GE' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

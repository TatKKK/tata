import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { DoctorCategoryListComponent } from './components/doctor-category-list/doctor-category-list.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { DoctorInfoCardComponent } from './components/doctor-info-card/doctor-info-card.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AddDoctorComponent } from './pages/add-doctor/add-doctor.component';
import { DoctorAdminComponent } from './components/doctor-admin/doctor-admin.component';
import { ViewDoctorComponent } from './pages/view-doctor/view-doctor.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DoctorsListAdminComponent } from './pages/doctors-list-admin/doctors-list-admin.component';



const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'userPage/:id', component:UserPageComponent},
  {path:'doctor/:id', component:DoctorInfoCardComponent},
  {path:'addPatient', component:AddPatientComponent},
  {path:'addDoctor', component:AddDoctorComponent},
  {path:'login', component:LoginComponent},
  {path: 'doctors/:category', component:DoctorCategoryListComponent }, 
  {path:'doctor-admin/:id', component:DoctorAdminComponent},
  {path:'viewDoctor/:id', component:ViewDoctorComponent},
  {path:'sidebar', component:SidebarComponent},
  {path:'doctorsList', component:DoctorsListAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }

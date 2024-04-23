import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DoctorCategoryListComponent } from './components/doctor-category-list/doctor-category-list.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AddDoctorComponent } from './pages/add-doctor/add-doctor.component';
import { ViewDoctorComponent } from './pages/view-doctor/view-doctor.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DoctorsListAdminComponent } from './pages/doctors-list-admin/doctors-list-admin.component';
import { AuthGuardService as AuthGuard} from './services/auth/auth-guard.service';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { EditPageAdminComponent } from './pages/edit-page-admin/edit-page-admin.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AddAdminComponent } from './pages/add-admin/add-admin.component';
import { DoctorGeneralViewComponent } from './pages/doctor-general-view/doctor-general-view.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'userPage/:userId', component: UserPageComponent },
  {path:'addPatient', component:AddPatientComponent},
  {path:'addDoctor', component:AddDoctorComponent, canActivate: [AuthGuard]},
  {path:'addUser', component:AddAdminComponent},
  {path:'login', component:LoginComponent},
  {path: 'doctors/:category', component:DoctorCategoryListComponent }, 
  // {path:'editPage/:id', component:EditPageAdminComponent, canActivate: [AuthGuard]},
  {path:'editPage/:id', component:EditPageAdminComponent},
  {path:'viewDoctor/:id', component:ViewDoctorComponent},
  {path:'doctorGeneralView/:id', component:DoctorGeneralViewComponent},
  {path:'sidebar', component:SidebarComponent},
  {path:'doctorsList', component:DoctorsListAdminComponent},
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }

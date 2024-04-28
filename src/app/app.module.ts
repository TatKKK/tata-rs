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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DoctorCardsComponent } from './components/doctor-cards/doctor-cards.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DoctorCategoryListComponent } from './components/doctor-category-list/doctor-category-list.component';
import { AddPatientComponent } from './pages/add-patient/add-patient.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { ViewDoctorComponent } from './pages/view-doctor/view-doctor.component';
import { AddDoctorComponent } from './pages/add-doctor/add-doctor.component';
import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';
import { DoctorGeneralCardComponent } from './components/doctor-general-card/doctor-general-card.component';
import { Router, RouterModule } from '@angular/router';
import { DoctorAdminComponent } from './components/doctor-admin/doctor-admin.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorsListAdminComponent } from './pages/doctors-list-admin/doctors-list-admin.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { EditPageAdminComponent } from './pages/edit-page-admin/edit-page-admin.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from   '@angular/platform-browser/animations';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { LoginPromptComponent } from './components/login-prompt/login-prompt.component';
import { BookingDialogComponent } from './components/booking-dialog/booking-dialog.component';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';
import {ScrollPanel, ScrollPanelModule} from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DoctorGeneralViewComponent } from './pages/doctor-general-view/doctor-general-view.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { AddAdminComponent } from './pages/add-admin/add-admin.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainInterceptor } from './interceptors/main-interceptor';
import { DatesInterceptor } from './interceptors/dates-interceptor';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
   AdduserComponent,
     DoctorCardsComponent,
   DoctorGeneralViewComponent,
   DoctorCategoryListComponent,
   AddPatientComponent,
   UserPageComponent,
   LoginComponent,
   ViewDoctorComponent,
   AddDoctorComponent,
   BookingCalendarComponent,
   DoctorGeneralCardComponent,
   DoctorAdminComponent,
   DoctorsListAdminComponent,
   AdminHeaderComponent,
   PageNotFoundComponent,
   EditPageAdminComponent,
   UserInfoCardComponent,
   LoginPromptComponent,
   BookingDialogComponent,
   ResetPasswordComponent,
   ButtonsComponent,
   SidebarComponent,
   AddAdminComponent,
   AppointmentDetailsComponent 
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
    MatSnackBarModule,
    BrowserAnimationsModule ,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    DynamicDialogModule,
    DialogModule,
    ButtonModule,
    ScrollPanelModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ka-GE' },
  { provide: HTTP_INTERCEPTORS, useClass: MainInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DatesInterceptor, multi: true },
  DialogService, DynamicDialogRef, MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

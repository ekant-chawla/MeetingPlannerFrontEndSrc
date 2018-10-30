import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApiService } from './api.service';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { HelperService } from './helper.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminComponent } from './admin/admin.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HeaderComponent } from './header/header.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResetPasswordComponent,
    NotFoundComponent,
    AdminComponent,
    CalendarComponent,
    ForbiddenComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'admin', component: AdminComponent },
      { path: '403', component: ForbiddenComponent },
      { path: '404', component: NotFoundComponent },
      { path: '**', component: NotFoundComponent },
    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [ApiService, HelperService],
  bootstrap: [AppComponent],

})
export class AppModule { }

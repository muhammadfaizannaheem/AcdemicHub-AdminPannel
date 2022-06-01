import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';;
import { UniversitiesRecordComponent } from './universities-record/universities-record.component'
import { AgGridModule } from 'ag-grid-angular';;
import { CvRecordsComponent } from './cv-records/cv-records.component'
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NetworkInterceptor } from './network.interceptor';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        AgGridModule,
        ToastNotificationsModule.forRoot({duration: 6000, type: 'success',position :  'top-right'}),
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent
,
        UniversitiesRecordComponent ,
        CvRecordsComponent   ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true },

        // provider used to create fake backend
      //  fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import {UniversitiesRecordComponent} from './universities-record/universities-record.component';
import { CvRecordsComponent } from './cv-records/cv-records.component';
import { PageStatusComponent } from './page-status/page-status.component';
import { MyAccountComponent } from './my-account/my-account.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'universities', component: UniversitiesRecordComponent, canActivate: [AuthGuard] },
    { path: 'cvRecord', component: CvRecordsComponent, canActivate: [AuthGuard] },
    { path: 'pageStatus', component: PageStatusComponent, canActivate: [AuthGuard] },
    { path: 'myAccount', component: MyAccountComponent, canActivate :[AuthGuard]},
    // { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
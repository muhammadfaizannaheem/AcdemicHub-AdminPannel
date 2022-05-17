import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { User } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-universities-record',
  templateUrl: './universities-record.component.html',
  styleUrls: ['./universities-record.component.less']
})
export class UniversitiesRecordComponent implements OnInit {

  columnDefs : ColDef[] = [
    {headerName: 'Uni Id', field: 'Uid', sortable: true, filter: true, width : 100 },
    {headerName: 'University Name', field: 'UniversityName', sortable: true, filter: true},
    {headerName: 'University Url', field: 'UniUrl', sortable: true, filter: true},
    {headerName: 'Location', field: 'UniLocation', sortable: true, filter: true,width : 550},
    {headerName: 'Contact', field: 'UniContact', sortable: true, filter: true, width : 120},
    {headerName: 'Email', field: 'UniEmail', sortable: true, filter: true},
    {headerName: 'Department Name', field: 'DepartmentName', sortable: true, filter: true },
    {headerName: 'Department Url', field: 'DepatmentUrl', sortable: true, filter: true, width : 900},
    {headerName: 'Program Fee', field: 'ProgramFees', sortable: true, filter: true, width : 130},
    {headerName: 'Program Duration', field: 'ProgramDuration', sortable: true, filter: true, width : 140},
    {headerName: 'Ranking', field: 'UniRanking', sortable: true, filter: true, width : 100},
    {headerName: 'Admission Link', field: 'AdmissionUrl', sortable: true, filter: true, width : 400},
    {headerName: 'Psoitive Ranking', field: 'upRanking', sortable: true, filter: true, width : 150},
    {headerName: 'Negetive Ranking', field: 'downRanking', sortable: true, filter: true, width : 150}
];

rowData:any;
private userSubject: BehaviorSubject<User>;
public user: Observable<User>;
tokenKey : any;
tokenText : string;

tokenValue : string = localStorage.getItem('TokenKey');
  constructor(private http: HttpClient){
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
    this.tokenKey = this.userSubject.getValue();
    this.tokenText = this.tokenKey.access_token;
    //get request
    // {headers : {"Authorization" : "Bearer" + this.tokenText}} 
    
    this.http.get('https://localhost:44358/api/UniRecords',{ headers: {"Authorization" : `Bearer ${this.tokenText}`} }).subscribe(data => {
      //data storing for use in html component
      this.rowData = data;
          }, error => console.error(error));
  }


  ngOnInit(): void {
  }

}
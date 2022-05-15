import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-universities-record',
  templateUrl: './universities-record.component.html',
  styleUrls: ['./universities-record.component.less']
})
export class UniversitiesRecordComponent implements OnInit {

  columnDefs : ColDef[] = [
    {headerName: 'Uni Id', field: 'UniId', sortable: true, filter: true, width : 100 },
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

  constructor(private http: HttpClient){
    //get request
    this.http.get('https://acadhubdep1.azurewebsites.net/api/UniRecords').subscribe(data => {
      //data storing for use in html component
      this.rowData = data;
          }, error => console.error(error));
  }


  ngOnInit(): void {
  }

}
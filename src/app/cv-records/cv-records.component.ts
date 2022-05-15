import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-cv-records',
  templateUrl: './cv-records.component.html',
  styleUrls: ['./cv-records.component.less']
})
export class CvRecordsComponent implements OnInit {

  columnDefs : ColDef[] = [
    {headerName: 'Cv Id', field: 'uId', sortable: true, filter: true, width : 70 },
    {headerName: 'User Name', field: 'pName', sortable: true, filter: true},
    {headerName: 'User Address', field: 'pAddress', sortable: true, filter: true},
    {headerName: 'User Contact', field: 'pContact', sortable: true, filter: true,width : 150},
    {headerName: 'User Email', field: 'pEmail', sortable: true, filter: true, width : 150},
    {headerName: 'User Social Profile', field: 'pSocial', sortable: true, filter: true},
    {headerName: 'User Skills', field: 'pSkillInfo', sortable: true, filter: true },
    {headerName: 'User Experience', field: 'pExpInfo', sortable: true, filter: true, width : 150},
    {headerName: 'User Education', field: 'pEduInfo', sortable: true, filter: true, width : 150},
    {headerName: 'Image Url', field: 'pImageUrl', sortable: true, filter: true, width : 150},
    {headerName: 'Other Details', field: 'otherDetails', sortable: true, filter: true, width : 150}

];

rowData:any;

  constructor(private http: HttpClient){
    //get request
    this.http.get('https://acadhubdep1.azurewebsites.net/api/CvRecords').subscribe(data => {
      //data storing for use in html component
      this.rowData = data;
          }, error => console.error(error));
  }

  ngOnInit(): void {
  }

}

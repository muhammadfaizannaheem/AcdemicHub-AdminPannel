import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";
import { User } from "@app/_models";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { AlertService } from "@app/_services";
import { Toaster } from 'ngx-toast-notifications';
@Component({
  selector: "app-cv-records",
  templateUrl: "./cv-records.component.html",
  styleUrls: ["./cv-records.component.less"],
})
export class CvRecordsComponent implements OnInit {
  private api: GridApi;
  private columnApi: ColumnApi;
  CvData: any;
  CvId: number;
  SendingUrl: string;
  rowSelected : boolean = false;
  columnDefs: ColDef[] = [
    {
      headerName: "Id",
      field: "Id",
      sortable: true,
      filter: true,
      width: 70,
      resizable: true,
    },
    {
      headerName: "User Name",
      field: "pName",
      sortable: true,
      filter: true,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Address",
      field: "pAddress",
      sortable: true,
      filter: true,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Contact",
      field: "pContact",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Email",
      field: "pEmail",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Social Profile",
      field: "pSocial",
      sortable: true,
      filter: true,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Skills",
      field: "pSkillInfo",
      sortable: true,
      filter: true,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Experience",
      field: "pExpInfo",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      resizable: true,
    },
    {
      headerName: "User Education",
      field: "pEduInfo",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      resizable: true,
    },
    {
      headerName: "Image Url",
      field: "pImageUrl",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      resizable: true,
    },
    {
      headerName: "Other Details",
      field: "otherDetails",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
      resizable: true,
    },
  ];

  rowData: any;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  tokenKey: any;
  tokenText: string;

  constructor(private http: HttpClient, private alertService: AlertService,private toaster: Toaster) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();
    this.tokenKey = this.userSubject.getValue();
    this.tokenText = this.tokenKey.access_token;
    //get request
    this.http
      .get(`${environment.apiUrl}/CvRecords`, {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.rowData = data;
        },
        (error) => console.error(error)
      );
  }

  ngOnInit(): void {
    this.http
      .get(`${environment.apiUrl}/CvRecords`, {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.rowData = data;
        },
        (error) => console.error(error)
      );
  }

  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  editCv() {
    const d = this.api.stopEditing();
    if (this.api.getSelectedRows().length == 0) {
      this.toaster.open({text: 'Please Select Row To Edit', duration: 4000, type: 'warning', position : 'top-right'});
      return;
    }
    var row = this.api.getSelectedRows();
    this.CvData = row[0];
    console.log("get selected data" + JSON.stringify(this.CvData));
    this.CvId = parseInt(this.CvData.Id);
    this.SendingUrl = `${environment.apiUrl}/CvRecords/` + this.CvId;
    this.http.put(this.SendingUrl, this.CvData).subscribe((resp) => {
      console.log("iam positive response" + resp);
    });
    this.toaster.open({text: 'Cv Record Updated Successfully', duration: 4000, type: 'success', position : 'top-right'});
  }
  deleteCv() {
    const d = this.api.stopEditing();
    if (this.api.getSelectedRows().length == 0) {
      this.toaster.open({text: 'Please Select Row To Delete', duration: 4000, type: 'warning', position : 'top-right'});
      return;
    }
    var row = this.api.getSelectedRows();
    this.CvData = row[0];
    console.log("get selected data" + JSON.stringify(this.CvData));
    this.CvId = parseInt(this.CvData.Id);
    this.SendingUrl = `${environment.apiUrl}/CvRecords/` + this.CvId;
    this.http.delete(this.SendingUrl, this.CvData).subscribe((resp) => {
      console.log("iamNull" + resp);
    });
    
    // this.toaster.open("Cv Record Successfully Deleted");
    this.toaster.open({text: 'Cv Record Deleted Successfully', duration: 4000, type: 'danger', position : 'top-right'});
    this.ngOnInit();
    this.api.refreshClientSideRowModel(); 
  }
  onRowClicked(){
    this.rowSelected = true;
  }
}

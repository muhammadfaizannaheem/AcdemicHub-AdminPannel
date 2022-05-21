import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";
import { User } from "@app/_models";
import { BehaviorSubject, concat, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { University } from "./university";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-universities-record",
  templateUrl: "./universities-record.component.html",
  styleUrls: ["./universities-record.component.less"],
})
export class UniversitiesRecordComponent implements OnInit {
  file: File;
  arrayBuffer: any;
  filelist: any;
  tempData: any;
  universityData: any;
  university: University;
  

  columnDefs: ColDef[] = [
    {
      headerName: "Uni Id",
      field: "Uid",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: "University Name",
      field: "UniversityName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "University Url",
      field: "UniUrl",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Location",
      field: "UniLocation",
      sortable: true,
      filter: true,
      width: 550,
    },
    {
      headerName: "Contact",
      field: "UniContact",
      sortable: true,
      filter: true,
      width: 120,
    },
    { headerName: "Email", field: "UniEmail", sortable: true, filter: true },
    {
      headerName: "Department Name",
      field: "DepartmentName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department Url",
      field: "DepatmentUrl",
      sortable: true,
      filter: true,
      width: 900,
    },
    {
      headerName: "Program Fee",
      field: "ProgramFees",
      sortable: true,
      filter: true,
      width: 130,
    },
    {
      headerName: "Program Duration",
      field: "ProgramDuration",
      sortable: true,
      filter: true,
      width: 140,
    },
    {
      headerName: "Ranking",
      field: "UniRanking",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: "Admission Link",
      field: "AdmissionUrl",
      sortable: true,
      filter: true,
      width: 400,
    },
    {
      headerName: "Psoitive Ranking",
      field: "upRanking",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Negetive Ranking",
      field: "downRanking",
      sortable: true,
      filter: true,
      width: 150,
    },
  ];

  rowData: any;

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  tokenKey: any;
  tokenText: string;

  constructor(
    private http: HttpClient,
    private changeDetection: ChangeDetectorRef
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();
    this.tokenKey = this.userSubject.getValue();
    this.tokenText = this.tokenKey.access_token;

    this.http
      .get("https://localhost:44358/api/UniRecords", {
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

  ngOnInit(): void {}
  addfile(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.arrayBuffer = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(this.arrayBuffer.length);
      this.filelist = [];
      // this.arrayBuffer=arraylist;
    };
  }
  uploadRecord() {
   

    this.deleteRecord();
    this.postRecord();
    this.getRecord();
    this.changeDetection.detectChanges();
  }
  deleteRecord(){
    this.http
      .delete("https://localhost:44358/api/BulkDelete", {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        console.log("Response for Deleting Data is  :  " + resp);
      });
  }
  getRecord(){
    this.http
      .get("https://localhost:44358/api/UniRecords", {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.rowData = data;
          this.transferData(data);
        },
        (error) => console.error(error)
      );
  }
  postRecord(){
    this.http
      .post("https://localhost:44358/api/UniBulk", this.arrayBuffer, {
        responseType: "json",
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        console.log("Response of Record Url is : " + resp);
      });
  }
  transferData(data : any){
    this.rowData=data;
  }
}

import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";
import { User } from "@app/_models";
import { BehaviorSubject, concat, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { University } from "./university";
import { JsonPipe } from "@angular/common";
import { environment } from "@environments/environment";
import { LoadingService } from "../loading.service";
import { Toaster } from "ngx-toast-notifications";
import { delay } from "rxjs/operators";

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
  private api: GridApi;
  private columnApi: ColumnApi;
  rowSelected: boolean = false;
  uId: number;
  uData: any;
  SendingUrl: string;
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
      editable: true,
    },
    {
      headerName: "University Url",
      field: "UniUrl",
      sortable: true,
      filter: true,
      editable: true,
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
      editable: true,
    },
    { headerName: "Email", field: "UniEmail", sortable: true, filter: true },
    {
      headerName: "Department Name",
      field: "DepartmentName",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Department Url",
      field: "DepatmentUrl",
      sortable: true,
      filter: true,
      width: 900,
      editable: true,
    },
    {
      headerName: "Program Fee",
      field: "ProgramFees",
      sortable: true,
      filter: true,
      width: 130,
      editable: true,
    },
    {
      headerName: "Program Duration",
      field: "ProgramDuration",
      sortable: true,
      filter: true,
      width: 140,
      editable: true,
    },
    {
      headerName: "Ranking",
      field: "UniRanking",
      sortable: true,
      filter: true,
      width: 100,
      editable: true,
    },
    {
      headerName: "Admission Link",
      field: "AdmissionUrl",
      sortable: true,
      filter: true,
      width: 400,
      editable: true,
    },
    {
      headerName: "Psoitive Ranking",
      field: "upRanking",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
    },
    {
      headerName: "Negetive Ranking",
      field: "downRanking",
      sortable: true,
      filter: true,
      width: 150,
      editable: true,
    },
  ];

  rowData: any;

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  tokenKey: any;
  tokenText: string;

  loading$ = this.loader.loading$;

  constructor(
    private http: HttpClient,
    private changeDetection: ChangeDetectorRef,
    public loader: LoadingService,
    private toaster: Toaster
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();
    this.tokenKey = this.userSubject.getValue();
    this.tokenText = this.tokenKey.access_token;

    this.http
      .get(`${environment.apiUrl}/UniRecords`, {
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
      .get(`${environment.apiUrl}/UniRecords`, {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.rowData = data;
          // this.transferData(data);
        },
        (error) => console.error(error)
      );
  }

  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

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
    this.ngOnInit();
    this.api.refreshClientSideRowModel();
  }
  deleteRecord() {
    this.http
      .delete(`${environment.apiUrl}/BulkDelete`, {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.postRecord();
        this.toaster.open({
          text: "Step 1: Deletion Success",
          duration: 4000,
          type: "info",
          position: "top-right",
        });
      });
  }
  postRecord() {
    this.http
      .post(`${environment.apiUrl}/UniBulk`, this.arrayBuffer, {
        responseType: "json",
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        delay(10000);
        this.getRecord();
        this.toaster.open({
          text: "Step 2: New Data Post Success",
          duration: 4000,
          type: "info",
          position: "top-right",
        });
      });
  }
  getRecord() {
    this.http
      .get(`${environment.apiUrl}/UniRecords`, {
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.rowData = data;
          this.ngOnInit();
          this.api.refreshClientSideRowModel();
          this.toaster.open({
            text: "Data Update Successfull",
            duration: 4000,
            type: "success",
            position: "top-right",
          });
        },
        (error) => console.error(error)
      );
  }
  editUni() {
    const d = this.api.stopEditing();
    // const d = this.api.getEditingCells();
    if (this.api.getSelectedRows().length == 0) {
      this.toaster.open({
        text: "Please Select Row To Edit",
        duration: 4000,
        type: "warning",
        position: "top-right",
      });
      return;
    }
    var row = this.api.getSelectedRows();
    this.uData = row[0];
    this.uId = parseInt(this.uData.Uid);
    this.SendingUrl = `${environment.apiUrl}/UniRecords/` + this.uId;
    this.http.put(this.SendingUrl, this.uData).subscribe((resp) => {});
    this.toaster.open({
      text: "University Record Updated Successfully",
      duration: 4000,
      type: "success",
      position: "top-right",
    });
  }

  onRowClicked() {
    this.rowSelected = true;
  }

  onRefresh() {
    this.rowSelected = false;
    this.ngOnInit;
    this.api.refreshClientSideRowModel();
    this.toaster.open({
      text: "Record Refreshed Successfully",
      duration: 4000,
      type: "success",
      position: "top-right",
    });
  }

  // excel download
  //excel button click functionality
  exportExcel() {
    this.rowSelected = false;
    this.onRefresh();
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.rowData); // Rows Data
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "Acad");
    });
    this.toaster.open({
      text: "Uni Data Downloaded Successfully",
      duration: 4000,
      type: "success",
      position: "top-right",
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + "_Data_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
}

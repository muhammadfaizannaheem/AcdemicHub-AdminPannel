import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { User } from "@app/_models";
import { Toaster } from "ngx-toast-notifications";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-page-status",
  templateUrl: "./page-status.component.html",
  styleUrls: ["./page-status.component.less"],
})
export class PageStatusComponent implements OnInit {
  chkInterest: boolean;
  chkResume: boolean;
  chkUni: boolean;
  tempVar: boolean = true;
  apiData: any;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  tokenKey: any;
  tokenText: string;




  constructor(private http: HttpClient,private toaster: Toaster) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();
    this.tokenKey = this.userSubject.getValue();
    this.tokenText = this.tokenKey.access_token;

    this.toaster.open({
      text: "Getting the Page Status. Wait",
      duration: 4000,
      type: "warning",
      position: "top-right",
    });
    this.setValues();
  }

  setValues() {
    this.http
      .get("https://academichub.tech/api/PageStatus/interestFinder",{
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.apiData = resp;
        this.chkInterest = this.apiData.Status;
      });
    this.http
      .get("https://academichub.tech/api/PageStatus/resumeGenerator",{
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.apiData = resp;
        this.chkResume = this.apiData.Status;
      });
    this.http
      .get("https://academichub.tech/api/PageStatus/universityExplorer",{
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.apiData = resp;
        this.chkUni = this.apiData.Status;
        console.log("Values Load Success");
      });
  }

  Chk1() {
    this.tempVar = this.onClick(this.chkInterest);
    this.chkInterest = this.tempVar;
    let data = {
      "Id": "interestFinder",
      "Status": this.chkInterest
    }
    this.http
      .put("https://academichub.tech/api/PageStatus/interestFinder",data,{
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.toaster.open({
          text: "Interest Page Status Updated",
          duration: 4000,
          type: "warning",
          position: "top-right",
        });
      });
  }
  Chk2() {
    this.tempVar = this.onClick(this.chkResume);
    this.chkResume = this.tempVar;
    let data = {
      "Id": "resumeGenerator",
      "Status": this.chkResume
    }
    this.http
      .put("https://academichub.tech/api/PageStatus/resumeGenerator",data,{
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.toaster.open({
          text: "Resume Page Status Updated",
          duration: 4000,
          type: "warning",
          position: "top-right",
        });
      });
  }
  Chk3() {
    this.tempVar = this.onClick(this.chkUni);
    this.chkUni = this.tempVar;
    let data = {
      "Id": "universityExplorer",
      "Status": this.chkUni
    }
    this.http
      .put("https://academichub.tech/api/PageStatus/universityExplorer",data,{
        headers: { Authorization: `Bearer ${this.tokenText}` },
      })
      .subscribe((resp) => {
        this.toaster.open({
          text: "Uni Page Status Updated",
          duration: 4000,
          type: "warning",
          position: "top-right",
        });
      });
  }
  onClick(opt: boolean) {
    if (opt == true) {
      return false;
    }
     return true;
  }
  ngOnInit(): void {}
}

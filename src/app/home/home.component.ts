import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";

import { User } from "@app/_models";
import { AccountService } from "@app/_services";

@Component({
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  user: User;
  token : string;
  userName : string;
  DepCount : number = 0;
  CvCount : number = 0;
  uData : any;
  TempDep : number;
  TempCv : number;
  departmentCountStop : any;
  cvCountStop : any;

  constructor(private accountService: AccountService, private http : HttpClient) {
    this.user = this.accountService.userValue;
    
    // console.log("UserObject" + JSON.stringify(this.accountService.userValue));
    this.token= Object(accountService.userValue)["access_token"];
    this.userName=Object(accountService.userValue)["userName"];
    this.http
      .get("https://localhost:44358/api/CvRecords", {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.uData = data;
          this.TempCv=this.uData.length;
          console.log("CvCount" + this.TempCv);
          this.cvCountStop = setInterval(()=>{
            this.CvCount=this.CvCount+1;
            if(this.CvCount >= this.TempCv)
            {
              this.CvCount=this.TempCv;
              clearInterval(this.cvCountStop);
            }
          },1090);
        },
        (error) => console.error(error)
      );
      this.http
      .get("https://localhost:44358/api/UniRecords", {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .subscribe(
        (data) => {
          //data storing for use in html component
          this.uData = data;
          this.TempDep=this.uData.length;
          console.log(this.TempDep);
          this.departmentCountStop = setInterval(()=>{
            this.DepCount=this.DepCount+5;
            if(this.DepCount >= this.TempDep)
            {
              this.DepCount=this.TempDep;
              clearInterval(this.departmentCountStop);
            }
          },90);
        },
        (error) => console.error(error)
      );
    
  }
}

import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { User } from "@app/_models";
import { AccountService } from "@app/_services";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { Toaster } from "ngx-toast-notifications";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.css"],
})
export class MyAccountComponent implements OnInit {
  user: User;
  token: string;
  userName: string;
  loginTime: string;
  cpass: string;
  npass: string;
  conpass: string;
  errMsg : string;
  tokenStatus : boolean = false;
  tokenText : string = "View Token";

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private toaster: Toaster
  ) {
    this.user = this.accountService.userValue;
    this.token = Object(accountService.userValue)["access_token"];
    this.userName = Object(accountService.userValue)["userName"];
    this.loginTime = Object(accountService.userValue)[".issued"];
  }

  ngOnInit(): void {}
  getValues() {
    this.userName = Object(this.accountService.userValue)["userName"];
    this.loginTime = Object(this.accountService.userValue)[".issued"];
  }
  checkValidation() {
    if (this.npass == this.conpass && this.cpass != null) {
      this.toaster.open({
        text: "Validation Done",
        duration: 4000,
        type: "success",
        position: "top-right",
      });
      return true;
    } else {
      this.toaster.open({
        text: "New Password and Confirm Password must be Same",
        duration: 4000,
        type: "danger",
        position: "top-right",
      });
      this.toaster.open({
        text: "you have to fill all feilds",
        duration: 4000,
        type: "danger",
        position: "top-right",
      });
      return false;
    }
  }
  //change password api
  changePassword() {
    if (this.checkValidation() == true) {
      let userData = {
        OldPassword: this.cpass,
        NewPassword: this.npass,
        ConfirmPassword: this.conpass,
      };
      this.http.post("https://academichub.tech/api/Account/ChangePassword", userData,{
        headers: { Authorization: `Bearer ${this.token}` },
      }).subscribe({
        next: () => {
          this.toaster.open({
            text: "Password Changed Successfully",
            duration: 4000,
            type: "success",
            position: "top-right",
          });
        },
        error: error => {
          this.toaster.open({
            text: "Something Went Wrong. Try Again!" + error,
            duration: 4000,
            type: "danger",
            position: "top-right",
          });
        }
      })

    } else {
      //do none :)
    }
  }

  viewToken(){
    if(this.tokenStatus == false){
      this.tokenStatus = true;
      this.tokenText = "Hide Token";
    }
    else{
      this.tokenStatus = false;
      this.tokenText = "View Token";
    }
  }
}

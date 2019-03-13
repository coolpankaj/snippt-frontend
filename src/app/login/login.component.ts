import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: any;
  password: any;
  constructor(
    public fb: FormBuilder,
    private appService: AppService,
    public toastr: ToastrManager,
    public router: Router,
    public cookie: CookieService
  ) {}

  ngOnInit() {}
  public onKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.signinFunction()
    }
  }
  public signinFunction: any = () => {
    if (!this.userName) {
      this.toastr.warningToastr('enter username');
    } else if (!this.password) {

      this.toastr.warningToastr('enter password');
    } else {

      const data = {
        userName: this.userName,
        password: this.password
      };
      this.appService.signinFunction(data).subscribe((apiResponse: any) => {
        if (apiResponse.status === 200) {
          this.cookie.set('authToken', apiResponse.data.authToken);
          this.cookie.set('receiverId', apiResponse.data.userDetails.userId);
          this.cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
         // this.router.navigate(['/chat']);
          this.toastr.successToastr(apiResponse.message);
          if (apiResponse.data.userDetails.isAdmin === true) {
            setTimeout(() => {
             this.router.navigate(['/admin-dashboard']);
            }, 1500);
           } else {
            setTimeout(() => {
             this.router.navigate(['/user-dashboard']);
            }, 1500);
           }

        } else {
          this.toastr.errorToastr(apiResponse.message);
        }
      },
        (err) => {
          this.toastr.errorToastr('Invalid username or password');
        });

    }
  }
}

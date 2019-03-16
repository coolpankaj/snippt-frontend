import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-alumni-dashboard',
  templateUrl: './alumni-dashboard.component.html',
  styleUrls: ['./alumni-dashboard.component.css']
})
export class AlumniDashboardComponent implements OnInit {
  authToken: any;
  userInfo: any;
  receiverId: any;
  receiverName: any;
  meetings: any = [];

  constructor(public router: Router, public appService: AppService, public Cookie: CookieService, public toastr: ToastrManager) { }

  ngOnInit() {

    this.authToken = this.Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.receiverId = this.Cookie.get('receiverId');
    this.receiverName = this.Cookie.get('receiverName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.getAllMeetings()
  }

  getAllMeetings() {
    this.meetings = [];
    this.appService.listAllMeetings(this.authToken).subscribe((apiResponse: any) => {
        if (apiResponse.status === 200) {
            this.meetings = apiResponse.data;
            //console.log(this.meetings)
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
    }, (err) => {
      this.toastr.errorToastr(err.message)
    })
  }

  // for accept and reject meeting
  updateMeeting(meeting: any, status: String) {
    let data = {
      meetingId: meeting.meetingId,
      isAccepted: status,
      authToken: this.authToken
    }
   // console.log(data)
    this.appService.updateMeeting(data).subscribe((apiResponse: any) => {
      //console.log(apiResponse)
      if (apiResponse.status === 200) { 
        this.toastr.successToastr('meeting updated')
        this.getAllMeetings()
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    }, (err) => {
      this.toastr.errorToastr(err.message)
    })
  }
  deleteMeeting(meeting: any) {
    let data = {
      authToken: this.authToken,
      meetingId: meeting.meetingId
    }
    this.appService.deleteMeeting(data).subscribe((apiResponse: any) => {
          if (apiResponse.status === 200) {
              if (apiResponse.status === 200) {
                this.getAllMeetings()
              } else {
                this.toastr.errorToastr(apiResponse.message)
              }
          }
    }, (err) => {
      this.toastr.errorToastr(err.message)
    })
  }

  logOut = () => {
    let data = {
      userId: this.receiverId,
      authToken: this.authToken
    }
    this.appService.logout(data).subscribe((apiResponse: any) => {
        if (apiResponse.status === 200) {
          
          this.Cookie.delete('authToken');//delete all the cookies
          this.Cookie.delete('receiverId');
          this.Cookie.delete('receiverName');
          
          localStorage.clear();
          
           
          this.toastr.successToastr("Logged out")
            this.router.navigate(['/login']);           

        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      },
      (err) => {
        this.toastr.errorToastr(err.message)
      });

  }
}

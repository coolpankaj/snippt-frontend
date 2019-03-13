import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, getDate } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('createNewMeeting') createNewMeeting: TemplateRef<any>;
  meetingDate: any;
  isDisabled = true;
  meetingStartTime: any;
  meetingEndTime: any;
  meetings: any;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;
  authToken: any;
  userInfo: any;
  receiverId: any;
  receiverName: any;

  constructor(public toastr: ToastrManager,private modal: NgbModal, public Cookie: CookieService, public appService: AppService) {}

  ngOnInit() {

    this.authToken = this.Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.receiverId = this.Cookie.get('receiverId');
    this.receiverName = this.Cookie.get('receiverName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.getMyMeetings()
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

    getMyMeetings() {
      const data = {
        userId: this.userInfo.userId,
        authToken: this.authToken
      }
      this.appService.getUserMeeting(data).subscribe((apiResponse: any) =>{
        if (apiResponse.status === 200) {
          this.meetings='';
          this.events = [];
          this.meetings = apiResponse.data;
         // this.events = apiResponse.data;
          //console.log(this.meetings)
          for (let meetingEvent of this.meetings) {
              meetingEvent.start = new Date(meetingEvent.meetingDate)
             // meetingEvent.end = new Date(meetingEvent.meetingDate)
              this.events.push(meetingEvent)
            
          }
          console.log(this.events)
          this.refresh.next()
         // this.toastr.infoToastr('Calendar updated')
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.toastr.errorToastr(err.message)
      })
    }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
  vaidateCurrentDate() {
    const seletedDate = new Date(this.meetingDate);
    const todayDate = new Date();
    if (todayDate > seletedDate) {
      return true;
    } else {
      return false;
    }
  }
  validBookingDate() {
    const today: any = new Date();
    const newmeetingDate = new Date(this.meetingDate);
    const diff = new Date(newmeetingDate.getTime() - today.getTime());
    const gap = diff.getUTCDate();
    if (gap > 7) {
      return true;
    } else {
      return false;
    }
  }

  createMeeting() {
    this.modal.open(this.createNewMeeting, { size: 'lg' });
    this.meetingDate= '';
    this.meetingStartTime= '';
    this.meetingEndTime = '';
  }
  setMeetingTime(startTime, endTime) {
      this.meetingStartTime = startTime;
      this.meetingEndTime = endTime;
      this.isDisabled = false;
  }

  addNewMeeting() {
    const data = {
      studentId: this.userInfo.userId,
      studentName: this.userInfo.firstName,
      meetingDate: this.meetingDate,
      meetingStartTime: this.meetingStartTime,
      meetingEndTime: this.meetingEndTime,
      authToken: this.authToken
    };
    console.log(data);
    this.appService.addNewMeeting(data).subscribe((apiResponse: any) => {
      if(apiResponse.status === 200) {
       // console.log(apiResponse)
        this.toastr.successToastr(apiResponse.message)
        this.getMyMeetings()
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    }, (err) => {
      this.toastr.errorToastr(`${err.message}`)
    })
  }
}

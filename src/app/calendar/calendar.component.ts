import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../socket.service';
import * as $ from 'jquery'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [SocketService],
})
export class CalendarComponent implements OnInit, OnDestroy {

  public currentMonth: number
  public currentYear: number
  public viewDate: Date
  public clickedDate: Date
  public eventList = []
  private userId
  public view = 'month'
  public isAdmin = localStorage.getItem('isAdmin') === 'true'
  public importanceOption = [{
    name: 'High',
    code: 0
  }, {
    name: 'Medium',
    code: 1
  }, {
    name: 'Low',
    code: 2
  }]
  @ViewChild('createForm') createForm: NgForm;

  //Event form variables
  public forNew: Boolean = true
  public title: String = ''
  public location: String = ''
  public description: String = ''
  public start: Date
  public end: Date
  public eventId: String = ''
  public adminName: String = ''
  public importance: Number

  //Date input limits 
  public max: Date
  public min: Date

  constructor(private _api: ApiService, private _helper: HelperService, private _router: Router, private toastr: ToastrService, private _route: ActivatedRoute, private _socket: SocketService) { }


  ngOnInit() {
    this._helper.verifyUserLoginAndReroute()
    this.viewDate = new Date()
    this.clickedDate
    this.currentMonth = this.viewDate.getMonth()
    this.currentYear = this.viewDate.getFullYear()

    this.max = new Date(new Date(this.currentYear, 11, 31, 23, 59).toISOString())
    this.min = new Date()

    this.userId = this._route.snapshot.queryParamMap.get('userId') || localStorage.getItem('userId')
    if(this.userId) this.getMeetings()

    //if it is a normal user then start a socket connection and set user and notification listener event.

    if (!this.isAdmin) {
      this._socket.startConnection().subscribe(() => {
        this._socket.setUser()
        this.listenToNotification()

      })
    }


  }

  ngOnDestroy() {
    this._socket.disconnect()
  }
/**
 * 
 * Get the meetings array for current month and update the event/meeting list if the response is for the current month
 * 
 */
  getMeetings() {

    this.currentMonth = this.viewDate.getMonth()
    let month = this.currentMonth // keeping a local copy to compare when the response comes. If current month would be different whe nthe response comes then we will not copy the data into the display array.

    this._api.listMeeting(this.userId, month).subscribe((resp: any) => {
      if (resp.error) {
        if (resp.status == 403) {
          this.toastr.error(resp.message, '403')
          this._router.navigate(['/403'])
        } else {
          this.toastr.error(resp.message, 'Error')
        }
      } else {
        if (resp.data.length > 0 && month == this.currentMonth) {

          this.eventList = resp.data.map((meeting) => {
            meeting.end = new Date(meeting.end)
            meeting.start = new Date(meeting.start)
            return meeting
          })

        }
        else {
          this.toastr.info(resp.message, 'Info')
        }
      }
    })
  }

  /** Open the day timeline view if clickedDate has a date*/
  openDayWindow() {
    if (this.clickedDate) {
      setTimeout(() => {
        $('body').addClass('modal-open')
        $('#b').trigger('click')
      }, 500)
    }

  }

  dayClicked($event) {
    this.clickedDate = $event.day.date
    this.openDayWindow()
  }

  eventClicked($event) {
    this.createForm.reset({
      title: $event.event.title,
      location: $event.event.location,
      description: $event.event.description,
      start: $event.event.start,
      end: $event.event.end,
      adminName: $event.event.adminName,
      importance: $event.event.importance
    })
    this.adminName = $event.event.adminName
    this.eventId = $event.event.id

    this.forNew = false
    this.openEditCreateModal()

  }

  createMeeting() {
    //reset the for and set default values
    this.createForm.reset({
      start: this.clickedDate || this.viewDate,
      end: this.clickedDate || this.viewDate,
      importance: 1
    })

    this.forNew = true
    this.openEditCreateModal()
  }

  /**
   * 
   * Open the detail view of the meeting
   * 
   */
  openEditCreateModal() {
    //close any other open modal and then open the create edit modal.
    $('#dayClose').trigger('click')
    setTimeout(() => {
      $('body').addClass('modal-open')
      $('#createButton').trigger('click')
    }, 500)

  }

  saveMeeting() {
    console.log(this.start.toISOString())
    if (this.forNew) {
      this._api.createMeeting(this.userId, this.title, this.description, this.location, this.start.toISOString(), this.end.toISOString(), this.importance).subscribe((resp: any) => {
        if (resp.error) {
          if (resp.status == 403) {
            this.toastr.error(resp.message, '403')
            this._router.navigate(['/403'])
          } else {
            this.toastr.error(resp.message, 'Error')
          }
        } else {
          this.toastr.success(resp.message, 'Success')
          this.insertEvent(resp.data)
          $('#createClose').trigger('click')
        }

      })
    } else {

      this._api.editMeeting(this.eventId, this.title, this.description, this.location, this.start.toISOString(), this.end.toISOString(), this.importance).subscribe((resp: any) => {
        if (resp.error) {
          if (resp.status == 403) {
            this.toastr.error(resp.message, '403')
            this._router.navigate(['/403'])
          } else {
            this.toastr.error(resp.message, 'Error')
          }
        } else {

          this.toastr.success(resp.message, 'Success')
          this.updateEvent(resp.data)
          $('.close').trigger('click')
        }

      })

    }


  }

  deleteMeeting() {
    let choice = confirm("Are you sure you want to delete this meeting?")
    if (choice) {

      let targetId = this.eventId
      this._api.deleteMeeting(targetId).subscribe((resp: any) => {

        if (resp.error) {
          if (resp.status == 403) {
            this.toastr.error(resp.message, '403')
            this._router.navigate(['/403'])
          } else {
            this.toastr.error(resp.message, 'Error')
          }
        } else {
          this.toastr.success(resp.message, 'Success')
          this.deleteTargetById(targetId)
          $('#createClose').trigger('click')
        }

      })
    }


  }

  deleteTargetById(targetId) {
    this.eventList = this.eventList.filter((event) => {
      return event.id != targetId
    })
  }

  updateEvent(target) {
    target.start = new Date(target.start)
    target.end = new Date(target.end)
    this.eventList = this.eventList.map((event) => {
      return event.id == target.id ? target : event // compare each event's id to currently selected event. If matches return the updated event else just return the same event.
    })
  }

  insertEvent(event) {
    event.start = new Date(event.start)
    event.end = new Date(event.end)
    this.eventList = this.eventList.concat([event])
  }

  reminderAlert(notificationObj) {

    let choice = confirm(`${notificationObj.message} 
    (click cancel to snooze for 5 sec.)`)

    if (!choice) {
      setTimeout(() => {
        this.reminderAlert(notificationObj)
      }, 5 * 1000)
    }


  }

  listenToNotification() {

    this._socket.listenNotification(this.userId).subscribe((notificationObj: any) => {
      console.log(notificationObj)
      if (notificationObj.type != 'reminder') this.toastr.info(notificationObj.message, notificationObj.title)

      switch (notificationObj.type) {
        case 'meeting-create': this.insertEvent(notificationObj.meeting); break;
        case 'meeting-delete': this.deleteTargetById(notificationObj.meeting.id); break;
        case 'meeting-update': this.updateEvent(notificationObj.meeting); break;
        case 'reminder': this.reminderAlert(notificationObj)
        default: ;
      }



    })

  }
}


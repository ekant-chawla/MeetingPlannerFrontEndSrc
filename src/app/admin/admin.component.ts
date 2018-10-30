import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';
import { Router } from '../../../node_modules/@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userList = []
  public fullUserList = []
  private page = 1
  public filter = ''
  public gettingData = false
  constructor(private _api: ApiService, private _helper: HelperService, private _router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this._helper.verifyUserLoginAndReroute(true)
    
    if(this._helper.isAdmin())
    this.listUsers()
  }

  listUsers() {
    this.gettingData = true
    this._api.listUsers(this.page).subscribe((resp: any) => {
      this.gettingData = false
      if (resp.error) {
        if (resp.status == 403) {
          this.toastr.error(resp.message, '403')
          this._router.navigate(['/403'])
        } else {
          this.toastr.error(resp.message, 'Error')
        }
      } else {
        if (resp.data.length > 0) {
          this.fullUserList = this.fullUserList.concat(resp.data)
          this.page++
          this.filterUser()
        }
        else {
          this.toastr.info(resp.message, 'Info')
        }
      }
    })
  }


  filterUser(){
    let regex = new RegExp(this.filter,'i')
    this.userList = this.fullUserList.filter((user)=>{
      return regex.test(user.userName) || regex.test(user.firstName) || regex.test(user.lastName)
    })
  }



  listMore() {
    this.listUsers()
  }
}

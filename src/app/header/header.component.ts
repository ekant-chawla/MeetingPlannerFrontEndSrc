import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from '../helper.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _helper:HelperService,private _socket:SocketService) { }

  ngOnInit() {
  }

  logout(){
    this._socket.disconnect()
    this._helper.logout()
  }

  isAdmin(){
    return this._helper.isAdmin()
  }

  isLoggedIn(){
    return this._helper.isLoggedIn()
  }
}

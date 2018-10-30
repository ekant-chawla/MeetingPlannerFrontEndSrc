import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public ItemPerPage = 10

  constructor(private _router: Router, private toastr: ToastrService) { }

  /**  This function checks if the logged in user if any should be on the componenet and if no then redirect it to correct route.
          
          If forHome is set this means we need do not need to logout the user if authToken is missing as he is already on the home page. Also if the user is already logged in take him to appropriate page
          If checkAdmin is set this means that the page is only admin exclusive and if the user is not an admin then redirect the user to 403 page
  */
  verifyUserLoginAndReroute(checkAdmin: Boolean = false, forHome: Boolean = false) {

    let authToken = localStorage.getItem('authToken')

    if (checkAdmin && !this.isAdmin()) this._router.navigate(['/403'])

    else if (authToken) {
      if (forHome) {
        if (localStorage.getItem('isAdmin') === 'true') this._router.navigate(['/admin'])
        else this._router.navigate(['/calendar'])
      }
    } else {
      if (!forHome) {
        this.logout(false)
        this.toastr.info("Redirecting to home", "Invalid/Expired session")
      }
    }

  }

  logout(showMessage: Boolean = true) {
    localStorage.clear()
    this._router.navigate(['/home'])
    if (showMessage) this.toastr.success("User successfuly logged out", "Success")
  }

  isAdmin() {
    return localStorage.getItem('isAdmin') === 'true'
  }

  isLoggedIn() {
    if (localStorage.getItem('userId')) return true
    else return false
  }

}

import { Component, OnInit } from '@angular/core';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { LocalStorageService } from '../localStorageService';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface Iuser {

  id?: number;
  username: string;
  password: string;

}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Iuser = { username: '', password: '' };
  localStorageService: LocalStorageService<Iuser>;
  currentUser: Iuser = null;
  constructor(private router: Router, private toastService: ToastService) { 
    this.localStorageService =  new LocalStorageService('user');
  }


  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage();
    if(this.currentUser != null) {
      this.router.navigate(['contacts']);

    }
  }

  login(user: Iuser) {
    console.log('from login user: ', user);
    const defaultUser: Iuser = { username: 'Juan', password: 'Laredo123' }
    if (user.username !== '' && user.password != '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
      //log the user in
      // store user in localStorage
      this.localStorageService.saveItemsToLocalStorage(user);
      // navigate to contacts page
      this.router.navigate (['contacts', user]);

      } else{
// show error toast user
this.toastService.showToast('danger', 15000, 'Log in failed try again');
      }
    } else {
      // show error toast user
      this.toastService.showToast('danger', 15000, 'Log in failed check your stuff');
    }
    

  }


}

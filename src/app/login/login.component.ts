import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../localStorageService';

export interface Iuser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isError: boolean = false;
  error: string = '';
  user: Iuser = { username: '', password: '' };
  localStorageService: LocalStorageService<Iuser>;
  currentUser: Iuser = null;
  constructor(private router: Router) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage(
      'user'
    );
    console.log(this.currentUser);
    if (this.currentUser !== null) {
      this.router.navigate(['calendar']);
    }
  }

  login(user: Iuser) {
    console.log('from login user: ', user);
    const defaultUser: Iuser = { username: 'Juan', password: 'Laredo123' };
    if (user.username !== '' && user.password !== '') {
      if (
        user.username === defaultUser.username &&
        user.password === defaultUser.password
      ) {
        this.isError = false;
        this.localStorageService.saveItemsToLocalStorage(user);
        // navigate to calendar page
        this.router.navigate(['calendar']);
      } else {
        // show error toast user
        this.isError = true;
        this.error = 'Username or Password is incorrect';
      }
    } else {
      this.isError = true;
      this.error = 'Please enter valid username or password';
    }
  }
}

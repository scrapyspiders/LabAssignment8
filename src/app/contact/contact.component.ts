import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { Iuser } from '../login/login.component';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams = '';
  localStorageService: LocalStorageService<Contact>;
  currentUser: Iuser;


  constructor(private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService

  ) {
    this.localStorageService = new LocalStorageService('contacts');
  }

  async ngOnInit() {
    const currentUser = this.localStorageService.getItemsFromLocalStorage('user');
    if (currentUser == null) {
      this.router.navigate(['login']);

    }
    this.loadContact
    this.activatedRoute.params.subscribe((data: Iuser) => {
      console.log('data passed from login component to this componen', data);
      this.currentUser = data;
    });
  }

  async loadContact() {
    const savedContacts = this.getItemsFromLocalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts;
    } else {
      this.contacts = await this.loadItemsFromFile();
    }
    this.sortbyID(this.contacts);
  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    return data.json();
  }

  addContact() {
    this.contacts.unshift(new Contact({
      id: null,
      firstName: null,
      lastName: null,
      phone: null,
    }));
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveContact(contact: any) {
    let hasError = false;
    Object.keys(contact).forEach((key: any) => {
      if(contact[key]== null) {
        hasError = true;
        this.toastService.showToast('danger', 2000, 'Did not save!');

    }
    });
    if (!hasError) {
    } else {
      contact.editing = false;
      this.saveItemsToLocalStorage(this.contacts);
    }
  }


  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortbyID(contacts);
    this.localStorageService.saveItemsToLocalStorage(contacts);
    // const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    // return savedContacts;

  }

  getItemsFromLocalStorage(key: string) {
    // const savedContacts = JSON.parse(localStorage.getItem(key));
    return this.localStorageService.getItemsFromLocalStorage();
    // return savedContacts;

  }
  searchContact(params: string) {
    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });

  }

  sortbyID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {
      return prevContact.id > presContact.id ? 1 : -1;
    });
    return contacts;

  }
  Logout() {
    // clear localstorage
    this.localStorageService.clearItemFromLocalStorage('user');
    // navigate to login page
    this.router.navigate(['']);
  }

}
import { Component, OnInit } from '@angular/core';
import { config } from './config';
import { LocalStorageService } from '../localStorageService';
import { Iuser } from '../login/login.component';
import { Router } from '@angular/router';

interface IMonths {
  id: number;
  name: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  private currentMonth: string;
  private currentDate: string;
  private currentYear: string;
  private url: string;

  public displayString: string = '';
  public coverImage: string = '';
  public homeContent: string = config.home;
  public isLoading: boolean = false;
  localStorageService: LocalStorageService<Iuser>;
  currentUser: Iuser = null;

  dates: Array<number> = [];

  Months: IMonths[] = [
    {
      id: 1,
      name: 'January',
    },
    {
      id: 2,
      name: 'February',
    },
    {
      id: 3,
      name: 'March',
    },
    {
      id: 4,
      name: 'April',
    },
    {
      id: 5,
      name: 'May',
    },
    {
      id: 6,
      name: 'June',
    },
    {
      id: 7,
      name: 'July',
    },
    {
      id: 8,
      name: 'August',
    },
    {
      id: 9,
      name: 'September',
    },
    {
      id: 10,
      name: 'October',
    },
    {
      id: 11,
      name: 'November',
    },
    {
      id: 12,
      name: 'December',
    },
  ];

  arrayThree(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map((i) => i + startFrom).sort((a, b) => b - a);
  }

  constructor(private router: Router) {
    this.dates = Array.from({ length: 31 }, (v, k) => k + 1);
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage(
      'user'
    );
    console.log(this.currentUser);
    if (this.currentUser === null) {
      this.router.navigate(['login']);
    }
  }

  fetchDetails() {
    this.displayString = '';
    this.coverImage = '';
    const date = new Date(
      Number(this.currentYear),
      Number(+this.currentMonth) - 1,
      Number(this.currentDate)
    );

    const isValidDate =
      Boolean(+date) && date.getDate() === Number(this.currentDate);
    if (!isValidDate) {
      alert('Please select valid date');
      return;
    }
    this.isLoading = true;
    fetch(
      `https://cors-anywhere.herokuapp.com/https://www.astrology.com/chinese-zodiac`,
      {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        body: `Action=ChooseDate&MonthSelector=${
          Number(this.currentMonth) - 1
        }&DaySelector=${Number(this.currentDate)} &YearSelector=${Number(
          this.currentYear
        )}`,
      }
    )
      .then((data) => data.text())
      .then(
        (data) =>
          (this.url = data
            .split('window.document.location.href = ')
            .pop()
            .split(';')
            .shift()
            .split("'")
            .join(''))
      )
      .then(() =>
        fetch(
          `https://cors-anywhere.herokuapp.com/https://www.astrology.com${this.url}`
        )
          .then((data) => data.text())
          .then((data) => {
            let parser = new DOMParser();
            const document = parser.parseFromString(data, 'text/html');
            this.displayString = document.querySelector('.body').innerHTML;
            this.coverImage = document
              .querySelector('.cover > img')
              .getAttribute('data-original');
            this.isLoading = false;
          })
          .catch((e) => console.log(e))
      )
      .catch((e) => console.log(e));
  }

  changeMonth(value) {
    this.currentMonth = value;
  }

  changeDate(value) {
    this.currentDate = value;
  }

  changeYear(value) {
    this.currentYear = value;
  }

  logout() {
    this.localStorageService.clearItemFromLocalStorage('user');
    this.router.navigate(['login']);
  }
}

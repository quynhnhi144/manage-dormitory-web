import { Injectable } from '@angular/core';
import { GlobalConstants } from '../common/global-constants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { UserAuth } from './user-auth.model';
import { Authority } from './authority.model';
import { catchError, tap } from 'rxjs/operators';

export interface AuthResponseData {
  username: string;
  accessToken: string;
  authorities: Authority[];
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = GlobalConstants.apiURL;
  userAuth = new BehaviorSubject<UserAuth>(null);
  authoritiesString: string[] = [];
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.baseUrl + '/auth/signin', {
        username: username,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData: any) => {
          for (let authority of resData.authorities) {
            this.authoritiesString.push(authority.authority);
            console.log(this.authoritiesString);
          }

          this.handleAuthentication(
            resData.username,
            resData.accessToken,
            this.authoritiesString,
            resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      username: string;
      accessToken: string;
      authorities: string[];
      tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new UserAuth(
      userData.username,
      'Bearer ' + userData.accessToken,
      userData.authorities,
      new Date(userData.tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userAuth.next(loadedUser);
      const expirationDuration =
        new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.userAuth.next(null);
    this.router.navigate(['/auth']);
    this.authoritiesString = [];
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Một lỗi không biết đã xảy ra!!!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    } else {
      errorMessage = 'Username hoặc password là không hợp lệ!!!';
    }
    return throwError(errorMessage);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    username: string,
    accessToken: string,
    authorities: string[],
    expriesIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expriesIn * 1000);
    const userAuth = new UserAuth(
      username,
      accessToken,
      authorities,
      expirationDate
    );
    this.userAuth.next(userAuth);
    this.autoLogout(expriesIn * 1000);
    localStorage.setItem('token', 'Bearer ' + accessToken);
    localStorage.setItem('userData', JSON.stringify(userAuth));
  }
}

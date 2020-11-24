import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userAuth.pipe(
      take(1),
      exhaustMap((userAuth) => {
        // if (!userAuth) {
        //   return next.handle(req);
        // }

        // console.log('userAuthHeader: ' + userAuth.token);
        const modifiedReq = req.clone({
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
          }),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}

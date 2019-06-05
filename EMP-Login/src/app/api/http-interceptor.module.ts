import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.accessToken;
    const language = this.auth.acceptLanguage;
    if (token) {
      const newReq = req.clone(
        {
          headers: req.headers
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .set('Accept-Language', language)
        });
      console.log(newReq);
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true }
  ]
})
export class HttpInterceptorModule { }

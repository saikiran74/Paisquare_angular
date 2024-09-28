import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth-service.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the JWT token from the AuthService
    const token = this.authService.getToken();
    // Check if the token is undefined, missing, or empty
    if (!token || token === 'undefined') {
      // Token is missing or undefined, proceed without the token for the first request
      console.warn('Token is missing or undefined.');

      // Proceed with the request (login request or other request)
      return next.handle(req);
  }

    // Clone the request to add the new header.
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('No token found');
    }

    // Pass the cloned request instead of the original request to the next handler.
    return next.handle(authReq);
  }
}

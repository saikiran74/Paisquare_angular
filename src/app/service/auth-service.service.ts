import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // This method returns the JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Example method for login (storing the token)
  login(token: string) {
    localStorage.setItem('token', token);
  }
  // Example method for logout (removing the token)
  logout() {
    localStorage.removeItem('token');
  }
}

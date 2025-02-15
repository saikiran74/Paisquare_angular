import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  role?: string[]; // Adjust based on your JWT structure
  sub?: string;
  user?:string[];
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(token: string) {
    localStorage.setItem('token', token);
  }
  
  logout() {
    localStorage.removeItem('token');
  }
  
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);

      //const decodedToken: any = jwt.verify(token, this.secretKey); // Verify the token
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      return decodedToken.exp < currentTime; // Compare expiration time
    } catch (error) {
      return true; // If there's an error (invalid token), consider it expired
    }
  }
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  // Method to get user roles from the token
  getUserRoles(): string[] {
    const token = this.getToken();
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken?.role || [];
    }
    return [];
  }
  getUserDetails(): any {
    const token = this.getToken();

    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.user;
    }
    return null;
  }

  // Example method to check if user has a specific role
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}

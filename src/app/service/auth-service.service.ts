import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';


interface DecodedToken {
  exp: number;
  iat: number;
  role?: string[]; // Adjust based on your JWT structure
  sub?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private secretKey: string = 'your_secret_key';

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, this.secretKey) as DecodedToken; 
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }


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
      const decodedToken: any = jwt.verify(token, this.secretKey); // Verify the token
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
      const decoded: DecodedToken | null = this.decodeToken(token);
      return decoded?.role || []; // Adjust based on your JWT payload structure
    }
    return [];
  }
  getUserDetails(): any {
    const token = this.getToken();
    if (token) {
      const decoded: DecodedToken | null = this.decodeToken(token);
      return decoded; // Decode the token to get the claims
    }
    return null;
  }

  // Example method to check if user has a specific role
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}

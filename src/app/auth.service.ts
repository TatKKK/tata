import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from './models/user.model';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: 'patient' | 'doctor' | 'admin' | 'unknown' = 'unknown';

  constructor(private http:HttpClient, private router:Router) { }

  authenticate(login: Login): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>('https://localhost:7042/api/Users/Authenticate', login, httpOptions)
      .pipe(
        tap(res => {
          this.setToken(res.AccessToken);
          this.setUserRole(res.AccessToken);
        }),
        catchError(error => {
          alert(error.error);
          return throwError(() => new Error('Authentication failed'));
        })
      );
  }

setUserRole(token: string): void {
  if (typeof token !== 'string' || token.trim() === '') {
    console.error('Token is not a string or is empty');
    return;
  }
  try {
    const decodedToken = jwtDecode<any>(token);
    this.userRole = decodedToken.role; 
    console.log(this.userRole + " userRole is set");
  } catch (error) {
    console.error('Error decoding token', error);
  }
}

getUserRole(): 'patient' | 'doctor' | 'admin' | 'unknown' {
    return this.userRole;
  }
  isAdmin(): boolean {    
    return this.getUserRole() === 'admin';
  }
  isPatient():boolean{
    return this.getUserRole() === 'patient';
  }
  isDoctor():boolean{
    return this.getUserRole() === 'doctor';
  }


  getUserIdFromToken(token: string): number | null {
    try {
      const decodedToken = jwtDecode<any>(token);
      return +decodedToken['nameid']; //Claimtype rato arao..
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  getUserNameFromToken(token:string):string | null{
    try {
      const decodedToken = jwtDecode<any>(token);    
      const givenName = decodedToken['given_name'] || '';
      const familyName = decodedToken['family_name'] || '';
      return (givenName + ' ' + familyName).trim() || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  getImageUrlFromToken(token: string): string | null {
    try {
      const decodedToken = jwtDecode<any>(token);    
      return decodedToken['ImageUrl'] || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    return this.getUserIdFromToken(token); 
  }

 
  logout(): void {
    this.removeToken();
    this.userRole='unknown';
    this.router.navigate(['/']);
  }
  //-- setters, getters
  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  private removeToken(): void {
    localStorage.removeItem('token');
  }
  

  
}
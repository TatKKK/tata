import { Component } from '@angular/core';
import { Login } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { jwtDecode} from '../../../../node_modules/jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login:Login=new Login();
  greeting:string="";
  token:string="";
  isLoggedIn=false;

  showLoginForm = false;
  isAdmin=false;

  userName: string = '';
userImageUrl:string='';
userRole:string='';


  showAuth=true;

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }
constructor(private router:Router, private authService:AuthService){  
}

authenticate(): void {
  this.authService.authenticate(this.login).subscribe(res => {
    console.log(res.AccessToken);
    this.authService.setToken(res.AccessToken);
    this.authService.setUserRole(res.AccessToken);
    
    const userId = this.authService.getUserId();
    this.userImageUrl = this.authService.getImageUrlFromToken(res.AccessToken) || 'defaultImageUrl';
    this.userName = this.authService.getUserNameFromToken(res.AccessToken) || 'Anonymous User';
    this.userRole=this.authService.getUserRole();
    
    console.log(this.userRole);
    console.log(this.userName);
    
    if (userId !== null) {
      this.showLoginForm = false;
      this.showAuth = false;
      this.isLoggedIn = true;
  
      if (this.userRole === 'admin') { 
        this.router.navigate(['/']); 
      } else {
        this.router.navigate(['/userPage', userId]);
      }
    } else {
      console.error('Could not retrieve user ID from token');
    }
  });
}


logout():void{
  this.authService.logout();
  this.isLoggedIn=false;
  this.showAuth=true;
}

}

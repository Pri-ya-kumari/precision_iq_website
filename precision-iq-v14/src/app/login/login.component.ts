import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''; // empty initially
  password: string = ''; // empty initially

  private allowedEmail: string = 'Iqprecizion@gmail.com';
  private allowedPassword: string = 'Login@1234567';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  login(): void {
  if (
    this.email.trim().toLowerCase() === this.allowedEmail.toLowerCase() &&
    this.password === this.allowedPassword
  ) {
    console.log('Login successful');
    this.router.navigate(['/create-blog']);
  } else {
    alert('Login failed: Invalid email or password.');
  }
}

}



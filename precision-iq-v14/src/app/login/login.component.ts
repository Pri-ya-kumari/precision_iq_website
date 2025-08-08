import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = 'Iqprecizion@gmail.com';
  password: string = 'Login@1234567';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  login(): void {
    this.afAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        console.log('Login successful');
        this.router.navigate(['/create-blog']);
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      });
  }
}

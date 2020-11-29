import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  error: string = null;
  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    this.authService.login(username, password).subscribe(
      (resData: any) => {
        this.route.navigate(['/manage/dashboard']);
        console.log(resData);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
      }
    );
    form.reset();
  }
}

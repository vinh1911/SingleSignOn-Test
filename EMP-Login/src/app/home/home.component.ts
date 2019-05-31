import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  publicResponse: any;
  userResponse: any;
  adminResponse: any;

  constructor(public auth: AuthService, public api: ApiService) { }

  ngOnInit() { }

  get accessToken() {
    return this.auth.accessToken;
  }

  get expiresAt() {
    return this.auth.expiresAt;
  }

  publicApi() {
    this.api.get_public().subscribe((resp: any) => {
      this.publicResponse = resp;
      console.log(resp);
    });
  }

  userApi() {
    this.api.get_user().subscribe((resp: any) => {
      this.userResponse = resp;
      console.log(resp);
    });
  }

  adminApi() {
    this.api.get_admin().subscribe((resp: any) => {
      this.adminResponse = resp;
      console.log(resp);
    });
  }
}

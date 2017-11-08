import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthserviceService } from './authservice.service';
import { config } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title: string;
  constructor(private auth: AuthserviceService, private router: Router) {
    if (auth.isAuthenticated()) {
     // router.navigate(['/main']);
    } else router.navigate(['/login']);
  }
  isLogon: boolean;

  ngOnInit() {
    this.title = "ERP MOBILE";
    this.isLogon = this.auth.isAuthenticated();
    this.auth.authChanged.subscribe(
      (x) => { this.isLogon = x; }
    );
    this.auth.titleChanged.subscribe(
      (t) => { this.title = t; }
    );
  }

  onLogout() {
    this.auth.logOut();
    console.log('log out');
    this.router.navigate(['/login']);
  }
}

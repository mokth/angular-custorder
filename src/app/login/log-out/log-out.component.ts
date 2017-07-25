import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(private auth:AuthserviceService,
              private router:Router) { }

  ngOnInit() {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }

}

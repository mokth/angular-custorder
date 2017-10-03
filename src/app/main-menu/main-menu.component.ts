import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";



@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  fullname:string;
  isopen:boolean=false;
  mobHeight: any;
  mobWidth: any;
  isSmallScreen:boolean;
  constructor(private auth:AuthserviceService,
              private router: Router) {
                this.mobHeight =window.innerHeight;
                this.mobWidth = window.innerWidth;
                if ( this.mobWidth < 500){
                  this.isSmallScreen =true;
                }else {
                  this.isSmallScreen =false;
                }
               }

  ngOnInit() {
     //this.win.nativeWindow.document.getElementById("carousel-logo").click();
     jQuery('#leftClick').trigger('click');
     this.fullname= this.auth.getUserFullname();
  }
 onLogout() {
  this.auth.logOut();
  console.log('log out');
  this.router.navigate(['/login']);
 }
 onToggle(){
   this.isopen=!this.isopen;
   console.log(this.isopen);
 }
}

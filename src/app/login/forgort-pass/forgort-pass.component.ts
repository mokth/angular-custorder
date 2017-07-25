import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";

@Component({
  selector: 'app-forgort-pass',
  templateUrl: './forgort-pass.component.html',
  styleUrls: ['./forgort-pass.component.css']
})
export class ForgortPassComponent implements OnInit {
  rform:FormGroup;
  email:string;
  id:string;
  message:string;
  reseting:boolean=false;

  constructor(private auth:AuthserviceService,
              private router: Router) { }
  
   ngOnInit() {
    this.rform = new FormGroup({
      id: new FormControl(null, Validators.required), 
      email: new FormControl(null, [Validators.email,Validators.required])
     });
    this.auth.resetMsgChanged.subscribe(
        (msg)=>{
           this.message = msg;
           if (msg=='OK'){
              this.message="Successfully reset your password. A new temporary password have sent to your email.";           
           } else {
             this.message=msg;
             this.reseting=false;
           }
        }
      ); 
  }
 
  onReset(){
    this.email= this.rform.get('email').value;
    this.id= this.rform.get('id').value;
    this.reseting=true;
    this.auth.resetPassword(this.id,this.email);
  }
}

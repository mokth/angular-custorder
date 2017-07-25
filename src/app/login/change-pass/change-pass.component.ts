import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {
  rform:FormGroup;
  oldpass:string;
  pass1:string;
  pass2:string;
  id:string;
  message:string;
  changed:boolean=false;
  reseting:boolean=false;

   constructor(private auth:AuthserviceService,
               private router: Router) { }

  ngOnInit() {
      this.rform = new FormGroup({
      id: new FormControl(null, Validators.required), 
      oldpass: new FormControl(null, Validators.required), 
      newpass: new FormControl(null, Validators.required), 
      newpass1: new FormControl(null, Validators.required)
     });
     this.auth.changeMsgChanged.subscribe(
        (msg)=>{
           this.message = msg;
           if (msg=='OK'){
              this.changed=true;
              this.message="Successfully changed password.";
           } else {
             this.message=msg;
             this.reseting=false;
           }
        }
      ); 
  }
  onBack(){
    this.router.navigate(['/main']);
  }
  onChange(){
    this.id= this.rform.get('id').value;
    this.oldpass= this.rform.get('oldpass').value;
    this.pass1= this.rform.get('newpass').value;
    this.pass2= this.rform.get('newpass1').value;
    this.message="";
    if (this.pass1!=this.pass2){
      this.message="The new passwod does not match...";
      return;
    }
    
    this.reseting=true;
    this.auth.changePassword(this.id,this.pass1,this.oldpass);
  }
}

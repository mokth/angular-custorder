import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Http,Headers } from "@angular/http";
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";
import { CanComponentDeactivate } from "app/canDeactivateGuard";
import { Observable } from "rxjs/Observable";
import { CustomerProfile } from 'app/entities/models';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit,CanComponentDeactivate {
  rform:FormGroup;
  profile:CustomerProfile;
  changesSaved:boolean=false;
  message:string;

  constructor(private auth:AuthserviceService,
              private http:Http,
              private router:Router,
              @Inject('API_URL') private apiUrl:string) { }

  ngOnInit() {
       this.rform = new FormGroup({
       name: new FormControl(null, Validators.required),
       addr1: new FormControl(null, Validators.required),
       addr2: new FormControl(null, Validators.required),
       addr3: new FormControl(null, null),
       addr4: new FormControl(null, null),
       country: new FormControl(null, null),
       city: new FormControl(null, null),
       state: new FormControl(null, null),
       postal: new FormControl(null, Validators.required),
       email: new FormControl(null, Validators.email),
       website: new FormControl(null),
       contact: new FormControl(null, Validators.required),
       ctemail: new FormControl(null,[Validators.required, Validators.email]),
       cttel: new FormControl(null, Validators.required),
       ctfax: new FormControl(null, null)
     });
    this.getprofile();
  }
 
  getprofile() {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', this.auth.getAuthToken()); 
     this.http.get(this.apiUrl+'api/cust/profile?id='+this.auth.getUserID(),
                 { headers: headers })
                  .subscribe(
                    (resp)=>{
                      this.profile =resp.json();
                      this.displayProfile();
                    },
                    (err)=>{
                      console.log(err)
                    }
            );
   }
  
    updateProfile() {
     let headers = new Headers();
     let body = JSON.stringify(this.profile);
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', this.auth.getAuthToken()); 
     this.http.post(this.apiUrl+'api/cust/updateprf',
                    body,{ headers: headers })
        .subscribe(
        (resp)=>{
          let result =resp.json();
          try{
              console.log(resp.json());
               if (result.ok=='OK'){
                  this.message='Profile successfully updated.'; 
              }else this.message='Error updating profile.';

          }catch(e)
          { }
        },
        (err)=>{
        },
        ()=>{
          console.log('Complete post change')
        }
      )
   }
  
  displayProfile(){
     this.rform.get('name').setValue(this.profile.name);
     this.rform.get('addr1').setValue(this.profile.addr1);
     this.rform.get('addr2').setValue(this.profile.addr2);
     this.rform.get('addr3').setValue(this.profile.addr3);
     this.rform.get('addr4').setValue(this.profile.addr4);
     this.rform.get('country').setValue(this.profile.country);
     this.rform.get('postal').setValue(this.profile.postal);
     this.rform.get('city').setValue(this.profile.city);
     this.rform.get('state').setValue(this.profile.state);
     this.rform.get('website').setValue(this.profile.website);
     this.rform.get('email').setValue(this.profile.email);
     this.rform.get('contact').setValue(this.profile.contact);
     this.rform.get('ctemail').setValue(this.profile.contactemail);
     this.rform.get('cttel').setValue(this.profile.contacttel);
     this.rform.get('ctfax').setValue(this.profile.contactfax);
  }

  onConfirm(){
       this.profile.code= this.auth.getUserID();
       this.profile.name=  this.rform.get('name').value;
       this.profile.addr1=  this.rform.get('addr1').value;
       this.profile.addr2=  this.rform.get('addr2').value;
       this.profile.addr3=  this.rform.get('addr3').value;
       this.profile.addr4=  this.rform.get('addr4').value;
       this.profile.country=  this.rform.get('country').value;
       this.profile.postal=  this.rform.get('postal').value;
       this.profile.state=  this.rform.get('state').value;
       this.profile.city =  this.rform.get('city').value;
       this.profile.email =  this.rform.get('email').value;
       this.profile.website =  this.rform.get('website').value;
       this.profile.contact =  this.rform.get('contact').value;
       this.profile.contactemail =  this.rform.get('ctemail').value;
       this.profile.contacttel =  this.rform.get('cttel').value;
       this.profile.contactfax =  this.rform.get('ctfax').value;
       this.changesSaved=true;
       this.updateProfile();
  }
  onBack(){
     this.router.navigate(['main']);
  }
  
   canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
      if (this.rform.dirty && !this.changesSaved){
        return confirm('Do you want to discard this order?');
      } else {
        return true;
      }    
  };
}

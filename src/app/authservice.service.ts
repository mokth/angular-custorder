import { config } from './config';
import { Http, Headers, RequestOptions, RequestMethod } from "@angular/http";
import { Injectable, Inject } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { AuthHttp, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthserviceService {
  authChanged = new Subject<boolean>();
  authMsgChanged = new Subject<string>();
  resetMsgChanged = new Subject<string>();
  changeMsgChanged = new Subject<string>();
  titleChanged = new Subject<string>();
  isvalidUser:boolean=false;
  jwtHelper: JwtHelper = new JwtHelper();
  userId:string;
  fullName:string;

  constructor(private http:Http,@Inject('API_URL') private apiUrl:string) { }

  logIn(name: string, password: string) {
      let body = JSON.stringify({	"name":name,"password":password,"fullanme":""});
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');        
      this.http.post(this.apiUrl+'api/auth/jwt',
                    body,{ headers: headers })
        .subscribe(
        (resp)=>{
          let token =resp.json();
          try{
                this.jwtHelper.isTokenExpired(token);
                this.isvalidUser =resp.ok;
                this.userId=name;
                console.log(resp.json());
                localStorage.setItem('_token', resp.json())
                this.isvalidUser =true;
                this.authChanged.next(true);
          }catch(e)
          {
            this.authMsgChanged.next('Invalid user name / password.');
            this.authChanged.next(false);
          }
        },
        (err)=>{
          console.log(err)
          this.authMsgChanged.next('Error '+err);
          this.authChanged.next(false);
        },
        ()=>{
          console.log('Complete post login')
        }
      )
   
  }

  resetPassword(name: string, email: string) {
      let body = JSON.stringify({	"name":name,"fullname":email,"password":""});
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.apiUrl+'api/auth/reset',
                    body,{ headers: headers })
        .subscribe(
        (resp)=>{
          let result =resp.json();
          try{
              console.log(resp.json());
               if (result.ok=='OK')
                   this.resetMsgChanged.next(result.ok);
               else this.resetMsgChanged.next(result.error);
          }catch(e)
          { }
        },
        (err)=>{
        },
        ()=>{
          console.log('Complete post reset')
        }
      )   
  }

   changePassword(name: string, newpass: string,oldpass:string) {
      let body = JSON.stringify({	"name":name,"fullname":oldpass,"password":newpass});
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.apiUrl+'api/auth/change',
                    body,{ headers: headers })
        .subscribe(
        (resp)=>{
          let result =resp.json();
          try{
              console.log(resp.json());
               if (result.ok=='OK')
                   this.changeMsgChanged.next(result.ok);
               else this.changeMsgChanged.next(result.error);
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

  logOut() {
    this.isvalidUser =false;
     this.authChanged.next(false);
     localStorage.removeItem('_token');
  }

   isAuthenticated() {
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          isvalid =!this.jwtHelper.isTokenExpired(token);
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    console.log('isvalid'+isvalid);
    return isvalid;
  }

  getUserID(){
    this.userId ="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          var decode= this.jwtHelper.decodeToken(token);
          this.userId = decode.aud;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return this.userId;
  }

  getAuthToken(){
    let authToken="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          var decode= this.jwtHelper.decodeToken(token);
          authToken = decode.aud+";"+token;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return authToken;
  }

  getUserFullname(){
    this.userId ="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          var decode= this.jwtHelper.decodeToken(token);
          this.fullName = decode.sub;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return this.fullName;
  }
}

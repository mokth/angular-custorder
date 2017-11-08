import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthserviceService } from "app/authservice.service";
//import { $ } from 'protractor';
import { Http, Headers } from '@angular/http';


@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})


export class ChangePassComponent implements OnInit {
  rform: FormGroup;
  oldpass: string;
  pass1: string;
  pass2: string;
  id: string;
  message: string;
  changed: boolean = false;
  reseting: boolean = false;

 

  constructor(private auth: AuthserviceService,
    private http: Http,
    private router: Router) { }


  // private loadExternalScript(scriptUrl: string) {
  //   return new Promise((resolve, reject) => {
  //     const scriptElement = document.createElement('script')
  //     scriptElement.src = scriptUrl
  //     scriptElement.onload = resolve
  //     document.body.appendChild(scriptElement)
  //   })
  // }

  // ngAfterViewInit(): void {

  //   this.loadExternalScript('https://www.paypalobjects.com/api/checkout.js').then(() => {
  //     paypal.Button.render({
  //       env: 'sandbox',
  //       client: {
  //         sandbox: 'AYbrkucvnPBFbJavnW--hWsrpjntGL2-rVTyQWIRqM_zdL5kQAmloRYgIvJrpXkuSreGd2itN1iVr1gX',
  //         production: '<insert production client id>'
  //       },
  //       commit: true,
  //       payment: function (data, actions) {
  //         return actions.payment.create({
  //           payment: {
  //             transactions: [
  //               {
  //                 amount: { total: '1.00', currency: 'USD' }
  //               }
  //             ]
  //           }
  //         })
  //       },
  //       onAuthorize: function (data, actions) {
  //         return actions.payment.execute().then(function (payment) {
  //           // TODO
  //         })
  //       }
  //     }, '#paypal-button');
  //   });
  // }

  ngOnInit() {



    this.rform = new FormGroup({
      id: new FormControl(null, Validators.required),
      oldpass: new FormControl(null, Validators.required),
      newpass: new FormControl(null, Validators.required),
      newpass1: new FormControl(null, Validators.required)
    });
    this.auth.changeMsgChanged.subscribe(
      (msg) => {
        this.message = msg;
        if (msg == 'OK') {
          this.changed = true;
          this.message = "Successfully changed password.";
        } else {
          this.message = msg;
          this.reseting = false;
        }
      }
    );
  }
  onBack() {
    this.router.navigate(['/main']);
  }
  onChange() {
    this.id = this.rform.get('id').value;
    this.oldpass = this.rform.get('oldpass').value;
    this.pass1 = this.rform.get('newpass').value;
    this.pass2 = this.rform.get('newpass1').value;
    this.message = "";
    if (this.pass1 != this.pass2) {
      this.message = "The new passwod does not match...";
      return;
    }

    this.reseting = true;
    this.auth.changePassword(this.id, this.pass1, this.oldpass);
  }

  // onChange() {
  //   let body = 'grant_type=client_credentials';
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'x-www-form-urlencoded');
  //   //headers.append('grant_type', 'client_credentials');
  //   headers.append('authorization', 'Basic QVlicmt1Y3ZuUEJGYkphdm5XLS1oV3NycGpudEdMMi1yVlR5UVdJUnFNX3pkTDVrUUFtbG9SWWdJdkpycFhrdVNyZUdkMml0TjFpVnIxZ1g6RUlqTU93dVp3YUhEZGs5VjhBVm93YnNHLVpIR0t2clBsdnpFVFZWQmNDYWYxeE5nUFMySnJ5QTRqeEVqRjNoNWVDR2IwZXVwcVk4MEFsWkM=');
  //   this.http.post('https://api.sandbox.paypal.com/v1/oauth2/token',
  //     body, { headers: headers })
  //     .subscribe(
  //     (resp) => {
  //       let token = resp.json();
  //       try {
  //         console.log(token);
  //         console.log(token.access_token);
  //         this.paypayment(token.access_token)
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //     () => {
  //       console.log('Complete post login');
  //     }
  //     );
  // }

  // paypayment(token) {
  //   let body = {
  //     intent: "sale",
  //     redirect_urls: {
  //       return_url: "http://localhost:4200/change",
  //       cancel_url: "http://localhost:4200/change"
  //     },
  //     payer: {
  //       "payment_method": "paypal"
  //     },
  //     transactions: [{
  //       amount: {
  //         total: "1.00",
  //         currency: "MYR"
  //       }
  //     }]
  //   };
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   //headers.append('grant_type', 'client_credentials');
  //   headers.append('authorization', 'Bearer ' + token);
  //   this.http.post('https://api.sandbox.paypal.com/v1/payments/payment',
  //     body, { headers: headers })
  //     .subscribe(
  //     (resp) => {
  //       let token = resp.json();
  //       try {
  //         console.log(token);


  //       } catch (e) {
  //         console.log(e);
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //     () => {
  //       console.log('Complete post login');
  //     }
  //     );
  // }

}

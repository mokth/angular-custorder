import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as ngCore from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLookupModule } from 'devextreme-angular/ui/lookup';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthserviceService } from 'app/authservice.service';
import { MainMenuComponent } from 'app/main-menu/main-menu.component';
import { AuthguardService } from 'app/authguard.service';
import { config } from './config';
import { CanDeactivateGuard } from 'app/canDeactivateGuard';
import { NewOrderComponent } from './new-order/new-order.component';
import { ConfirmOrderComponent } from './new-order/confirm-order/confirm-order.component';
import { OrderHisComponent } from './order-his/order-his.component';
import { LogOutComponent } from './login/log-out/log-out.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ForgortPassComponent } from './login/forgort-pass/forgort-pass.component';
import { ChangePassComponent } from './login/change-pass/change-pass.component';
import { WindowRef } from 'app/shared/window-ref';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'main', component: MainMenuComponent, canActivate: [AuthguardService] },
  { path: 'login',component:LoginComponent},
  { path: 'logout',component:LogOutComponent},
  { path: 'forgot',component:ForgortPassComponent},
  { path: 'change',component:ChangePassComponent, canActivate: [AuthguardService] },
  { path: 'order/:mode',component:NewOrderComponent,canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]},
  { path: 'confirm/:mode',component: ConfirmOrderComponent,canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]},
  { path: 'sohis',component: OrderHisComponent,canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]},
  { path: 'profile',component:UserProfileComponent,canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]},
  
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainMenuComponent,
    NewOrderComponent,
    ConfirmOrderComponent,
    OrderHisComponent,
    LogOutComponent,
    UserProfileComponent,
    ForgortPassComponent,
    ChangePassComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DxDataGridModule,
    DxLookupModule,
    DxTextAreaModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthserviceService,
              AuthguardService,
              CanDeactivateGuard,
              WindowRef,
              {provide:'API_URL',useValue: config.apiUrl}
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }

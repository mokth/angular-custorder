import { Injectable } from '@angular/core';
import { AuthserviceService } from 'app/authservice.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from "@angular/router";


@Injectable()
export class AuthguardService implements CanActivate {
 constructor(private authService:AuthserviceService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.debug(this.authService.isAuthenticated());
    return this.authService.isAuthenticated();
  }

}

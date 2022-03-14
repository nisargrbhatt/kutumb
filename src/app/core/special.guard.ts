import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpecialGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map((user) => (user && user.roles?.special ? true : false)),
      tap((isAdmin) => {
        if (!isAdmin) {
          console.error('Access denied - Admins only');
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import { Observable, Observer, of, timer } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    redirectUri: AUTH_CONFIG.callbackURL,
    responseType: 'token id_token',
    scope: 'openid',
    audience: 'https://localhost:5001/api/values'
  });

  // tslint:disable: variable-name
  private _accessToken: string;
  private _expiresAt: number;

  userProfile: any;
  refreshSubscription: any;
  observer: Observer<boolean>;
  ssoAuthComplete$: Observable<boolean> = new Observable(
    obs => (this.observer = obs)
  );

  constructor(public router: Router) {
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }


  get expiresAt(): number {
    return this._expiresAt;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        console.log('Auth handle called');
        console.log(authResult);
        this.localLogin(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  public getProfile(cb): void {
    if (!this._accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  private localLogin(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = authResult.expiresIn * 1000 + Date.now();
    this._accessToken = authResult.accessToken;
    this._expiresAt = expiresAt;

    this.scheduleRenewal();
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._expiresAt = 0;
    this.unscheduleRenewal();

    this.auth0.logout({
      returnTo: window.location.origin
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this._accessToken && Date.now() < this._expiresAt;
  }

  public renewTokens() {
    this.auth0.checkSession({}, (err, result) => {
      if (result && result.accessToken && result.idToken) {
        console.log('Renew tokens called');
        console.log(result);
        this.localLogin(result);
        this.observer.next(true);
      } else if (err) {
        console.log(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.observer.next(true);
      }
    });
  }

  public scheduleRenewal() {
    if (!this.isAuthenticated()) { return; }
    this.unscheduleRenewal();

    const expiresAt = this._expiresAt;

    const source = of(expiresAt).pipe(
      mergeMap(expiresAt => {
        const now = Date.now();

        // Use the delay in a timer to
        // run the refresh at the proper time
        return timer(Math.max(1, expiresAt - now));
      })
    );
    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSubscription = source.subscribe(() => {
      this.renewTokens();
      this.scheduleRenewal();
    });
  }

  public unscheduleRenewal() {
    if (!this.refreshSubscription) { return; }
    this.refreshSubscription.unsubscribe();
  }
}

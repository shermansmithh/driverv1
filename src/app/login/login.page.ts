import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ENABLE_SIGNUP } from 'src/environments/environment.prod';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {



  ngOnInit() {
  }

  email: string = "";
  password: string = "";
  isRegisterEnabled: any = true;
  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private commonService: CommonService,
    private router: Router,
    private menuCtrl: MenuController

  ) {
    this.isRegisterEnabled = ENABLE_SIGNUP;
    this.menuCtrl.enable(false);
  }


  reset() {
    if (this.email) {
      this.authService.resetPassword(this.email)
        .then(data => this.commonService.showToast('Please Check inbox'))
        .catch(err => this.commonService.showToast(err.message));
    }
  }

  login() {
    if (this.email.length == 0 || this.password.length == 0) {
      this.commonService.showAlert("Invalid Credentials");
    }
    else {

      this.commonService.showLoader('Authenticating...');
      this.authService.login(this.email, this.password).then(authData => {

        this.commonService.hideLoader();
        this.router.navigateByUrl('/home');
      }, error => {
        this.commonService.hideLoader();
        this.commonService.showToast(error.message);
      });
    }

  }

}

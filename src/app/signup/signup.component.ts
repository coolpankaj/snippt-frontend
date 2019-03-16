import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private appService: AppService,
    public toastr: ToastrManager,
    public router: Router
  ) {}
  signupForm = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [null, Validators.required],
    userName: ['', Validators.required],
    isAlumni: [false]
  });

  ngOnInit() {}

  onSubmit() {
    this.appService.signUp(this.signupForm.value).subscribe((apiResponse: any) => {
        if (apiResponse.status === 200) {
          this.toastr.successToastr(' ! SignUp Successful');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.toastr.errorToastr(apiResponse.message);
        }
      }, (err) => {
        this.toastr.errorToastr(`${err.message}`);
      });
  }
}

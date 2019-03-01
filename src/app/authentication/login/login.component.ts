import { Component, OnInit, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    errorCredentials: boolean = false;

    f: FormGroup;
    teste: any;

    constructor(public router: Router, public toastr: ToastsManager,
        vcr: ViewContainerRef, private fb: FormBuilder,
        private authService: AuthService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.f = this.fb.group({
            email: ['', [Validators.required]],
            senha: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngAfterViewInit() {
        $(function () {
            $(".preloader").fadeOut();
        });
        $(function () {
            (<any>$('[data-toggle="tooltip"]')).tooltip()
        });
        $('#to-recover').on("click", function () {
            $("#loginform").slideUp();
            $("#recoverform").fadeIn();

        });
        //request via JQuery  para fins de conhecimento - Robson Mendes
        // $('#loginform').on("click", function() {
        //     console.log($('#email').val());
        //     console.log($('#password').val());
        //  }); 
    }

    onSubmit() {
        this.authService.login(this.f)
            .first()
            .subscribe(data => {
                this.teste = data;
                if (this.teste.token !== null) {
                    console.log('token null' + this.teste.token);
                    this.showSuccess();
                    this.router.navigate(['/dashboard/dashboard1']);
                }
                else {
                    console.log('token is not null' + this.teste.token);
                    this.showError();
                }
            });
    }

    showSuccess() {
        this.toastr.success('Login Efetuado com Sucesso.', 'Success!');
    }

    showError() {
        this.toastr.error('Login ou senha inválido', 'Ops!');
    }
    showErrorAplicacao() {
        this.toastr.error('Algo deu Errado', 'Oops!');
    }
}

import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName, FormControl } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../usuario.service';

@Component({
    selector: 'app-adicionar-usuario',
    templateUrl: './adicionar-usuario.component.html',
    styleUrls: []
})
export class AdicionarUsuarioComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public usuario: Usuario;
    public usuarioForm: FormGroup;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    swal: SweetAlertAdviceService;
    public errors: any[] = [];

    constructor(
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
        private router: Router) {

        this.validationMessages = {
            primeiroNome: {
                required: 'O Primeiro Nome é requerido.',
                minlength: 'O Primeiro Nome precisa ter no mínimo 2 caracteres',
                maxlength: 'O Primeiro Nome precisa ter no máximo 100 caracteres'
            },
            ultimoNome: {
                required: 'O Último Nome é requerido.',
                minlength: 'O Último Nome precisa ter no mínimo 2 caracteres',
                maxlength: 'O Último Nome precisa ter no máximo 100 caracteres'
            },
            usuarioNome: {
                required: 'O Nome do Usuário é requerido.',
                minlength: 'O Nome do Usuário precisa ter no mínimo 2 caracteres',
                maxlength: 'O Nome do Usuário precisa ter no máximo 50 caracteres'
            },
            email: {
                required: 'O E-mail é requerido.',
                email: 'E-mail inválido.'
            },
            senha: {
                required: 'A Senha é requerida.',
                minlength: 'A Senha precisa ter no mínimo 8 caracteres'
            },
            senhaConfirmacao: {
                required: 'A Senha Confirmação é requerida.',
                minlength: 'A Senha precisa ter no mínimo 8 caracteres',
                equalTo : "As senhas não conferem"
            }

        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.usuario = new Usuario();
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit(): void {
        let senha = new FormControl('', [Validators.required, Validators.minLength(6)]);
        let senhaConfirmacao = new FormControl('', [Validators.required, Validators.minLength(8), CustomValidators.equalTo(senha)]);
    

        this.usuarioForm = this.fb.group({
            id: 0,
            primeiroNome: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100)]],
            ultimoNome: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100)]],
            usuarioNome: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)]],
            email: ['', [Validators.required,
            CustomValidators.email]],
            senha: senha,
            senhaConfirmacao: senhaConfirmacao
        });
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.usuarioForm);
        });
    }

    adicionarUsuario() {
        if (this.usuarioForm.dirty && this.usuarioForm.valid) {
            let p = Object.assign({}, this.usuario, this.usuarioForm.value);

            this.usuarioService.adicionarUsuario(p)
                .subscribe(
                    result => {
                        this.swal.showSwalSuccess('Usuário Adicionado com Sucesso!');
                        this.router.navigate(['usuario/lista']);
                    },
                    error => {
                        console.error(error)
                    })
        }
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    cancelar() {
        this.router.navigate(['usuario/lista']);
    }

}
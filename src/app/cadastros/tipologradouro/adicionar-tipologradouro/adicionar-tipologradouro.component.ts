import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';

import { TipoLogradouroService } from '../tipologradouro.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TipoLogradouro } from '../models/tipologradouro';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

@Component({
    selector: 'app-adicionar-tipologradouro',
    templateUrl: './adicionar-tipologradouro.component.html',
    styleUrls: []
})

export class AdicionarTipoLogradouroComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public tipologradouro: TipoLogradouro;
    public tipologradouroForm: FormGroup;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    
    swal: SweetAlertAdviceService;
    public errors: any[] = [];

    constructor(
        private tipoLogradouroService: TipoLogradouroService,
        private fb: FormBuilder,
        private router: Router) {

        this.validationMessages = {
            codigo: {
                required: 'O Código é requerido.',
                minlength: 'O Código precisa ter no mínimo 2 caracteres',
                maxlength: 'O Código precisa ter no máximo 20 caracteres'
            },
            sigla: {
                required: 'A Sigla é requerida.',
                minlength: 'A Sigla precisa ter no mínimo 1 caracteres',
                maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
            },
            abreviacao: {
                required: 'A Abreviação é requerida.',
                minlength: 'A Abreviação precisa ter no mínimo 2 caracteres',
                maxlength: 'A Abreviação precisa ter no máximo 10 caracteres'
            },
            descricao: {
                required: 'A Descrição é requerida.',
                minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
                maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
            },

        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.tipologradouro = new TipoLogradouro();
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit(): void {
        this.tipologradouroForm = this.fb.group({
            codigo: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20)]],
            sigla: ['', [Validators.required,
            Validators.minLength(1),
            Validators.maxLength(10)]],
            abreviacao:['',[Validators.required, Validators.minLength(2),
            Validators.maxLength(10)]],
            descricao: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]]
        });
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.tipologradouroForm);
        });
    }

    adicionarTipoLogradouro() {
        if (this.tipologradouroForm.dirty && this.tipologradouroForm.valid) {
            let p = Object.assign({}, this.tipologradouro, this.tipologradouroForm.value);

            this.tipoLogradouroService.AdicionarTipoLogradouro(p)
                .subscribe(
                result => {
                    this.swal.showSwalSuccess('Tipo de Logradouro Adicionado com Sucesso!');
                    this.router.navigate(['tipologradouro/lista']);
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
        this.router.navigate(['tipologradouro/lista']);
    }

}

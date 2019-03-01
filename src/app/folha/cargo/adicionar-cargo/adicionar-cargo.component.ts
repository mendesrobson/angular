import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';

import { CargoService } from '../cargo.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Cargo, CargoCbo } from '../models/cargo';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { CargoComponent } from '../cargo.component';

@Component({
    selector: 'app-adicionar-cargo',
    templateUrl: './adicionar-cargo.component.html',
    styleUrls: []
})

export class AdicionarCargoComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public cargo: Cargo;
    public cargoForm: FormGroup;

    displayMessage: { [key: string]: string } = {};

    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    swal: SweetAlertAdviceService;
    public errors: any[] = [];

    constructor(
        private cargoService: CargoService,
        private fb: FormBuilder,
        private router: Router,
        private cargoComponent: CargoComponent, ) {

        this.cargoComponent.Excluido = false;
        
        this.validationMessages = {
            grupoEmpresaId:
            {
                required: 'Grupo requerido.'
            },
            empresaId: {
                required: 'Empresa requerida.'
            },
            codigo: {
                required: 'O Código é requerido.',
                minlength: 'O Código precisa ter no mínimo 2 caracteres',
                maxlength: 'O Código precisa ter no máximo 20 caracteres'
            },
            sigla: {
                required: 'A Sigla é requerida.',
                minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
                maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
            },
            descricao: {
                required: 'A Descrição é requerida.',
                minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
                maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
            },

        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.cargo = new Cargo();        
        this.swal = new SweetAlertAdviceService();
        this.cargoComponent.Cargo.cargoCbo = new Array();
    }

    ngOnInit(): void {
        this.cargoForm = this.fb.group({
            id: 0,
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            codigo: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20)]],
            sigla: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(10)]],
            descricao: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            excluido: 'N',
            cargoRegulamentado: 'N',
            cargoLiberal: 'N',
            horaAtividade: 'N'
            
        });

        this.cargoService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                () => this.errors);

        this.cargoService.obterTodosEmpresa()
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => this.errors);
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.cargoForm);
        });
    }

    adicionarCargo() {
        if (this.cargoForm.dirty && this.cargoForm.valid) {
            let p = Object.assign({}, this.cargo, this.cargoForm.getRawValue());

            p.cargoCbo = this.cargoComponent.Cargo.cargoCbo;
            
            for (var i = 0; i < p.cargoCbo.length; i++) {
                p.cargoCbo[i].id = 0;
                p.cargoCbo[i].cargoId = 0;
                p.cargoCbo[i].cbo = null;
            }

            console.log(p);
            this.cargoService.adicionarCargo(p)
                .subscribe(
                    result => {
                        if (result) {
                            this.swal.showSwalSuccess('Cargo Adicionado com Sucesso!');
                            this.router.navigate(['cargo/lista']);
                        } else {
                            this.swal.showSwalErro('Ocorreu um erro ao gravar!');
                        }

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
        this.router.navigate(['cargo/lista']);
    }

}


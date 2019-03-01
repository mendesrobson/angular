import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoEndereco } from '../models/tipoendereco';
import { TipoEnderecoService } from '../tipoendereco.service';

@Component({
  selector: 'app-adicionar-tipoendereco',
  templateUrl: './adicionar-tipoendereco.component.html',
  styleUrls: []
})
export class AdicionarTipoenderecoComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public tipoEndereco: TipoEndereco;
    public tipoEnderecoForm: FormGroup;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    
    swal: SweetAlertAdviceService;
    public errors: any[] = [];

    constructor(
        private tipoEnderecoService: TipoEnderecoService,
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
        this.tipoEndereco = new TipoEndereco();
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit(): void {
        this.tipoEnderecoForm = this.fb.group({
            id: 0,
            codigo: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20)]],
            sigla: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(10)]],
            descricao: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            excluido: 'N'
        });

    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.tipoEnderecoForm);
        });
    }

    adicionarTipoEndereco() {
        if (this.tipoEnderecoForm.dirty && this.tipoEnderecoForm.valid) {
            let p = Object.assign({}, this.tipoEndereco, this.tipoEnderecoForm.value);

            this.tipoEnderecoService.AdicionarTipoEndereco(p)
                .subscribe(
                result => {
                    this.swal.showSwalSuccess('Tipo de Endereco, Adicionado com Sucesso!');
                    this.router.navigate(['tipoendereco/lista']);
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
        this.router.navigate(['tipoendereco/lista']);
    }

}

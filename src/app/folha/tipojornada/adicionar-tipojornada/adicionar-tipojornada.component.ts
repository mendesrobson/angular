import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoJornadaService } from './../tipojornada.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoJornada } from '../models/tipojornada';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';

@Component({
  selector: 'app-adicionar-tipojornada',
  templateUrl: './adicionar-tipojornada.component.html',
  styleUrls: []
})
export class AdicionarTipojornadaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements : ElementRef[];

  public tipoJornada : TipoJornada;
  public tipoJornadaForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoJornadaService : TipoJornadaService,
    private fb: FormBuilder,
    private router: Router) {

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
        this.tipoJornada = new TipoJornada();
        this.swal = new SweetAlertAdviceService();

  }
  ngOnInit() {
    this.tipoJornadaForm = this.fb.group({
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
            excluido: 'N'
    });
    this.tipoJornadaService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas;
    },
    error => this.errors);

    this.tipoJornadaService.obterTodosEmpresa()
    .subscribe(empresas => {
      this.empresas = empresas;
    },
    error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.tipoJornadaForm);
    });

  }

  adicionarTipoJornada() {
    if (this.tipoJornadaForm.dirty && this.tipoJornadaForm.valid) {
        const p = Object.assign({}, this.tipoJornada , this.tipoJornadaForm.value);

        this.tipoJornadaService.adicionarTipoJornada(p)
            .subscribe(
            result => {
                this.swal.showSwalSuccess('Tipo Jornada Adicionado com Sucesso!');
                this.router.navigate(['tipojornada/lista']);
            },
            error => {
                console.error(error);
            });
    }
}
  onError(error) {
  this.errors = JSON.parse(error._body).errors;
 }

  cancelar() {
  this.router.navigate(['tipojornada/lista']);
 }
}

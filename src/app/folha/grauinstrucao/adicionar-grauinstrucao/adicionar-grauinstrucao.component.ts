import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrauInstrucao } from '../models/grauinstrucao';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrauInstrucaoService } from '../grauinstrucao.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-adicionar-grauinstrucao',
  templateUrl: './adicionar-grauinstrucao.component.html',
  styleUrls: []
})
export class AdicionarGrauInstrucaoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public grauInstrucao: GrauInstrucao;
  public grauInstrucaoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private grauInstrucaoService: GrauInstrucaoService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      codigoRais: {
        required: 'Empresa requerida.'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      codigoEsocial: {
        required: 'Total de horas requerida.'
      },
      codigoCaged: {
        required: 'Tipo Jornada requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 60 caracteres'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.grauInstrucao = new GrauInstrucao();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.grauInstrucaoForm = this.fb.group({
      id: 0,
      codigoRais: ['', [Validators.required]],
      codigoEsocial: ['', [Validators.required]],
      codigoCaged: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      codigo: '',
      sigla: '',
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.grauInstrucaoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        error => console.log(this.errors)
      );
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.grauInstrucaoForm);
    });
  }

  adicionarGrauInstrucao() {
    if (this.grauInstrucaoForm.dirty && this.grauInstrucaoForm.valid) {
      const p = Object.assign({}, this.grauInstrucao, this.grauInstrucaoForm.value);

      this.grauInstrucaoService.adicionarGrauInstrucao(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Grau de Instrução Adicionado com Sucesso!');
            this.router.navigate(['grauinstrucao/lista']);
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
    this.router.navigate(['grauinstrucao/lista']);
  }

}

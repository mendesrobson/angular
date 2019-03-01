import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { SitGeradoraAcidenteTrabalho } from '../models/sitgeradoraacidentetrabalho';
import { GrupoEmpresa, Empresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { SitGeradoraAcidenteTrabalhoService } from '../sitgeradoraacidentetrabalho.service';

@Component({
  selector: 'app-adicionar-sitgeradoraacidentetrabalho',
  templateUrl: './adicionar-sitgeradoraacidentetrabalho.component.html',
  styleUrls: []
})
export class AdicionarSitgeradoraacidentetrabalhoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho;
  public sitGeradoraAcidenteTrabalhoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private sitGeradoraAcidenteTrabalhoService: SitGeradoraAcidenteTrabalhoService,
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
            maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
        },
        descricao: {
            required: 'A Descrição é requerida.',
            minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
            maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
        }
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.sitGeradoraAcidenteTrabalho = new SitGeradoraAcidenteTrabalho();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    this.sitGeradoraAcidenteTrabalhoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.sitGeradoraAcidenteTrabalhoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.sitGeradoraAcidenteTrabalhoForm);
    });
  }

  adicionarSituacaoGeradoraAcidenteTrabalho() {
    if (this.sitGeradoraAcidenteTrabalhoForm.dirty && this.sitGeradoraAcidenteTrabalhoForm.valid) {
      const p = Object.assign({}, this.sitGeradoraAcidenteTrabalho, this.sitGeradoraAcidenteTrabalhoForm.value);

      this.sitGeradoraAcidenteTrabalhoService.adicionarSitGeradoraAcidenteTrabalho(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Situação Geradora do Acidente de trabalho adicionado com sucesso!');
              this.router.navigate(['sitgeradoraacidentetrabalho/lista']);
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
    this.router.navigate(['sitgeradoraacidentetrabalho/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.sitGeradoraAcidenteTrabalhoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}

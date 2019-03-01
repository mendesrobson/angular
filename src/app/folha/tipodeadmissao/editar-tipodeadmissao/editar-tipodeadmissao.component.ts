import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, MaxLengthValidator } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { TipoDeAdmissaoService } from '../tipodeadmissao.service';

import { TipoDeAdmissao } from '../models/tipodeadmissao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';


@Component({
  selector: 'app-editar-tipodeadmissao',
  templateUrl: './editar-tipodeadmissao.component.html',
  styleUrls: []
})
export class EditarTipodeadmissaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipodeadmissao: TipoDeAdmissao;
  public tipoDeAdmissaoForm: FormGroup;
  public tipoDeAdmissaoId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoDeAdmissaoService: TipoDeAdmissaoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) 
    {

        this.validationMessages = {

          grupoEmpresaId:
          {
            required: 'Grupo requerido!'
          },
          empresaId: {
            required: 'Empresa requerida!'
          },
          codigoRais:{
            required: 'Código Rais requerido!',
            maxlength: 'O código Rais deve ter no máximo 5 caracteres!'
          },
          codigoESocial: {
            required: 'Código E-Social requerido!',
            maxlength: 'O código E-Social deve ter no máximo 5 caracteres!'
          },
          codigoCaged:{
            required: 'Código Caged requerido!',
            maxlength: 'O código Caged deve ter no máximo 5 caracteres!'
          },
          descricao: {
            required: 'Descrição requerida!',
            minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
            maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
          },
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.tipodeadmissao = new TipoDeAdmissao();
      this.swal = new SweetAlertAdviceService();
   }

  ngOnInit() {

    this.tipoDeAdmissaoForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      codigoRais: ['', [Validators.required]],
      codigoESocial: ['', [Validators.required]],
      codigoCaged: ['', Validators.required],
      excluido: 'N'
    });
    this.sub = this.route.params.subscribe(
      params => {
        this.tipoDeAdmissaoId = params['id'];
        this.ObterTipoDeAdmissao(this.tipoDeAdmissaoId);
      });

    this.tipoDeAdmissaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
  }

  ObterTipoDeAdmissao(id: string) {
    this.tipoDeAdmissaoService.obterTipoDeAdmissao(id)
      .subscribe(
        tipodeadmissao => this.preencherFormTipoDeAdmissao(tipodeadmissao),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
          
        });
  }

  preencherFormTipoDeAdmissao(tipodeadmissao: TipoDeAdmissao): void {
    this.tipodeadmissao = tipodeadmissao;

    this.reativarVisivel = this.tipodeadmissao.excluido === 'S';
    this.removerVisivel = this.tipodeadmissao.excluido === 'N';
    !this.removerVisivel ? this.tipoDeAdmissaoForm.disable() : this.tipoDeAdmissaoForm.enable();

    this.tipoDeAdmissaoForm.patchValue({
      id: this.tipodeadmissao.id,
      guid: 1,
      grupoEmpresaId: this.tipodeadmissao.grupoEmpresaId,
      empresaId: this.tipodeadmissao.empresaId,
      codigo: this.tipodeadmissao.codigo,
      sigla: this.tipodeadmissao.sigla,
      descricao: this.tipodeadmissao.descricao,
      codigoRais: this.tipodeadmissao.codigoRais,
      codigoESocial: this.tipodeadmissao.codigoESocial,
      codigoCaged: this.tipodeadmissao.codigoCaged,
      excluido: this.tipodeadmissao.excluido
      
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoDeAdmissaoForm);
    });
  }

  editarTipoDeAdmissao() {
    if (this.tipoDeAdmissaoForm.dirty && this.tipoDeAdmissaoForm.valid) {
      const p = Object.assign({}, this.tipodeadmissao, this.tipoDeAdmissaoForm.value);

      this.tipoDeAdmissaoService.atualizarTipoDeAdmissao(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Tipo de Admissão atualizado com sucesso!');
                this.router.navigate(['tipoadmissao/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

        },
        error => {
            console.error(error)
        })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoDeAdmissaoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipoadmissao/lista']);
  }

  remover(id) {
    this.router.navigate(['tipoadmissao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['tipoadmissao/reativar/' + id]);
  }

}


import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, MaxLengthValidator } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { TipoDeficienciaService } from '../tipodeficiencia.service';

import { TipoDeficiencia } from '../models/tipodeficiencia';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';


@Component({
  selector: 'app-editar-tipodeficiencia',
  templateUrl: './editar-tipodeficiencia.component.html',
  styleUrls: []
})
export class EditarTipodeficienciaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipoDeficiencia: TipoDeficiencia;
  public tipoDeficienciaForm: FormGroup;
  public tipoDeficienciaId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoDeficienciaService: TipoDeficienciaService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
// PEGAR VALIDATOR DO ADMIN
this.validationMessages = {
  codigo: {
     required: 'Código requerido!',
     maxlength: 'O código deve ter no Máximo 5 caracteres!'
   },
   descricao: {
     required: 'Descrição requerida!',
     minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
     maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
   },
 };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.tipoDeficiencia = new TipoDeficiencia();
      this.swal = new SweetAlertAdviceService();
   }

  ngOnInit() {

    this.tipoDeficienciaForm = this.fb.group({
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
        this.tipoDeficienciaId = params['id'];
        this.ObterTipoDeAdmissao(this.tipoDeficienciaId);
      });

    this.tipoDeficienciaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ObterTipoDeAdmissao(id: string) {
    this.tipoDeficienciaService.obterTipoDeficiencia(id)
      .subscribe(
        tipoDeficiencia => this.preencherFormTipoDeficiencia(tipoDeficiencia),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormTipoDeficiencia(tipoDeficiencia: TipoDeficiencia): void {
    this.tipoDeficiencia = tipoDeficiencia;

    this.reativarVisivel = this.tipoDeficiencia.excluido === 'S';
    this.removerVisivel = this.tipoDeficiencia.excluido === 'N';
    !this.removerVisivel ? this.tipoDeficienciaForm.disable() : this.tipoDeficienciaForm.enable();

    this.tipoDeficienciaForm.patchValue({
      id: this.tipoDeficiencia.id,
      guid: 1,
      grupoEmpresaId: this.tipoDeficiencia.grupoEmpresaId,
      empresaId: this.tipoDeficiencia.empresaId,
      codigo: this.tipoDeficiencia.codigo,
      sigla: this.tipoDeficiencia.sigla,
      descricao: this.tipoDeficiencia.descricao,
      codigoRais: this.tipoDeficiencia.codigoRais,
      codigoESocial: this.tipoDeficiencia.codigoESocial,
      codigoCaged: this.tipoDeficiencia.codigoCaged,
      excluido: this.tipoDeficiencia.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoDeficienciaForm);
    });
  }

  editarTipoDeficiencia() {
    if (this.tipoDeficienciaForm.dirty && this.tipoDeficienciaForm.valid) {
      const p = Object.assign({}, this.tipoDeficiencia, this.tipoDeficienciaForm.value);

      this.tipoDeficienciaService.atualizarTipoDeficiencia(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Tipo de Deficiência atualizado com sucesso!');
                this.router.navigate(['tipodeficiencia/lista']);
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
    this.tipoDeficienciaService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipodeficiencia/lista']);
  }

  remover(id) {
    this.router.navigate(['tipodeficiencia/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['tipodeficiencia/reativar/' + id]);
  }

}


import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoDeAdmissaoService } from '../tipodeadmissao.service';
import { Subscription } from 'rxjs/Subscription';
import { TipoDeAdmissao } from '../models/tipodeadmissao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-tipodeadmissao',
  templateUrl: './reativar-tipodeadmissao.component.html',
  styleUrls: []
})
export class ReativarTipodeadmissaoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipoDeAdmissao: TipoDeAdmissao;
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
    private route: ActivatedRoute) {

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
      this.tipoDeAdmissao = new TipoDeAdmissao();
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
      codigoRais: [''],
      codigoESocial: ['', [Validators.required]],
      codigoCaged: [''],
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

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarTipoDeAdmissao();
      }
      else {
        self.cancelar();
      }
    });
  }

  ObterTipoDeAdmissao(id: string) {
    this.tipoDeAdmissaoService.obterTipoDeAdmissao(id)
      .subscribe(
        tipoAdmissao => this.preencherFormTipoDeAdmissao(tipoAdmissao),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormTipoDeAdmissao(tipoAdmissao: TipoDeAdmissao): void {
    this.tipoDeAdmissao = tipoAdmissao;

    this.reativarVisivel = this.tipoDeAdmissao.excluido === 'S';
    this.removerVisivel = this.tipoDeAdmissao.excluido === 'N';

    this.tipoDeAdmissaoForm.patchValue({
      id: this.tipoDeAdmissao.id,
      grupoEmpresaId: this.tipoDeAdmissao.grupoEmpresaId,
      empresaId: this.tipoDeAdmissao.empresaId,
      codigo: this.tipoDeAdmissao.codigo,
      sigla: this.tipoDeAdmissao.sigla,
      descricao: this.tipoDeAdmissao.descricao,
      codigoRais: this.tipoDeAdmissao.codigoRais,
      codigoESocial: this.tipoDeAdmissao.codigoESocial,
      codigoCaged: this.tipoDeAdmissao.codigoCaged,
      excluido: this.tipoDeAdmissao.excluido
    });
  }

  reativarTipoDeAdmissao() {
    this.tipoDeAdmissaoService.reativarTipoDeAdmissao(this.tipoDeAdmissao)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Tipo de Admissão reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }        
        this.router.navigate(['tipoadmissao/lista']);
      },
      error => {
        console.error(error)
      });
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
    this.router.navigate(['tipoadmissao/editar/' + this.tipoDeAdmissaoId]);
  }

}

import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Convencao } from '../models/convencao';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvencaoService } from '../convencao.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Subscription, Observable } from 'rxjs';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-convencao',
  templateUrl: './reativar-convencao.component.html',
  styleUrls: []
})
export class ReativarConvencaoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public convencao: Convencao;
  public convencaoForm: FormGroup;
  public convencaoId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private convencaoService: ConvencaoService,
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
      this.convencao = new Convencao();
      this.swal = new SweetAlertAdviceService();

     }

  ngOnInit() {
    this.convencaoForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: [''],
      tipoConvencao: [''],
      observacao: [''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.convencaoId = params['id'];
        this.Obterconvencao(this.convencaoId);
      });

    this.convencaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarconvencao();
      } else {
        self.cancelar();
      }
    });
  }

  Obterconvencao(id: string) {
    this.convencaoService.obterConvencao(id)
      .subscribe(
        convencao => this.preencherFormconvencao(convencao),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormconvencao(convencao: Convencao): void {
    this.convencao = convencao;

    this.reativarVisivel = this.convencao.excluido === 'S';
    this.removerVisivel = this.convencao.excluido === 'N';

    this.convencaoForm.patchValue({
      id: this.convencao.id,
      grupoEmpresaId: this.convencao.grupoEmpresaId,
      empresaId: this.convencao.empresaId,
      codigo: this.convencao.codigo,
      sigla: this.convencao.sigla,
      descricao: this.convencao.descricao,
      tipoConvencao: this.convencao.tipoConvencao,
      observacao: this.convencao.observacao,
      excluido: this.convencao.excluido
    });
  }

  reativarconvencao() {
    this.convencaoService.reativarConvencao(this.convencao)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Convenção, reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }
        this.router.navigate(['convencao/lista']);
      },
      error => {
        console.error(error);
      });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.convencaoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['convencao/editar/' + this.convencaoId]);
  }
}



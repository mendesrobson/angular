import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Convencao } from '../models/convencao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription, Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ConvencaoService } from '../convencao.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-excluir-convencao',
  templateUrl: './excluir-convencao.component.html',
  styleUrls: []
})
export class ExcluirConvencaoComponent implements OnInit {
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
    private fb: FormBuilder,private router: Router,
    private route: ActivatedRoute) {

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
         tipoConvencao: {
          required: 'Tipo Covenção requerida!',
          minlength: 'Tipo Covenção deve ter no mínimo 3 caracteres!',
          maxlength: 'Tipo Covenção deve ter no máximo 100 caracteres!'
        }
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
        this.ObterConvencao(this.convencaoId);
      });

    this.convencaoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas;
    },
      () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerconvencao();
      } else {
        self.cancelar();
      }
    });
  }

  ObterConvencao(id: string) {
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
      guid: 1,
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

  removerconvencao() {
    this.convencaoService.removerConvencao(this.convencao)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Convenção removido com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['convencao/lista']);
        },
        () => {
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

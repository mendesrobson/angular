import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription, Observable } from '../../../../../node_modules/rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ExposicaoagentenocivoService } from './../exposicaoagentenocivo.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { ExposicaoAgenteNocivo } from '../models/exposicaoAgenteNocivo';

@Component({
  selector: 'app-excluir-exposicaoagentenocivo',
  templateUrl: './excluir-exposicaoagentenocivo.component.html',
  styleUrls: []
})
export class ExcluirExposicaoagentenocivoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public exposicaoAgenteNocivo: ExposicaoAgenteNocivo;
  public exposicaoAgenteNocivoForm: FormGroup;
  public exposicaoAgenteNocivoId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private exposicaoAgenteNocivoService: ExposicaoagentenocivoService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {

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
    this.exposicaoAgenteNocivo = new ExposicaoAgenteNocivo();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.exposicaoAgenteNocivoForm = this.fb.group({
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

    this.sub = this.route.params.subscribe(
      params => {
        this.exposicaoAgenteNocivoId = params['id'];
        this.ObterExposicaoAgenteNocivo(this.exposicaoAgenteNocivoId);
      });

    this.exposicaoAgenteNocivoService.obterTodosGrupoEmpresa()
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
        self.removerExposicaoAgenteNocivo();
      } else {
        self.cancelar();
      }
    });
  }

  ObterExposicaoAgenteNocivo(id: string) {
    this.exposicaoAgenteNocivoService.obterExposicaoAgenteNocivo(id)
      .subscribe(
        exposicaoAgenteNocivo => this.preencherFormExposicaoAgenteNocivo(exposicaoAgenteNocivo),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormExposicaoAgenteNocivo(exposicaoAgenteNocivo: ExposicaoAgenteNocivo): void {
    this.exposicaoAgenteNocivo = exposicaoAgenteNocivo;

    this.reativarVisivel = this.exposicaoAgenteNocivo.excluido === 'S';
    this.removerVisivel = this.exposicaoAgenteNocivo.excluido === 'N';

    this.exposicaoAgenteNocivoForm.patchValue({
      id: this.exposicaoAgenteNocivo.id,
      guid: 1,
      grupoEmpresaId: this.exposicaoAgenteNocivo.grupoEmpresaId,
      empresaId: this.exposicaoAgenteNocivo.empresaId,
      codigo: this.exposicaoAgenteNocivo.codigo,
      sigla: this.exposicaoAgenteNocivo.sigla,
      descricao: this.exposicaoAgenteNocivo.descricao,
      excluido: this.exposicaoAgenteNocivo.excluido
    });
  }

  removerExposicaoAgenteNocivo() {
    this.exposicaoAgenteNocivoService.removerExposicaoAgenteNocivo(this.exposicaoAgenteNocivo)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Exposicao Agente Nocivo removido com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['exposicaoagentenocivo/lista']);
        },
        () => {
        });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.exposicaoAgenteNocivoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['exposicaoagentenocivo/editar/' + this.exposicaoAgenteNocivoId]);
  }

}

import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoDeficienciaService } from '../tipodeficiencia.service';
import { Subscription } from 'rxjs/Subscription';
import { TipoDeficiencia } from '../models/tipodeficiencia';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-tipodeficiencia',
  templateUrl: './reativar-tipodeficiencia.component.html',
  styleUrls: []
})
export class ReativarTipodeficienciaComponent implements OnInit , AfterViewInit {

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
      codigoRais: [''],
      codigoESocial: ['', [Validators.required]],
      codigoCaged: [''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.tipoDeficienciaId = params['id'];
        this.ObterTipoDeficiencia(this.tipoDeficienciaId);
      });

    this.tipoDeficienciaService.obterTodosGrupoEmpresa()
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
        self.reativarTipoDeficiencia();
      } else {
        self.cancelar();
      }
    });
  }

  ObterTipoDeficiencia(id: string) {
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

    this.tipoDeficienciaForm.patchValue({
      id: this.tipoDeficiencia.id,
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

  reativarTipoDeficiencia() {
    this.tipoDeficienciaService.reativarTipoDeficiencia(this.tipoDeficiencia)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Tipo de Deficiência reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }
        this.router.navigate(['tipodeficiencia/lista']);
      },
      error => {
        console.error(error);
      });
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
    this.router.navigate(['tipodeficiencia/editar/' + this.tipoDeficienciaId]);
  }

}


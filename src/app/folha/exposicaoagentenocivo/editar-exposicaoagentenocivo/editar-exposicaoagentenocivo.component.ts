import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { ExposicaoAgenteNocivo } from '../models/exposicaoAgenteNocivo';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription, Observable } from '../../../../../node_modules/rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ExposicaoagentenocivoService } from '../exposicaoagentenocivo.service';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-editar-exposicaoagentenocivo',
  templateUrl: './editar-exposicaoagentenocivo.component.html',
  styleUrls: []
})
export class EditarExposicaoagentenocivoComponent implements OnInit, AfterViewInit {

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
        this.ObterTipoDeAdmissao(this.exposicaoAgenteNocivoId);
      });

    this.exposicaoAgenteNocivoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }

  ObterTipoDeAdmissao(id: string) {
    this.exposicaoAgenteNocivoService.obterExposicaoAgenteNocivo(id)
      .subscribe(
        resultado => this.preencherFormexposicaoAgenteNocivo(resultado),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormexposicaoAgenteNocivo(exposicaoAgenteNocivo: ExposicaoAgenteNocivo): void {
    this.exposicaoAgenteNocivo = exposicaoAgenteNocivo;

    this.reativarVisivel = this.exposicaoAgenteNocivo.excluido === 'S';
    this.removerVisivel = this.exposicaoAgenteNocivo.excluido === 'N';
    !this.removerVisivel ? this.exposicaoAgenteNocivoForm.disable() : this.exposicaoAgenteNocivoForm.enable();

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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.exposicaoAgenteNocivoForm);
    });
  }

  editarExposicaoAgenteNocivo() {
    if (this.exposicaoAgenteNocivoForm.dirty && this.exposicaoAgenteNocivoForm.valid) {
      const p = Object.assign({}, this.exposicaoAgenteNocivo, this.exposicaoAgenteNocivoForm.value);

      this.exposicaoAgenteNocivoService.atualizarExposicaoAgenteNocivo(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Exposição Agente Nocivo, atualizado com sucesso!');
              this.router.navigate(['exposicaoagentenocivo/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
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
    this.router.navigate(['exposicaoagentenocivo/lista']);
  }

  remover(id) {
    this.router.navigate(['exposicaoagentenocivo/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['exposicaoagentenocivo/reativar/' + id]);
  }

}
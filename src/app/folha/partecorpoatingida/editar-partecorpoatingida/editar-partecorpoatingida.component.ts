import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription, Observable } from '../../../../../node_modules/rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { ParteCorpoAtingida } from '../models/partecorpoatingida';
import { PartecorpoatingidaService } from '../partecorpoatingida.service';

@Component({
  selector: 'app-editar-partecorpoatingida',
  templateUrl: './editar-partecorpoatingida.component.html',
  styleUrls: []
})
export class EditarPartecorpoatingidaComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public parteCorpoAtingida: ParteCorpoAtingida;
  public parteCorpoAtingidaForm: FormGroup;
  public parteCorpoAtingidaId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private parteCorpoAtingidaService: PartecorpoatingidaService,
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
    this.parteCorpoAtingida = new ParteCorpoAtingida();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.parteCorpoAtingidaForm = this.fb.group({
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
        this.parteCorpoAtingidaId = params['id'];
        this.ObterPartecorpoatingida(this.parteCorpoAtingidaId);
      });

    this.parteCorpoAtingidaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }

  ObterPartecorpoatingida(id: string) {
    this.parteCorpoAtingidaService.obterParteCorpoAtingida(id)
      .subscribe(
        resultado => this.preencherFormParteCorpoAtingida(resultado),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormParteCorpoAtingida(parteCorpoAtingida: ParteCorpoAtingida): void {
    this.parteCorpoAtingida = parteCorpoAtingida;

    this.reativarVisivel = this.parteCorpoAtingida.excluido === 'S';
    this.removerVisivel = this.parteCorpoAtingida.excluido === 'N';
    !this.removerVisivel ? this.parteCorpoAtingidaForm.disable() : this.parteCorpoAtingidaForm.enable();

    this.parteCorpoAtingidaForm.patchValue({
      id: this.parteCorpoAtingida.id,
      guid: 1,
      grupoEmpresaId: this.parteCorpoAtingida.grupoEmpresaId,
      empresaId: this.parteCorpoAtingida.empresaId,
      codigo: this.parteCorpoAtingida.codigo,
      sigla: this.parteCorpoAtingida.sigla,
      descricao: this.parteCorpoAtingida.descricao,
      excluido: this.parteCorpoAtingida.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.parteCorpoAtingidaForm);
    });
  }

  editarParteCorpoAtingida() {
    if (this.parteCorpoAtingidaForm.dirty && this.parteCorpoAtingidaForm.valid) {
      const p = Object.assign({}, this.parteCorpoAtingida, this.parteCorpoAtingidaForm.value);

      this.parteCorpoAtingidaService.atualizarParteCorpoAtingida(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Parte Corpo Atiginda, atualizado com sucesso!');
              this.router.navigate(['partecorpoatingida/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.parteCorpoAtingidaService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['partecorpoatingida/lista']);
  }

  remover(id) {
    this.router.navigate(['partecorpoatingida/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['partecorpoatingida/reativar/' + id]);
  }

}
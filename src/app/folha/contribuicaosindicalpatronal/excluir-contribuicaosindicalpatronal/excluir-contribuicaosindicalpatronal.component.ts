import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { ContribuicaoSindicalPatronal } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { Sindicato } from '../../sindicato/models/sindicato';

@Component({
  selector: 'app-excluir-contribuicaosindicalpatronal',
  templateUrl: './excluir-contribuicaosindicalpatronal.component.html',
  styleUrls: []
})
export class ExcluirContribuicaosindicalpatronalComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal;
  public contribuicaoSindicalPatronalForm: FormGroup;
  public contribuicaoSindicalPatronalId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public sindicatos : Sindicato[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
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
      },
      sindicatoId: {
        required: 'O Sindicato é requerido..'
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contribuicaoSindicalPatronal = new ContribuicaoSindicalPatronal();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.contribuicaoSindicalPatronalForm = this.fb.group({
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      sindicatoId: ['', [Validators.required]],
      atividadeEnsino: 'N',
      utilizarReceitaBruta: 'N',
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.contribuicaoSindicalPatronalId = params['id'];
        this.obterContribuicaoSindicalPatronal(this.contribuicaoSindicalPatronalId);
      });

    this.contribuicaoSindicalPatronalService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

      this.contribuicaoSindicalPatronalService.obterTodosSindicatos()
      .subscribe(sindicatos => {
        this.sindicatos = sindicatos;
      },
        () => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerContribuicaoSindicalPatronal();
      }
      else {
        self.cancelar();
      }
    });
  }


  obterContribuicaoSindicalPatronal(id: string) {
    this.contribuicaoSindicalPatronalService.obterContribuicaoSindicalPatronal(id)
      .subscribe(
        contribuicaoSindicalPatronal => this.preencherFormContribuicaoSindicalPatronal(contribuicaoSindicalPatronal),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormContribuicaoSindicalPatronal(contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal): void {
    this.contribuicaoSindicalPatronal = contribuicaoSindicalPatronal;

    this.reativarVisivel = this.contribuicaoSindicalPatronal.excluido === 'S';
    this.removerVisivel = this.contribuicaoSindicalPatronal.excluido === 'N';

    this.contribuicaoSindicalPatronalForm.patchValue({
      id: this.contribuicaoSindicalPatronal.id,
      grupoEmpresaId: this.contribuicaoSindicalPatronal.grupoEmpresaId,
      empresaId: this.contribuicaoSindicalPatronal.empresaId,
      codigo: this.contribuicaoSindicalPatronal.codigo,
      sigla: this.contribuicaoSindicalPatronal.sigla,
      descricao: this.contribuicaoSindicalPatronal.descricao,
      sindicatoId: this.contribuicaoSindicalPatronal.sindicatoId,
      atividadeEnsino: this.contribuicaoSindicalPatronal.atividadeEnsino,
      utilizarReceitaBruta: this.contribuicaoSindicalPatronal.utilizarReceitaBruta,
      excluido: this.contribuicaoSindicalPatronal.excluido
    });
  }

  removerContribuicaoSindicalPatronal() {
    this.contribuicaoSindicalPatronalService.removerContribuicaoSindicalPatronal(this.contribuicaoSindicalPatronal)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Contribuição Sindical Patronal, Removido com Sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['contribuicaosindicalpatronal/lista']);
        },
        error => {
          console.error(error)
        });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.contribuicaoSindicalPatronalService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['contribuicaosindicalpatronal/editar/' + this.contribuicaoSindicalPatronalId]);
  }

}
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
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { Sindicato } from '../../sindicato/models/sindicato';

@Component({
  selector: 'app-editar-contribuicaosindicalpatronal',
  templateUrl: './editar-contribuicaosindicalpatronal.component.html',
  styleUrls: []
})
export class EditarContribuicaosindicalpatronalComponent implements OnInit, AfterViewInit {
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

  carregaNumeroAluno = false;
  carregaReceitaBruta = false;
  carregarCapitalSocial = false;

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent
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
        () => this.errors);

      this.contribuicaoSindicalPatronalService.obterTodosSindicatos()
      .subscribe(sindicatos => {
        this.sindicatos = sindicatos;
      },
        () => this.errors);


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

    this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno = contribuicaoSindicalPatronal.contrSindPatNumeroAluno;
    this.contribuicaosindicalpatronalComponent.ContribuicaoSindicalPatronal.contrSindPatReceitaBruta = contribuicaoSindicalPatronal.contrSindPatReceitaBruta;
    this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial = contribuicaoSindicalPatronal.contrSindPatCapitalSocial;

    this.contribuicaoSindicalPatronal = contribuicaoSindicalPatronal;

    this.reativarVisivel = this.contribuicaoSindicalPatronal.excluido === 'S';
    this.removerVisivel = this.contribuicaoSindicalPatronal.excluido === 'N';
    !this.removerVisivel ? this.contribuicaoSindicalPatronalForm.disable() : this.contribuicaoSindicalPatronalForm.enable();
    this.contribuicaosindicalpatronalComponent.Excluido = !this.removerVisivel;

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

    this.carregaNumeroAluno = true;
    this.carregaReceitaBruta = true;
    this.carregarCapitalSocial = true;
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contribuicaoSindicalPatronalForm);
    });
  }

  editarContribuicaoSindicalPatronal() {
    if (this.contribuicaoSindicalPatronalForm.dirty && this.contribuicaoSindicalPatronalForm.valid) {
      const p = Object.assign({}, this.contribuicaoSindicalPatronal, this.contribuicaoSindicalPatronalForm.value);

      this.contribuicaoSindicalPatronalService.atualizarContribuicaoSindicalPatronal(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Contribuição Sindical Patronal, Atualizado com Sucesso!');
              this.router.navigate(['contribuicaosindicalpatronal/lista']);
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
    this.router.navigate(['contribuicaosindicalpatronal/lista']);
  }

  remover(id) {
    this.router.navigate(['contribuicaosindicalpatronal/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['contribuicaosindicalpatronal/reativar/' + id]);
  }

}

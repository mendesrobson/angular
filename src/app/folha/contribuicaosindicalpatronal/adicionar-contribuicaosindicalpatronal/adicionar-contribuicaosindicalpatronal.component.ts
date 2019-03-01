import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';

import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ContribuicaoSindicalPatronal } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { Sindicato } from '../../sindicato/models/sindicato';

@Component({
  selector: 'app-adicionar-contribuicaosindicalpatronal',
  templateUrl: './adicionar-contribuicaosindicalpatronal.component.html',
  styleUrls: []
})
export class AdicionarContribuicaosindicalpatronalComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public contribuicaoSindicalPatronal: ContribuicaoSindicalPatronal;
  public contribuicaoSindicalPatronalForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public sindicatos: Sindicato[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router,
    private contribuicaoSindicalPatronalComponent: ContribuicaosindicalpatronalComponent
  ) {
    
    this.contribuicaoSindicalPatronalComponent.Excluido = false;

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
    this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno = new Array();
    this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta = new Array();
    this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial = new Array();

  }

  ngOnInit(): void {
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

    this.contribuicaoSindicalPatronalService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
      error => this.errors);

    this.contribuicaoSindicalPatronalService.obterTodosSindicatos()
    .subscribe(sindicatos => {
    this.sindicatos = sindicatos; }, error => this.errors );

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contribuicaoSindicalPatronalForm);
    });
  }

  adicionarContribuicaoSindicalPatronal() {
    if (this.contribuicaoSindicalPatronalForm.dirty && this.contribuicaoSindicalPatronalForm.valid) {
      let p = Object.assign({}, this.contribuicaoSindicalPatronal, this.contribuicaoSindicalPatronalForm.value);

      p.contrSindPatReceitaBruta = this.contribuicaoSindicalPatronalComponent.ContribuicaoSindicalPatronal.contrSindPatReceitaBruta;
      p.contrSindPatCapitalSocial = this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial;
      p.contrSindPatNumeroAluno = this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno;
      console.log(p);
      this.contribuicaoSindicalPatronalService.adicionarContribuicaoSindicalPatronal(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Contribuição Sindical Patronal, Adicionado com Sucesso!');
            this.router.navigate(['contribuicaosindicalpatronal/lista']);
          },
          error => {
            console.error(error)
          })
    }
  }


  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['contribuicaosindicalpatronal/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.contribuicaoSindicalPatronalService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}

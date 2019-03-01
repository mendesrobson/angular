import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoContrato, Periodicidade, TipoReajuste, Indice, Mes, Indexador } from '../models/tipocontrato';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TipoContratoService } from '../tipocontrato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-tipocontrato',
  templateUrl: './editar-tipocontrato.component.html',
  styleUrls: []
})
export class EditarTipoContratoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoContrato: TipoContrato;
  public tipoContratoForm: FormGroup;
  public sub: Subscription;

  public tipoContratoId: string = "";

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public periodicidades: Periodicidade[];
  public tipoReajustes: TipoReajuste[];
  public indices: Indice[];
  public meses: Mes[];
  public indexadores: Indexador[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public errors: any[] = [];

  constructor(
    private tipoContratoService: TipoContratoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 1 caracter',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoContrato = new TipoContrato();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.tipoContratoForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      proporcionalDataInicio: '',
      indexadorSigla: '',
      periodicidadeSigla: '',
      tipoReajusteSigla: '',
      mesBaseSigla: '',
      indiceId: '',
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.tipoContratoId = params['id'];
        this.obterTipoContrato(this.tipoContratoId);
      });

    this.tipoContratoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors);

    this.tipoContratoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);

    this.tipoContratoService.obterTodosIndice()
      .subscribe(indices => {
        this.indices = indices
      },
        () => this.errors);

    // this.tipoContratoService.getPeriodicidade()
    //   .subscribe(periodicidades => {
    //     this.periodicidades = periodicidades
    //   },
    //   () => this.errors);
    this.periodicidades = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "B",
      "valor": "Bimestral"
    },
    {
      "id": "T",
      "valor": "Trimestral"
    },
    {
      "id": "S",
      "valor": "Semestral"
    },
    {
      "id": "A",
      "valor": "Anual"
    }];

    // this.tipoContratoService.getTipoReajuste()
    //   .subscribe(tipoReajustes => {
    //     this.tipoReajustes = tipoReajustes
    //   },
    //   () => this.errors);
    this.tipoReajustes = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "B",
      "valor": "Bimestral"
    },
    {
      "id": "T",
      "valor": "Trimestral"
    },
    {
      "id": "S",
      "valor": "Semestral"
    },
    {
      "id": "A",
      "valor": "Anual"
    },
    {
      "id": "DT",
      "valor": "Data Base"
    }];

    // this.tipoContratoService.getMes()
    //   .subscribe(meses => {
    //     this.meses = meses
    //   },
    //   () => this.errors);
    this.meses = [{
      "id": "JAN",
      "valor": "Janeiro"
    },
    {
      "id": "FEV",
      "valor": "Fevereiro"
    },
    {
      "id": "MAR",
      "valor": "Março"
    },
    {
      "id": "ABR",
      "valor": "Abril"
    },
    {
      "id": "MAI",
      "valor": "Maio"
    },
    {
      "id": "JUN",
      "valor": "Junho"
    },
    {
      "id": "JUL",
      "valor": "Julho"
    },
    {
      "id": "AGO",
      "valor": "Agosto"
    },
    {
      "id": "SET",
      "valor": "Setembro"
    },
    {
      "id": "OUT",
      "valor": "Outubro"
    },
    {
      "id": "NOV",
      "valor": "Novembro"
    },
    {
      "id": "DEZ",
      "valor": "Dezembro"
    }];

    // this.tipoContratoService.getIndexador()
    //   .subscribe(indexadores => {
    //     this.indexadores = indexadores
    //   },
    //   () => this.errors);
    this.indexadores = [{
      "id": "IND",
      "valor": "Índice"
    },
    {
      "id": "MOE",
      "valor": "Moeda Corrente"
    }];

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoContratoForm);
    });
  }

  obterTipoContrato(id: string) {
    this.tipoContratoService.obterTipoContrato(id)
      .subscribe(
        tipoContrato => this.preencherFormTipoContrato(tipoContrato),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormTipoContrato(tipoContrato: TipoContrato): void {
    this.tipoContrato = tipoContrato;

    this.reativarVisivel = this.tipoContrato.excluido === 'S';
    this.removerVisivel = this.tipoContrato.excluido === 'N';

    this.tipoContratoForm.controls['codigo'].disable();

    this.tipoContratoForm.patchValue({
      codigo: this.tipoContrato.codigo,
      sigla: this.tipoContrato.sigla,
      descricao: this.tipoContrato.descricao,
      proporcionalDataInicio: this.tipoContrato.proporcionalDataInicio,
      indexadorSigla: this.tipoContrato.indexadorSigla,
      periodicidadeSigla: this.tipoContrato.periodicidadeSigla,
      tipoReajusteSigla: this.tipoContrato.tipoReajusteSigla,
      mesBaseSigla: this.tipoContrato.mesBaseSigla,
      indiceId: this.tipoContrato.indiceId,
      empresaId: this.tipoContrato.empresaId,
      grupoEmpresaId: this.tipoContrato.grupoEmpresaId
    });
  }

  editarTipoContrato() {
    if (this.tipoContratoForm.dirty && this.tipoContratoForm.valid) {
      let p = Object.assign({}, this.tipoContrato, this.tipoContratoForm.getRawValue());

      this.tipoContratoService.atualizarTipoContrato(p)
        .subscribe(
          () => {
            this.swal.showSwalSuccess('Tipo de Contrato Atualizado com Sucesso');
            this.router.navigate(['tipocontrato/lista']);
          },
          () => {
            this.errors;
          })
    }
  }

  cancelar() {
    this.router.navigate(['tipocontrato/lista']);
  }

  remover(id) {
    this.router.navigate(['tipocontrato/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['tipocontrato/reativar/' + id]);
  }

}

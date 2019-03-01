import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { MaskService } from '../../../services/mask.service';

import { Subscription } from 'rxjs';
import { ConfiguracaoPagamento } from '../models/configuracaopagamento';
import { ConfiguracaopagamentoService } from '../configuracaopagamento.service';
import { UtilService } from '../../../services/util.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-reativar-configuracaopagamento',
  templateUrl: './reativar-configuracaopagamento.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class ReativarConfiguracaopagamentoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public configuracaoPagamento: ConfiguracaoPagamento;
  public configuracaoPagamentoForm: FormGroup;
  public configuracaoPagamentoId: string = "";
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public errors: any[] = [];

  constructor(
    private configuracaoPagamentoService: ConfiguracaopagamentoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
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
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      quantidadeParcela: {
        required: 'Quantidade Parcela requerida.'
      },
      periodicidade: {
        required: 'Periodicidade requerida.'
      },
      numeroDiaUtil: {
        required: 'Qtd. Dia Útil requerida.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.configuracaoPagamento = new ConfiguracaoPagamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {

    this.configuracaoPagamentoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      quantidadeParcela: ['', [Validators.required]],
      periodicidade: ['', [Validators.required]],
      numeroDiaUtil: ['', [Validators.required]],
      percentualJuros: [],
      percentualMulta: [],
      dataPrimeiroVencimento: [],
      manterDiaVencimento: 'N',
      diaUtil: 'N',
      ultimoDiaMes: 'N',
      posterga: 'N',
      antecipa: 'N',
      sabadoUtil: 'N',
      domingoUtil: 'N',
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.configuracaoPagamentoId = params['id'];
        this.obterConfiguracaoPagamento(this.configuracaoPagamentoId);
      });

    this.configuracaoPagamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.configuracaoPagamentoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

  }

  public selectDataVencimento = [
    { id: '01', value: '01' },
    { id: '02', value: '02' },
    { id: '03', value: '03' },
    { id: '04', value: '04' },
    { id: '05', value: '05' },
    { id: '06', value: '06' },
    { id: '07', value: '07' },
    { id: '08', value: '08' },
    { id: '09', value: '09' },
    { id: '10', value: '10' },
    { id: '11', value: '11' },
    { id: '12', value: '12' },
    { id: '13', value: '13' },
    { id: '14', value: '14' },
    { id: '15', value: '15' },
    { id: '16', value: '16' },
    { id: '17', value: '17' },
    { id: '18', value: '18' },
    { id: '19', value: '19' },
    { id: '20', value: '20' },
    { id: '21', value: '21' },
    { id: '22', value: '22' },
    { id: '23', value: '23' },
    { id: '24', value: '24' },
    { id: '25', value: '25' },
    { id: '26', value: '26' },
    { id: '27', value: '27' },
    { id: '28', value: '28' },
    { id: '29', value: '29' },
    { id: '30', value: '30' },
    { id: '31', value: '31' }
  ];

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      var self = this;
      this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
        if (isConfirmed) {
          self.reativarConfiguracaoPagamento();
        }
        else {
          self.cancelar();
        }
      });
  }

  obterConfiguracaoPagamento(id: string) {
    this.configuracaoPagamentoService.obterConfiguracaoPagamento(id)
      .subscribe(
      configuracaoPagamento => this.preencherFormConfiguracaoPagamento(configuracaoPagamento),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): void {
    this.configuracaoPagamento = configuracaoPagamento;

    this.reativarVisivel = this.configuracaoPagamento.excluido === 'S';
    this.removerVisivel = this.configuracaoPagamento.excluido === 'N';

    this.configuracaoPagamentoForm.controls['codigo'].disable();

    this.configuracaoPagamentoForm.patchValue({
      codigo: this.configuracaoPagamento.codigo,
      sigla: this.configuracaoPagamento.sigla,
      descricao: this.configuracaoPagamento.descricao,
      empresaId: this.configuracaoPagamento.empresaId,
      grupoEmpresaId: this.configuracaoPagamento.grupoEmpresaId,
      quantidadeParcela: this.configuracaoPagamento.quantidadeParcela,
      periodicidade: this.configuracaoPagamento.periodicidade,
      numeroDiaUtil: this.configuracaoPagamento.numeroDiaUtil,
      percentualJuros: this.configuracaoPagamento.percentualJuros,
      percentualMulta: this.configuracaoPagamento.percentualMulta,
      //dataPrimeiroVencimento: this._utilService.ToDate(this.configuracaoPagamento.dataPrimeiroVencimento),
      dataPrimeiroVencimento: this.configuracaoPagamento.dataPrimeiroVencimento,
      manterDiaVencimento: this.configuracaoPagamento.manterDiaVencimento,
      diaUtil: this.configuracaoPagamento.diaUtil,
      ultimoDiaMes: this.configuracaoPagamento.ultimoDiaMes,
      posterga: this.configuracaoPagamento.posterga,
      antecipa: this.configuracaoPagamento.antecipa,
      sabadoUtil: this.configuracaoPagamento.sabadoUtil,
      domingoUtil: this.configuracaoPagamento.domingoUtil,
      excluido: this.configuracaoPagamento.excluido
    });
  }

  cancelar() {
    this.router.navigate(['configuracaopagamento/editar/' + this.configuracaoPagamentoId]);
  }

  reativarConfiguracaoPagamento() {
    this.configuracaoPagamentoService.ReativarConfiguracaoPagamento(this.configuracaoPagamento)
    .subscribe(
    result => { 
      this.swal.showSwalSuccess('Configuração Pagamento, reativada com sucesso!');
      this.router.navigate(['configuracaopagamento/lista']);
    },
    error => { 
      error => this.errors;
    });
  } 

}


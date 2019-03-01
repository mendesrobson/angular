import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { getDaysInMonth, getYear, getMonth } from 'date-fns';

import { Titulo, Cliente, TipoDocumento, ContaCorrente, Origem, Natureza, ConfiguracaoPagamento } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { UtilService } from '../../../services/util.service';
import { Subscription } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-titulo',
  templateUrl: './reativar-titulo.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class ReativarTituloComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public titulo: Titulo;
  public tituloForm: FormGroup;
  public tituloId: string = "";
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public clientes: Cliente[];
  public tipoDocumentos: TipoDocumento[];
  public naturezas: Natureza[];
  public contaCorrentes: ContaCorrente[];
  public origems: Origem[];
  public configuracaoPagamentos: ConfiguracaoPagamento[];
  public confPagamento: ConfiguracaoPagamento;

  public errors: any[] = [];

  constructor(
    private tituloService: TituloService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      clienteId: {
        required: 'Informe o Cliente'
      },
      documento: {
        required: 'A Documento é requerida',
        minlength: 'A Documento precisa ter no mínimo 3 caracteres',
        maxlength: 'A Documento precisa ter no máximo 100 caracteres'
      },
      valorBruto: {
        required: 'Informe o Valor Bruto'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.titulo = new Titulo();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {


    this.tituloForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      documento: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      clienteId: ['', [Validators.required]],
      tipoDocumentoId: [],
      naturezaId: [],
      contaCorrenteId: [],
      origemId: [],
      configuracaoPagamentoId: [],
      valorBruto: ['', [Validators.required]],
      valorDesconto: [],
      valorRetencoes: [],
      valorLiquido: [],
      dataPrimeiroVencimento: [],
      dataEmissao: [],
      percentualJuros: [],
      percentualMulta: [],
      numeroDiaUtil: [],
      quantidadeParcela: [],
      periodicidade: [],
      manterDiaVencimento: 'N',
      diaUtil: 'N',
      posterga: 'N',
      antecipa: 'N',
      ultimoDiaMes: 'N',
      sabadoUtil: 'N',
      domingoUtil: 'N',
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.tituloId = params['id'];
        this.obterTitulo(this.tituloId);
      });

    this.tituloService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    // this.tituloService.obterTodosEmpresa()
    //   .subscribe(empresas => {
    //     this.empresas = empresas
    //   },
    //   error => this.errors);

    // this.tituloService.obterTodosCliente()
    //   .subscribe(clientes => {
    //     this.clientes = clientes
    //   },
    //   error => this.errors);

    this.tituloService.obterTodosTipoDocumento()
      .subscribe(tipoDocumentos => {
        this.tipoDocumentos = tipoDocumentos
      },
      error => this.errors);

    this.tituloService.obterTodosNatureza()
      .subscribe(naturezas => {
        this.naturezas = naturezas
      },
      error => this.errors);

    // this.tituloService.obterTodosContaCorrente()
    //   .subscribe(contaCorrentes => {
    //     this.contaCorrentes = contaCorrentes
    //   },
    //   error => this.errors);

    this.tituloService.obterTodosOrigem()
      .subscribe(origems => {
        this.origems = origems
      },
      error => this.errors);

    // this.tituloService.obterTodosConfiguracaoPagamento()
    //   .subscribe(configuracaoPagamentos => {
    //     this.configuracaoPagamentos = configuracaoPagamentos
    //   },
    //   error => this.errors);

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
          self.reativarTitulo();
        }
        else {
          self.cancelar();
        }
      });
  }

  popularConfiguracaoPagamento(id) {
    this.tituloService.obterConfiguracaoPagamentoId(id)
      .subscribe(
      configuracaoPagamento => this.preencherConfiguracaoPagamento(configuracaoPagamento),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): void {
    
    this.confPagamento = configuracaoPagamento;
    let dataVencimento: string = (getYear(Date.now()) + "-0" + (parseInt(getMonth(Date.now()).toString()) + 1) + "-" + this.confPagamento.dataPrimeiroVencimento).toString();

    this.tituloForm.patchValue({
      quantidadeParcela: this.confPagamento.quantidadeParcela,
      diaUtil: this.confPagamento.diaUtil,
      manterDiaVencimento: this.confPagamento.manterDiaVencimento,
      posterga: this.confPagamento.posterga,
      antecipa: this.confPagamento.antecipa,
      ultimoDiaMes: this.confPagamento.ultimoDiaMes,
      periodicidade: this.confPagamento.periodicidade,
      sabadoUtil: this.confPagamento.sabadoUtil,
      domingoUtil: this.confPagamento.domingoUtil,
      percentualJuros: this.confPagamento.percentualJuros,
      percentualMulta: this.confPagamento.percentualMulta,
      numeroDiaUtil: this.confPagamento.numeroDiaUtil,
      dataPrimeiroVencimento: dataVencimento
    });
  }

  obterTitulo(id: string) {
    this.tituloService.obterTitulo(id)
      .subscribe(
      titulo => this.preencherFormTitulo(titulo),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormTitulo(titulo: Titulo): void {
    this.titulo = titulo;

    this.reativarVisivel = this.titulo.excluido === 'S';
    this.removerVisivel = this.titulo.excluido === 'N';

    this.tituloForm.patchValue({
      empresaId: this.titulo.empresaId,
      grupoEmpresaId: this.titulo.grupoEmpresaId,
      documento: this.titulo.documento,
      clienteId: this.titulo.clienteId,
      tipoDocumentoId: this.titulo.tipoDocumentoId,
      naturezaId: this.titulo.naturezaId,
      contaCorrenteId: this.titulo.contaCorrenteId,
      origemId: this.titulo.origemId,
      configuracaoPagamentoId: this.titulo.configuracaoPagamentoId,
      valorBruto: this.titulo.valorBruto,
      valorDesconto: this.titulo.valorDesconto,
      valorRetencoes: this.titulo.valorRetencoes,
      valorLiquido: this.titulo.valorLiquido,
      dataPrimeiroVencimento: this._utilService.ToDate(this.titulo.dataPrimeiroVencimento), 
      percentualJuros: this.titulo.percentualJuros,
      percentualMulta: this.titulo.percentualMulta,
      numeroDiaUtil: this.titulo.numeroDiaUtil,
      quantidadeParcela: this.titulo.quantidadeParcela, 
      periodicidade: this.titulo.periodicidade, 
      manterDiaVencimento: this.titulo.manterDiaVencimento, 
      diaUtil: this.titulo.diaUtil,
      posterga: this.titulo.posterga, 
      ultimoDiaMes: this.titulo.ultimoDiaMes,     
      antecipa: this.titulo.antecipa,
      sabadoUtil: this.titulo.sabadoUtil,
      domingoUtil: this.titulo.domingoUtil,
      excluido: this.titulo.excluido
    });
  }

  cancelar() {
    if (this.titulo.naturezaId == 1) {
      this.router.navigate(['titulo/editar/receber/' + this.tituloId]);
    } else if (this.titulo.naturezaId == 2) {
      this.router.navigate(['titulo/editar/pagar/' + this.tituloId]);
    }
  }

  reativarTitulo() {
    this.tituloService.ReativarTitulo(this.titulo)
    .subscribe(
    result => {
      this.swal.showSwalSuccess('Titulo, reativado com sucesso!');
      if (this.titulo.naturezaId === 1) {
        this.router.navigate(['titulo/lista/receber']);
      } else if (this.titulo.naturezaId === 2) {
        this.router.navigate(['titulo/lista/pagar']);
      }
    },
    error => {
      error => this.errors;
    });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tituloService.obterTodosEmpresaPorGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }


  ConsultaSelectEmpresa(idEmpresa) {
    this.tituloComponent.titulo.empresaId = idEmpresa;

    this.clientes = [];
    this.tituloService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);

    this.fornecedores = [];
    this.tituloService.obterTodosFornecedorPorEmpresa(idEmpresa)
      .subscribe(fornecedores => {
        this.fornecedores = fornecedores
      },
        error => this.errors);

    this.configuracaoPagamentos = [];
    this.tituloService.obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa)
      .subscribe(configuracaoPagamentos => {
        this.configuracaoPagamentos = configuracaoPagamentos
      },
        error => this.errors);

    this.historicoPadraos = [];
    this.tituloService.obterTodosHistoricoPadraoPorEmpresa(idEmpresa)
      .subscribe(historicoPadraos => {
        this.historicoPadraos = historicoPadraos
      },
        error => this.errors);

    this.contaCorrentes = [];
    this.tituloService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

  }


}



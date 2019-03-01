import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContratoFaturamento, Cliente, TipoContrato, SituacaoContrato, EventoFaturamento } from '../models/contratofaturamento';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContratoFaturamentoService } from '../contratofaturamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-excluir-contratofaturamento',
  templateUrl: './excluir-contratofaturamento.component.html',
  providers: [MaskService],
  styleUrls: []

})

export class ExcluirContratoFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public contratoFaturamento: ContratoFaturamento
  public contratoFaturamentoForm: FormGroup;
  public contratoFaturamentoId: string = "";

  swal: SweetAlertAdviceService;
  mesAnoMask = this._maskService.MesAno();

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public clientes: Cliente[];
  public tipoContratos: TipoContrato[];
  public situacaoContratos: SituacaoContrato[];
  public eventoFaturamentos: EventoFaturamento[];

  public errors: any[] = [];

  selectDiaVencimento = [
    { id: '', value: '' },
    { id: 1, value: '01' },
    { id: 2, value: '02' },
    { id: 3, value: '03' },
    { id: 4, value: '04' },
    { id: 5, value: '05' },
    { id: 6, value: '06' },
    { id: 7, value: '07' },
    { id: 8, value: '08' },
    { id: 9, value: '09' },
    { id: 10, value: '10' },
    { id: 11, value: '11' },
    { id: 12, value: '12' },
    { id: 13, value: '13' },
    { id: 14, value: '14' },
    { id: 15, value: '15' },
    { id: 16, value: '16' },
    { id: 17, value: '17' },
    { id: 18, value: '18' },
    { id: 19, value: '19' },
    { id: 20, value: '20' },
    { id: 21, value: '21' },
    { id: 22, value: '22' },
    { id: 23, value: '23' },
    { id: 24, value: '24' },
    { id: 25, value: '25' },
    { id: 26, value: '26' },
    { id: 27, value: '27' },
    { id: 28, value: '28' },
    { id: 29, value: '29' },
    { id: 30, value: '30' },
    { id: 31, value: '31' }
  ];

  constructor(
    private contratoFaturamentoService: ContratoFaturamentoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      clienteId: {
        required: 'Cliente requerido.'
      },
      tipoContratoId: {
        required: 'Tipo Contrato requerido.'
      },
      situacaoContratoId: {
        required: 'Situa&ccedil&atildeo Contrato requerido.'
      },
      eventoFaturamentoId: {
        required: 'Evento Faturamento requerido.'
      },
      codigo: {
        required: 'Codigo requerido.'
      },
      sigla: {
        required: 'Sigla requerida.'
      },
      descricao: {
        required: 'Descri&ccedil&atildeo requerida.'
      },
      dataEmissao: {
        required: 'Data Emiss&atildeo requerida.'
      },
      mesAnoInicio: {
        required: 'M&ecircs Ano Inicio requerido.'
      },
      diaVencimento: {
        required: 'Dia Vencimento requerido.'
      },
      mesInicioFaturamento: {
        required: 'M&ecircs Inicio Faturamento requerido.'
      },
      // qtdeDiaVencimento:{
      //   required:'Valor Qde de vencimento requerido.'
      // },
      valorContrato: {
        required: 'Valor Contrato requerido.'
      },
      valorOriginal: {
        required: 'Valor Original requerido.'
      },
      dataTermino: {
        required: 'Data Termino requerida.'
      },
      percentual: {
        required: 'Percentual requerido.'
      },
      percentualCobrado: {
        required: 'Percentual Cobrado requerido.'
      },
      valor: {
        required: 'Valor requerido.'
      },
      iniciaEm: {
        required: 'Inicia Em requerido.'
      },
      valorAdicionalEmpregado: {
        required: 'Valor Adicional Empregado requerido.'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contratoFaturamento = new ContratoFaturamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.contratoFaturamentoForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      tipoContratoId: ['', [Validators.required]],
      situacaoContratoId: ['', [Validators.required]],
      eventoFaturamentoId: ['', [Validators.required]],
      excluido: 'N',
      codigo: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      dataEmissao: ['', [Validators.required]],
      mesAnoInicio: ['', [Validators.required]],
      diaVencimento: ['', [Validators.required]],
      mesInicioFaturamento: ['', [Validators.required]],
      qtdeDiaVencimento: '',
      definirDataTermino: 'N',
      dataTermino: ['', [Validators.required]],
      valorContrato: ['', [Validators.required]],
      valorOriginal: ['', [Validators.required]],
      descontoAdimplencia: 'N',
      percentual: ['', [Validators.required]],
      cobrarAdicionalAnual: 'N',
      percentualValorContrato: 'N',
      percentualCobrado: ['', [Validators.required]],
      valorFixo: 'N',
      valor: ['', [Validators.required]],
      proporcionalDataInicio: 'N',
      valorUltimoFaturamento: 'N',
      faturarComContrato: 'N',
      iniciaEm: ['', [Validators.required]],
      copiaContrato: '',
      documentoVinculado: '',
      adicionalFuncionarios: 'N',
      numeroContratado: ['', [Validators.required]],
      valorAdicionalEmpregado: ['', [Validators.required]],
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.contratoFaturamentoId = params['id'];
        this.obterContratoFaturamento(this.contratoFaturamentoId);
      });

    this.contratoFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.contratoFaturamentoService.obterTodosTipoContrato()
      .subscribe(tipoContratos => {
        this.tipoContratos = tipoContratos
      },
        error => this.errors);

    this.contratoFaturamentoService.obterTodosSituacaoContrato()
      .subscribe(situacaoContratos => {
        this.situacaoContratos = situacaoContratos
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerContratoFaturamento();
      }
      else {
        self.cancelar();
      }
    });
  }


  obterContratoFaturamento(id: string) {
    this.contratoFaturamentoService.obterContratoFaturamento(id)
      .subscribe(
        ContratoFaturamento => this.preencherContratoFaturamentoForm(ContratoFaturamento),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }


  preencherContratoFaturamentoForm(contratoFaturamento: ContratoFaturamento): void {
    this.contratoFaturamento = contratoFaturamento;

    this.contratoFaturamentoForm.controls['codigo'].disable();

    this.contratoFaturamentoForm.patchValue({
      id: contratoFaturamento.id,
      codigo: contratoFaturamento.codigo,
      grupoEmpresaId: contratoFaturamento.grupoEmpresaId,
      empresaId: contratoFaturamento.empresaId,
      clienteId: contratoFaturamento.clienteId,
      tipoContratoId: contratoFaturamento.tipoContratoId,
      situacaoContratoId: contratoFaturamento.situacaoContratoId,
      eventoFaturamentoId: contratoFaturamento.eventoFaturamentoId,
      excluido: contratoFaturamento.excluido,
      sigla: contratoFaturamento.sigla,
      descricao: contratoFaturamento.descricao,
      dataEmissao: this._utilService.ToDate(contratoFaturamento.dataEmissao),
      mesAnoInicio: contratoFaturamento.mesAnoInicio,
      diaVencimento: contratoFaturamento.diaVencimento,
      mesInicioFaturamento: contratoFaturamento.mesInicioFaturamento,
      qtdeDiaVencimento: contratoFaturamento.qtdeDiaVencimento,
      definirDataTermino: contratoFaturamento.definirDataTermino,
      dataTermino: contratoFaturamento.dataTermino,
      valorContrato: contratoFaturamento.valorContrato,
      valorOriginal: contratoFaturamento.valorOriginal,
      descontoAdimplencia: contratoFaturamento.descontoAdimplencia,
      percentual: contratoFaturamento.percentual,
      cobrarAdicionalAnual: contratoFaturamento.cobrarAdicionalAnual,
      percentualValorContrato: contratoFaturamento.percentualValorContrato,
      percentualCobrado: contratoFaturamento.percentualCobrado,
      valorFixo: contratoFaturamento.valorFixo,
      valor: contratoFaturamento.valor,
      proporcionalDataInicio: contratoFaturamento.proporcionalDataInicio,
      valorUltimoFaturamento: contratoFaturamento.valorUltimoFaturamento,
      faturarComContrato: contratoFaturamento.faturarComContrato,
      iniciaEm: contratoFaturamento.iniciaEm,
      copiaContrato: contratoFaturamento.copiaContrato,
      documentoVinculado: contratoFaturamento.documentoVinculado,
      adicionalFuncionarios: contratoFaturamento.adicionalFuncionarios,
      numeroContratado: contratoFaturamento.numeroContratado,
      valorAdicionalEmpregado: contratoFaturamento.valorAdicionalEmpregado

    });
  }

  removerContratoFaturamento() {
    this.contratoFaturamentoService.removerContratoFaturamento(this.contratoFaturamento)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Contrato Faturamento removido com sucesso!');
          this.router.navigate(['contratofaturamento/lista']);
        },
        error => {
          error => this.errors;
        });
  }

  cancelar() {
    this.router.navigate(['contratofaturamento/editar/' + this.contratoFaturamentoId]);
  }

  ConsultaEmpresa(idEmpresa) {
    this.empresas = [];
    this.contratoFaturamentoService.obterTodosEmpresa(idEmpresa)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaClienteAndEvento(idEmpresa) {
    this.clientes = [];
    this.contratoFaturamentoService.obterTodosCliente(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);

    this.eventoFaturamentos = [];
    this.contratoFaturamentoService.obterEventoFaturamentoPorEmpresa(idEmpresa)
      .subscribe(eventoFaturamentos => {
        this.eventoFaturamentos = eventoFaturamentos
      },
        error => this.errors);
  }

}





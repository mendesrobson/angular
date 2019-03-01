import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { BaixaPagarReceberPgto, HistoricoPadrao, TipoPagamento, ControleCartao } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { ContaCorrente } from '../../titulo/models/titulo';
import { ListaBaixapgtoComponent } from '../lista-baixapgto/lista-baixapgto.component';
import { Administradoracartao } from '../../../cadastros/administradoracartao/models/administradoracartao';
import { ChequeFolha, ChequeFolhaHistorico } from '../../../cadastros/chequeproprio/models/chequeproprio';
import { Banco } from '../../../cadastros/contacorrente/models/contacorrente';


@Component({
  selector: 'app-adicionar-baixapgto',
  templateUrl: './adicionar-baixapgto.component.html',
  styleUrls: ['./adicionar-baixapgto.component.css']
})
export class AdicionarBaixapgtoComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  public modalListaVisible: boolean;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public baixaPagarReceberPgto: BaixaPagarReceberPgto;
  public baixaPagarReceberPgtos = [];
  public baixaPgtoForm: FormGroup;

  public contaCorrentes: ContaCorrente[];
  public contaCaixas: ContaCorrente[];
  public historicoPadraos: HistoricoPadrao[];
  public tipoPagamento: TipoPagamento[];
  public administradoraCartaos: Administradoracartao[];
  public chequeFolhas: ChequeFolha[];
  public natureza: string = "";
  public bancos: Banco[];
  public valorBaixar: number;

  selectedEntities: any[];

  constructor(private tituloParcelaBaixaService: TituloParcelaBaixaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
    private listBaixaPgto: ListaBaixapgtoComponent) {

    this.validationMessages = {
      siglaTipoPagamento: {
        required: 'Tipo de Pagamento requerido.'
      },
      valor: {
        required: 'Valor requerido.'
      },
      contaCorrenteId: {
        required: 'Conta requerida.'
      },
      historicoPadraoId: {
        required: 'Histórico Padrão requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.baixaPagarReceberPgto = new BaixaPagarReceberPgto();
    this.swal = new SweetAlertAdviceService();
    this.modalListaVisible = false;
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
      }
    )

    this.baixaPgtoForm = this.fb.group({
      id: 0,
      baixaPagarReceberId: '',
      siglaTipoPagamento: ['', [Validators.required]],
      tipoPagamento: '',
      valor: [0, [Validators.required]],
      historicoPadraoId: [0, [Validators.required]],
      movimentoContaId: 0,
      contaCorrenteId: [0, [Validators.required]],
      cartaoId: 0,
      chequeFolhaId: 0,
      excluido: 'N',
      contaCorrente: '',
      historicoPadrao: '',
      administradoraCartaoId: 0,
      codigoAprovacao: '',
      quantidadeParcelas: 1,
      parceladoPelaAdministradora: 'N',
      bancoId: 0,
      agencia: '',
      conta: '',
      cheque: '',
      emitente: '',
      dataDeposito: '',
      chequeFolha: ''

    });

    let idEmpresa = this.tituloParcelaBaixaComponent.BaixaPagarReceber.empresaId;

    this.contaCorrentes = [];
    this.historicoPadraos = [];

    this.tituloParcelaBaixaService.obterTodosContaCorrentePorEmpresaId(idEmpresa.toString())
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        () => { });

    this.tituloParcelaBaixaService.obterTodosHistoricoPadraoPorEmpresa(idEmpresa.toString())
      .subscribe(result => {
        this.historicoPadraos = result;
      },
        () => { });

    if (this.natureza == "receber") {
      this.tituloParcelaBaixaService.obterTodosTipoPagamentoReceber()
        .subscribe(resultado => {
          this.tipoPagamento = resultado;
        },
          () => { });

    } else if (this.natureza == "pagar") {
      this.tituloParcelaBaixaService.obterTodosTipoPagamentoPagar()
        .subscribe(resultados => {
          this.tipoPagamento = resultados;
        },
          () => { });
    }

    this.tituloParcelaBaixaService.obterTodosContaCaixaPorEmpresaId(idEmpresa.toString())
      .subscribe(contaCaixa => {
        this.contaCaixas = contaCaixa;
      },
        () => { }); // por empresa

    this.tituloParcelaBaixaService.obterTodosAdministradoraCartaoPorEmpresaId(idEmpresa.toString())
      .subscribe(administradoraCartaos => {
        this.administradoraCartaos = administradoraCartaos
      },
        () => { }); // por empresa


    this.tituloParcelaBaixaService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos
      },
        () => { });


    this.valorBaixar = this.tituloParcelaBaixaService.getValorABaixar(this.tituloParcelaBaixaComponent.Parcelas, this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos);

    if (this.valorBaixar == 0) {
      this.baixaPgtoForm.get('siglaTipoPagamento').disable();
      this.baixaPgtoForm.get('valor').disable();
    } else {
      this.baixaPgtoForm.get('valor').enable();
      this.baixaPgtoForm.get('siglaTipoPagamento').enable();
    }
    this.baixaPgtoForm.controls['valor'].setValue(this.valorBaixar);
  }

  adicionarBaixaPgto() {

    if (this.baixaPgtoForm.dirty && this.baixaPgtoForm.valid) {
      let p = Object.assign({}, this.baixaPagarReceberPgto, this.baixaPgtoForm.getRawValue());

      p.id = 0;
      p.movimentoContaId = null;

      if (this.natureza == "receber") {
        if (p.siglaTipoPagamento == "CHQ") {
          let modelChequeFolha = new ChequeFolha();
          let modelChequeFolhaHistorico = new ChequeFolhaHistorico();

          modelChequeFolha.id = 0;
          modelChequeFolha.empresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.empresaId;
          modelChequeFolha.grupoEmpresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.grupoEmpresaId;
          modelChequeFolha.bancoId = p.bancoId;
          modelChequeFolha.agencia = p.agencia;
          modelChequeFolha.conta = p.conta;
          modelChequeFolha.numCheque = p.cheque;
          modelChequeFolha.emitente = p.emitente;
          modelChequeFolha.dataDeposito = p.dataDeposito;
          modelChequeFolha.valor = p.valor;
          modelChequeFolha.flagPagarReceber = "R";

          let date = new Date();
          let dataAtual = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString();

          modelChequeFolhaHistorico.id = 0;
          modelChequeFolhaHistorico.dataEmissao = dataAtual;
          modelChequeFolhaHistorico.situacaoChequeId = 21;
          modelChequeFolhaHistorico.situacaoCheque = null;

          p.chequeFolha = modelChequeFolha;
          p.chequeFolha.chequeFolhaHistorico = new Array();
          p.chequeFolha.chequeFolhaHistorico.push(modelChequeFolhaHistorico);

        }
      }

      if (p.contaCorrenteId == null) {
        p.contaCorrenteId = this.tituloParcelaBaixaComponent.baixaPagarReceber.contaCorrenteId;
      }


      this.baixaPagarReceberPgto = p;

      if (this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos.length > 0) {
        p.id = this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos.length + 1;
      }

      for (let i = 0; this.tipoPagamento.length > i; i++) {
        if (p.siglaTipoPagamento == this.tipoPagamento[i].sigla) {
          p.tipoPagamento = this.tipoPagamento[i].descricao;
        }
      }

      for (let i = 0; this.contaCorrentes.length > i; i++) {
        if (this.baixaPagarReceberPgto.contaCorrenteId == this.contaCorrentes[i].id) {
          this.baixaPagarReceberPgto.contaCorrente = this.contaCorrentes[i];
        }
      }

      for (let i = 0; this.contaCaixas.length > i; i++) {
        if (this.baixaPagarReceberPgto.contaCorrenteId == this.contaCaixas[i].id) {
          this.baixaPagarReceberPgto.contaCorrente = this.contaCaixas[i];
        }
      }

      for (let i = 0; this.historicoPadraos.length > i; i++) {
        if (this.baixaPagarReceberPgto.historicoPadraoId == this.historicoPadraos[i].id) {
          this.baixaPagarReceberPgto.historicoPadrao = this.historicoPadraos[i];
        }
      }

      let controleCat: ControleCartao = new ControleCartao();
      controleCat.administradoraCartaoId = p.administradoraCartaoId;
      controleCat.codigoAprovacao = p.codigoAprovacao;
      controleCat.qtdeParcelas = p.quantidadeParcelas;
      controleCat.flagParceladoPeloAdmin = p.parceladoPelaAdministradora;
      this.baixaPagarReceberPgto.controleCartao = new ControleCartao();
      this.baixaPagarReceberPgto.controleCartao = controleCat;

      p.empresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.empresaId;
      p.grupoEmpresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.grupoEmpresaId;

      this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos.push(p);
      this.listBaixaPgto.baixaPgtoGravado('Forma de Pagamento, adicionado com sucesso!');
      this.close();
    }
  }

  public showModal2(modal: string): void {
    if (modal == 'modalLista') {
      this.modalListaVisible = true;
    }
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  public setSelectedEntities($event: any) {
    this.selectedEntities = $event;

    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      this.baixaPgtoForm.controls['chequeFolhaId'].setValue(null);
      this.baixaPgtoForm.controls['valor'].setValue(this.valorBaixar);
    }
    else {
      this.baixaPgtoForm.controls['chequeFolhaId'].setValue(this.selectedEntities[0].id);
      if (this.selectedEntities[0].valor > 0) {
        this.baixaPgtoForm.controls['valor'].setValue(this.selectedEntities[0].valor);
      }
    }
  }

  buscarChequeFolha(siglaTipoPagamento) {

    if (siglaTipoPagamento == "CHQP") {
      this.tituloParcelaBaixaService.obterTodosChequeFolha("P")
        .subscribe(chequeFolhas => {
          this.chequeFolhas = chequeFolhas;
        },
          error => this.errors);
    } else if (siglaTipoPagamento == "CHQT") {
      this.tituloParcelaBaixaService.obterTodosChequeFolha("R")
        .subscribe(chequeFolhas => {
          this.chequeFolhas = chequeFolhas;
        },
          error => this.errors);
    }
  }
}
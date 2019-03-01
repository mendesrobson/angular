import { Component, OnInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
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
import { UtilService } from '../../../services/util.service';


@Component({
  selector: 'app-consultar-baixapgto',
  templateUrl: './consultar-baixapgto.component.html',
  styleUrls: ['./consultar-baixapgto.component.css']
})
export class ConsultarBaixapgtoComponent implements OnInit {
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
  public siglaTipoPagamento: string = "";

  selectedEntities: any[];

  constructor(private tituloParcelaBaixaService: TituloParcelaBaixaService,
    private _maskService: MaskService, private _utilService: UtilService,
    private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
    private listBaixaPgto: ListaBaixapgtoComponent) {

    this.baixaPagarReceberPgto = new BaixaPagarReceberPgto();
    this.swal = new SweetAlertAdviceService();
    this.modalListaVisible = false;
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
      }
    );

    // this.baixaPgtoForm = new FormGroup({
    //   id: new FormControl({value: 0, disabled: true}),
    //   baixaPagarReceberId: new FormControl({value: 0, disabled: true}),
    //   siglaTipoPagamento: new FormControl({value: '', disabled: true}),
    //   tipoPagamento: new FormControl({value: '', disabled: true}),
    //   valor: new FormControl({value: '', disabled: true}),
    //   historicoPadraoId: new FormControl({value: '', disabled: true}),
    //   movimentoContaId:new FormControl({value: '', disabled: true}),
    //   contaCorrenteId: new FormControl({value: '', disabled: true}),
    //   cartaoId: new FormControl({value: 0, disabled: true}),
    //   chequeFolhaId: new FormControl({value: 0, disabled: true}),
    //   excluido: new FormControl({value: 'N', disabled: true}),
    //   contaCorrente: new FormControl({value: '', disabled: true}),
    //   historicoPadrao: new FormControl({value: '', disabled: true}),
    //   administradoraCartaoId: new FormControl({value: 0, disabled: true}),
    //   codigoAprovacao: new FormControl({value: '', disabled: true}),
    //   quantidadeParcelas: new FormControl({value: 1, disabled: true}),
    //   parceladoPelaAdministradora: new FormControl({value: 'N', disabled: true}),
    //   bancoId: new FormControl({value:0, disabled: true}),
    //   agencia: new FormControl({value: '', disabled: true}),
    //   conta: new FormControl({value: '', disabled: true}),
    //   cheque: new FormControl({value: '', disabled: true}),
    //   emitente: new FormControl({value: '', disabled: true}),
    //   dataDeposito: new FormControl({value: '', disabled: true}),
    //   chequeFolha: new FormControl({value: '', disabled: true})
    // });

    this.baixaPgtoForm = this.fb.group({
      id: 0,
      baixaPagarReceberId: '',
      siglaTipoPagamento: [''],
      tipoPagamento: '',
      valor: [0],
      historicoPadraoId: [0],
      movimentoContaId: 0,
      contaCorrenteId: [0],
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

    this.tituloParcelaBaixaService.obterTodosContaCorrentePorEmpresa(idEmpresa.toString())
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
        this.bancos = bancos;
      },
        () => { });


    this.siglaTipoPagamento = this.tituloParcelaBaixaComponent.BaixaPagarReceberPgto.siglaTipoPagamento;
    this.preencherBaixapgto(this.tituloParcelaBaixaComponent.BaixaPagarReceberPgto);
  }

  preencherBaixapgto(baixa: BaixaPagarReceberPgto) {

    if (this.contaCorrentes != null) {
      for (let i = 0; this.contaCorrentes.length > i; i++) {
        if (baixa.contaCorrenteId == this.contaCorrentes[i].id) {
          baixa.contaCorrente = this.contaCorrentes[i];
        }
      }
    }

    if (this.contaCaixas != null) {
      for (let i = 0; this.contaCaixas.length > i; i++) {
        if (baixa.contaCorrenteId == this.contaCaixas[i].id) {
          baixa.contaCorrente = this.contaCaixas[i];
        }
      }
    }

    if (this.historicoPadraos != null) {
      for (let i = 0; this.historicoPadraos.length > i; i++) {
        if (baixa.historicoPadraoId == this.historicoPadraos[i].id) {
          baixa.historicoPadrao = this.historicoPadraos[i];
        }
      }
    }

    
    this.baixaPgtoForm.patchValue({
      siglaTipoPagamento: baixa.siglaTipoPagamento,
      baixaPagarReceberId: baixa.baixaPagarReceberId,
      tipoPagamento: baixa.tipoPagamento,
      valor: baixa.valor,
      historicoPadraoId: baixa.historicoPadraoId != null ? baixa.historicoPadraoId : null,
      movimentoContaId: baixa.movimentoContaId != null ? baixa.movimentoContaId : null,
      contaCorrenteId: baixa.contaCorrenteId != null ? baixa.contaCorrenteId : null,
      cartaoId: baixa.cartaoId != null ? baixa.cartaoId : null,
      chequeFolhaId: baixa.chequeFolhaId != null ? baixa.chequeFolhaId : null,
      contaCorrente: baixa.contaCorrente != null ? baixa.contaCorrente : null,
      historicoPadrao: baixa.historicoPadrao != null ? baixa.historicoPadrao : null,
      administradoraCartaoId: baixa.controleCartao != undefined || baixa.controleCartao != null ? baixa.controleCartao.administradoraCartaoId : 0,
      codigoAprovacao: baixa.controleCartao != undefined || baixa.controleCartao != null ? baixa.controleCartao.codigoAprovacao : 0,
      quantidadeParcelas: baixa.controleCartao != null ? baixa.controleCartao.qtdeParcelas : 0,
      parceladoPelaAdministradora: baixa.controleCartao != null ? baixa.controleCartao.flagParceladoPeloAdmin : null,
      bancoId: baixa.chequeFolha != null ? baixa.chequeFolha.bancoId : null,
      agencia: baixa.chequeFolha != null ? baixa.chequeFolha.agencia : null,
      conta: baixa.chequeFolha != null ? baixa.chequeFolha.conta : null,
      cheque: baixa.chequeFolha != null ? baixa.chequeFolha.numCheque : null,
      emitente: baixa.chequeFolha != null ? baixa.chequeFolha.emitente : null,
      dataDeposito: baixa.chequeFolha != undefined && baixa.chequeFolha != null ? this._utilService.ToDate(baixa.chequeFolha.dataDeposito): ''
    });

    this.baixaPgtoForm.disable();
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  buscarChequeFolha(siglaTipoPagamento) {
    console.log(siglaTipoPagamento);
    if (siglaTipoPagamento == "CHQP") {
      this.tituloParcelaBaixaService.obterTodosChequeFolha("P")
        .subscribe(chequeFolhas => {
          this.chequeFolhas = chequeFolhas;
        },
          () => this.errors);
    } else if (siglaTipoPagamento == "CHQT") {
      this.tituloParcelaBaixaService.obterTodosChequeFolha("R")
        .subscribe(chequeFolhas => {
          this.chequeFolhas = chequeFolhas;
        },
          () => this.errors);
    }
  }
  
  // adicionarBaixaPgto() {

  //   if (this.baixaPgtoForm.dirty && this.baixaPgtoForm.valid) {
  //     let p = Object.assign({}, this.baixaPagarReceberPgto, this.baixaPgtoForm.getRawValue());
  //     console.log(p);

  //     if (this.natureza == "receber") {
  //       if (p.siglaTipoPagamento == "CHQ") {
  //         let modelChequeFolha = new ChequeFolha();
  //         let modelChequeFolhaHistorico = new ChequeFolhaHistorico();

  //         modelChequeFolha.id = 0;
  //         modelChequeFolha.empresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.empresaId;
  //         modelChequeFolha.grupoEmpresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.grupoEmpresaId;
  //         modelChequeFolha.bancoId = p.bancoId;
  //         modelChequeFolha.agencia = p.agencia;
  //         modelChequeFolha.conta = p.conta;
  //         modelChequeFolha.numCheque = p.cheque;
  //         modelChequeFolha.emitente = p.emitente;
  //         modelChequeFolha.dataDeposito = p.dataDeposito;
  //         modelChequeFolha.valor = p.valor;
  //         modelChequeFolha.flagPagarReceber = "R";

  //         let date = new Date();
  //         let dataAtual = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString();

  //         modelChequeFolhaHistorico.id = 0;
  //         modelChequeFolhaHistorico.dataEmissao = dataAtual;
  //         modelChequeFolhaHistorico.situacaoChequeId = 21;
  //         modelChequeFolhaHistorico.situacaoCheque = null;

  //         p.chequeFolha = modelChequeFolha;
  //         p.chequeFolha.chequeFolhaHistorico = new Array();
  //         p.chequeFolha.chequeFolhaHistorico.push(modelChequeFolhaHistorico);

  //       }
  //     }
      
  //     this.baixaPagarReceberPgto = p;

  //     for (let i = 0; this.tipoPagamento.length > i; i++) {
  //       if (p.siglaTipoPagamento == this.tipoPagamento[i].sigla) {
  //         p.tipoPagamento = this.tipoPagamento[i].descricao;
  //       }
  //     }

  //     for (let i = 0; this.contaCorrentes.length > i; i++) {
  //       if (this.baixaPagarReceberPgto.contaCorrenteId == this.contaCorrentes[i].id) {
  //         this.baixaPagarReceberPgto.contaCorrente = this.contaCorrentes[i];
  //       }
  //     }

  //     for (let i = 0; this.contaCaixas.length > i; i++) {
  //       if (this.baixaPagarReceberPgto.contaCorrenteId == this.contaCaixas[i].id) {
  //         this.baixaPagarReceberPgto.contaCorrente = this.contaCaixas[i];
  //       }
  //     }

  //     for (let i = 0; this.historicoPadraos.length > i; i++) {
  //       if (this.baixaPagarReceberPgto.historicoPadraoId == this.historicoPadraos[i].id) {
  //         this.baixaPagarReceberPgto.historicoPadrao = this.historicoPadraos[i];
  //       }
  //     }

  //     let controleCat: ControleCartao = new ControleCartao();
  //     controleCat.administradoraCartaoId = p.administradoraCartaoId;
  //     controleCat.codigoAprovacao = p.codigoAprovacao;
  //     controleCat.qtdeParcelas = p.quantidadeParcelas;
  //     controleCat.flagParceladoPeloAdmin = p.parceladoPelaAdministradora;
  //     this.baixaPagarReceberPgto.controleCartao = new ControleCartao();
  //     this.baixaPagarReceberPgto.controleCartao = controleCat;

  //     p.empresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.empresaId;
  //     p.grupoEmpresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.grupoEmpresaId;

  //     for (var i = 0; i < this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos.length; i++) {
  //       if (p.id == this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos[i].id) {
  //         this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos.splice(i, 1);
  //       }
  //     }

  //     this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos.push(p);
  
  //     this.listBaixaPgto.baixaPgtoGravado('Forma de Pagamento, Editado com sucesso!');
  //     this.close();
  //   }
  // }

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
}
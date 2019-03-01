import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { DateUtils } from '../../../utils/date.utils';
import { Renegociacao, RenegociacaoParcela, FiltroRenegociacao, TipoCobranca } from '../models/renegociacao';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { RenegociacaoService } from '../renegociacao.service';
import { Subscription } from 'rxjs';
import { Parcela, ConfiguracaoPagamento, ContaCorrente, Desconto, Titulo } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { RenegociacaoComponent } from '../renegociacao.component';
import { UtilService } from '../../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';
import { getYear, getMonth } from 'date-fns';
import { NumberFormatStyle } from '@angular/common';


@Component({
  selector: 'app-adicionar-renegociacao',
  templateUrl: './adicionar-renegociacao.component.html',
  styleUrls: ['./adicionar-renegociacao.component.css']//,
  // providers: [DateUtils]
})
//export class AdicionarRenegociacaoComponent implements OnInit {
export class AdicionarRenegociacaoComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  //public filtroRenegociacaoForm: FormGroup;
  public gerarRenegociacaoForm: FormGroup;
  //public filtroRenegociacao: FiltroRenegociacao;
  public renegociacao: Renegociacao;

  busy: Subscription;
  public sub: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  configuracaoPagamentos: ConfiguracaoPagamento[];
  confPagamento: ConfiguracaoPagamento;
  contaCorrentes: ContaCorrente[];
  descontos: Desconto[];
  tipoCobrancas: TipoCobranca[];
  titulo: Titulo;

  public natureza: string = "";

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  swal: SweetAlertAdviceService;
  public innerHtml: SafeHtml;

  public myDatePickerOptions = DateUtils.getMyDatePickerDefaultOptions();

  displayMessage: { [key: string]: string } = {};

  public data: any[];

  carregarTable: boolean = false;

  srcImagem: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];
  public modalVisible: boolean;
  percOrValor = '$';

  selectedEntities: any[];

  myOptionsClientes: IMultiSelectOption[] = [];

  mySettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-secondary',
    containerClasses: 'dropdown-inline',
    showCheckAll: true,
    showUncheckAll: true,
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
  };

  myTexts: IMultiSelectTexts = {
    checkAll: 'Marcar todos',
    uncheckAll: 'Desmarcar todos',
    checked: 'selecionado',
    checkedPlural: 'selecionados',
    searchPlaceholder: 'Pesquisar',
    searchEmptyResult: 'Pesquisando...',
    searchNoRenderText: 'Não encontrado',
    defaultTitle: 'Selecione',
    allSelected: 'Todos'
  };

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(private fb: FormBuilder,
    private renegociacaoService: RenegociacaoService,
    private router: Router,
    private route: ActivatedRoute,
    private renegociacaoComponent: RenegociacaoComponent,
    private _utilService: UtilService
  ) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'O Grupo Empresa é requerido.'
      },
      empresaId: {
        required: 'A Empresa é requerida.'
      },
      configuracaoPagamentoId: {
        required: 'Configuração de Pagamento é requerido.'
      },
      contaCorrenteId: {
        required: 'Conta Corrente é requerida.'
      },
      clienteId: {
        required: 'Cliente é requerido.'
      },
      fornecedorId: {
        required: 'Fornecedor é requerido.'
      },
      tipoCobrancaId: {
        required: 'Tipo de Cobrança é requerido.'
      }

    };


    this.genericValidator = new GenericValidator(this.validationMessages);
    this.renegociacao = new Renegociacao();
    this.titulo = new Titulo();
    this.modalVisible = false;
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.srcImagem = '';
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];

      }
    )

    this.gerarRenegociacaoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      valorDesconto: 0,
      valorAbono: 0,
      valorAcrescimo: 0,
      observacao: '',
      configuracaoPagamentoId: [0, [Validators.required]],

      quantidadeParcela: '',
      periodicidade: '',
      numeroDiaUtil: '',
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

      contaCorrenteId: [0, [Validators.required]],
      descontoId: 0,
      tipoCobrancaId: [0, [Validators.required]],
      dataRenegociacao: '',
      clienteId: [0, [Validators.required]],
      fornecedorId: [0, [Validators.required]]
    });

    this.renegociacaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.renegociacaoService.obterTodosTipoCobranca()
      .subscribe(tipoCobrancas => {
        this.tipoCobrancas = tipoCobrancas
      },
        error => this.errors);

    this.data = [];

  }


  finalizarRenegociacao(): void {

    this.renegociacao.renegociacaoParcela = new Array();

    if (this.natureza == 'receber') {
      this.titulo.naturezaId = 1;
      this.titulo.fornecedorId = null;
      this.renegociacao.naturezaId = 1;
      this.renegociacao.fornecedorId = null;
      this.titulo.clienteId = this.renegociacaoComponent.Renegociacao.clienteId.toString();
    } else {
      this.titulo.naturezaId = 2;
      this.titulo.clienteId = null;
      this.renegociacao.naturezaId = 2;
      this.renegociacao.clienteId = null;
      this.titulo.fornecedorId = this.renegociacaoComponent.Renegociacao.fornecedorId.toString();
    }

    for (let i = 0; this.renegociacaoComponent.Parcelas.length > i; i++) {
      let renegociacaoParcela = new RenegociacaoParcela();

      renegociacaoParcela.empresaId = this.renegociacao.empresaId;
      renegociacaoParcela.grupoEmpresaId = this.renegociacao.grupoEmpresaId;
      renegociacaoParcela.parcelaId = this.renegociacaoComponent.Parcelas[i].id;

      this.renegociacao.renegociacaoParcela.push(renegociacaoParcela);

      this.renegociacaoComponent.Parcelas[i].situacaoId = 4;
      this.renegociacaoComponent.Parcelas[i].situacao = 'REN';
    }

    this.titulo.tipoDocumentoId = '1';
    this.titulo.origemId = '1';
    this.titulo.documento = "REN-" + this.renegociacaoComponent.Parcelas[0].documento;
    this.titulo.valorRetencoes = 0;

    let date = new Date();
    let dataAtual = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString();
    this.titulo.dataEmissao = dataAtual;

    this.titulo.parcela = [];
    for (var i = 0; i < this.renegociacaoComponent.ParcelasRenegociadas.length; i++) {
      this.titulo.parcela.push(this.renegociacaoComponent.ParcelasRenegociadas[i]);
    }

    if (this.renegociacao.descontoId == 0) {
      this.renegociacao.descontoId = null;
    }

    console.log(this.titulo);
    this.busy = this.renegociacaoService.AdicionarTitulo(this.titulo)
      .subscribe(result => {

        this.renegociacao.tituloId = result.id;

        this.busy = this.renegociacaoService.AdicionarRenegociacao(this.renegociacao)
          .subscribe(result => {

            this.busy = this.renegociacaoService.AtualizarSituacaoParcela(this.renegociacaoComponent.Parcelas)
              .subscribe(result => {
                this.swal.showSwalSuccess('Renegociação concluída com Sucesso!');

                if (this.natureza == "receber") {
                  this.router.navigate(['renegociacao/lista/receber']);
                } else if (this.natureza == "pagar") {
                  this.router.navigate(['renegociacao/lista/pagar']);
                }

              })

          }
          )

      })
  }

  popularConfiguracaoPagamento(id) {
    this.renegociacaoService.obterConfiguracaoPagamentoId(id)
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

    this.gerarRenegociacaoForm.patchValue({
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

  gerarRenegociacao(): void {
    if (this.gerarRenegociacaoForm.dirty /*&& this.gerarRenegociacaoForm.valid*/) {
      let p = Object.assign({}, this.renegociacao, this.gerarRenegociacaoForm.getRawValue());

      this.renegociacaoComponent.ParcelasRenegociadas = [];
      this.renegociacao = p;
      this.renegociacao.dataRenegociacao = this.renegociacao.dataRenegociacao;

      this.renegociacao.valorRenegociacao = 0;

      if (this.natureza == 'receber') {
        this.renegociacao.naturezaId = 1;
        this.renegociacao.fornecedorId = null;
        this.renegociacao.clienteId = this.renegociacaoComponent.Renegociacao.clienteId;
      } else {
        this.renegociacao.naturezaId = 2;
        this.renegociacao.clienteId = null;
        this.renegociacao.fornecedorId = this.renegociacaoComponent.Renegociacao.fornecedorId;
      }

      for (let i = 0; this.renegociacaoComponent.Parcelas.length > i; i++) {
        this.renegociacao.valorRenegociacao = this.renegociacao.valorRenegociacao + this.renegociacaoComponent.Parcelas[i].valorLiquido;
        this.renegociacao.empresaId = this.renegociacaoComponent.Renegociacao.empresaId;
        this.renegociacao.grupoEmpresaId = this.renegociacaoComponent.Renegociacao.grupoEmpresaId;
      }

      /* Varificar se falor a renegociar não é negativo  */

      let vDesconto, vRenegociacao;
      vRenegociacao = (this.renegociacao.valorRenegociacao + this.renegociacao.valorAcrescimo - this.renegociacao.valorAbono);
      if (this.percOrValor == '$') {
        vDesconto = this.renegociacao.valorDesconto;
      } else if (this.percOrValor == '%') {
        vDesconto = (vRenegociacao * this.renegociacao.valorDesconto) / 100;
      }

      if (vDesconto != null) {
        vRenegociacao = (vRenegociacao - vDesconto);
      }

      vRenegociacao = (vRenegociacao / this.renegociacao.quantidadeParcela);

      if (vRenegociacao > 0.01) {
        this.renegociacaoComponent.renegociacao = this.renegociacao;

        this.busy = this.renegociacaoService.GerarTituloParcelaAngular(this.renegociacao)
          .subscribe(result => {
            this.titulo = result;
            this.renegociacaoComponent.ParcelasRenegociadas = [];

            for (let i = 0; this.titulo.parcela.length > i; i++) {
              this.titulo.parcela[i].id = i;
              this.renegociacaoComponent.ParcelasRenegociadas.push(this.titulo.parcela[i]);
            }
          }
          )
      } else {
        this.swal.showSwalErro("Valor Renegociação não pode ser negativo!");
      }
    }
  }



  public toasterMensagem(msg) {
    // this.toastr.success(msg, 'Sucesso', { dismiss: 'controlled' })
    //   .then((toast: Toast) => {
    //     setTimeout(() => {
    //       this.toastr.dismissToast(toast);

    //     }, 2500);
    //   });
  }


  selecionarParcelas() {
    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
    }
    else {
      this.parcelas = this.selectedEntities;
    }

  }


  onItemSelect(item: any) {
    this.selectedItems.push(item)
  }

  OnItemDeSelect(item: any) {
    for (var i = 0; i < this.selectedItems.length; i++) {
      if (item.id == this.selectedItems[i].id)
        this.selectedItems.splice(i, 1)
    }
  }

  onSelectAll(items: any) {
  }

  onDeSelectAll(items: any) {
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public setSelectedEntities($event: any) {
    this.selectedEntities = $event;
  }


  public setarValorsrcImagem(caminho: string): void {
    this.srcImagem = caminho + '.png';
  }

  public showModal(modal: string): void {
    if (this.renegociacaoComponent.Renegociacao.grupoEmpresaId == undefined) {
      this.swal.showSwalErro("Grupo, é requerido.");
    } else {
      if (this.renegociacaoComponent.Renegociacao.empresaId == undefined) {
        this.swal.showSwalErro("Empresa, é requerido.");
      } else {
        this.renegociacaoComponent.Parcelas = [];
        this.renegociacaoComponent.parcelasRenegociadas = [];
        this.titulo.parcela = null;

        if (modal == 'modalEditar') {
          this.modalEditVisible = true;
          this.modalAddVisible = false;
        }
        else if (modal == 'modalAdicionar') {
          this.modalEditVisible = false;
          this.modalAddVisible = true;
        }
      }
    }

  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  cancelar() {
    if (this.natureza == "receber") {
      this.router.navigate(['renegociacao/lista/receber']);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['renegociacao/lista/pagar']);
    }
  }

  editarParcela(parcela) {
    this.renegociacaoComponent.ParcelaRenegociada = parcela;

    this.modalEditVisible = true;
    this.modalAddVisible = false;

  }

  ConsultaEmpresa(idGrupo) {
    this.renegociacaoComponent.renegociacao.empresaId = undefined;
    this.empresas = [];

    this.renegociacaoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

  }

  ConsultaSelectEmpresa(idEmpresa) {

    this.renegociacaoComponent.renegociacao.empresaId = idEmpresa;

    this.contaCorrentes = [];
    this.renegociacaoService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

    this.configuracaoPagamentos = [];
    this.renegociacaoService.obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa)
      .subscribe(configuracaoPagamentos => {
        this.configuracaoPagamentos = configuracaoPagamentos
      },
        error => this.errors);

    this.descontos = [];
    this.renegociacaoService.obterTodosDescontoPorEmpresa(idEmpresa)
      .subscribe(descontos => {
        this.descontos = descontos
      },
        error => this.errors);


  }

  onChange_Desconto(DescID) {

    this.renegociacaoService.obterDescontoPorId(DescID)
      .subscribe(
        result => {

          if (result.percentualValor == '$') {
            this.percOrValor = '$';
          } else {
            this.percOrValor = '%';
          }
          this.gerarRenegociacaoForm.get('valorDesconto').setValue(result.valorAplicar);
          //this.calcValorDesconto();
        },
        error => {
          this.errors;
        });
  }

  // calcValorDesconto(){

  //   let vRenegociacao  = 0;
  //   let vDesconto = 0;
  //   let dAplicar = this.gerarRenegociacaoForm.get('descontoAplicar').value;

  //   for (let i = 0; this.renegociacaoComponent.Parcelas.length > i; i++) {
  //     vRenegociacao = vRenegociacao + this.renegociacaoComponent.Parcelas[i].valorLiquido;     
  //   }

  //   if (this.percOrValor == '$') {
  //     vDesconto = dAplicar;
  //   } else if (this.percOrValor == '%') {
  //     vDesconto = (vRenegociacao * dAplicar) / 100;
  //   }

  //   console.log(vDesconto);
  //   this.gerarRenegociacaoForm.get('valorDesconto').setValue(vDesconto);

  // }

}

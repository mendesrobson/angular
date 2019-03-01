import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControlName, FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { Subscription } from 'rxjs';
import { Parcela, ConfiguracaoPagamento, ContaCorrente, Desconto, Titulo } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ToastsManager, Toast } from 'ng2-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { UtilService } from '../../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaixaPagarReceber, FiltroBaixa, ParcelasPagasBaixa, TipoPagamento, HistoricoPadrao, ControleCartao, BaixaPagarReceberPgto } from '../models/tituloparcelabaixa';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';
import { ChequeFolha } from '../../../cadastros/chequeproprio/models/chequeproprio';

@Component({
  selector: 'app-editar-baixa',
  templateUrl: './editar-baixa.component.html',
  styleUrls: ['./editar-baixa.component.css']
})
export class EditarBaixaComponent implements OnInit {

  public filtroBaixaForm: FormGroup;
  public gerarBaixaForm: FormGroup;
  public filtroBaixa: FiltroBaixa;
  public baixa: BaixaPagarReceber;
  public baixas: BaixaPagarReceberPgto;
  public carregarListaBaixaPgto:boolean = false;

  busy: Subscription;
  public sub: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  contaCorrentes: ContaCorrente[];


  public natureza: string = "";
  public baixaId: string = "";

  public tipoPagamento: TipoPagamento[];

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
    private tituloParcelaBaixaService: TituloParcelaBaixaService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
    private _utilService: UtilService) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      condigo: {
        required: 'Codigo é requerido.'
      },
      data: {
        required: 'Data Baixa é requerida.'
      },
      contaCorrenteId: {
        required: 'Conta Caixa é requerido.'
      },
      valor: {
        required: 'Valor Baixa é requerido.'
      }

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroBaixa = new FiltroBaixa();
    this.modalVisible = false;
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.srcImagem = '';
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
      }
    )

    this.sub = this.route.params.subscribe(
      params => {
        this.baixaId = params['id'];
        this.obterBaixa(this.baixaId);

      });


    this.gerarBaixaForm = this.fb.group({
      empresaId: 0,
      grupoEmpresaId: 0,
      contaCorrenteId: [0, [Validators.required]],
      clienteId: 0,
      fornecedorId: 0,
      codigo: ['', [Validators.required]],
      data: ['', [Validators.required]],
      valor: [0, [Validators.required]],
      observacao: '',
      flagPagarReceber: 'N',
      excluido: 'N',

    });
    this.gerarBaixaForm.disable();

    if (this.natureza == "receber") {
      this.tituloParcelaBaixaService.obterTodosTipoPagamentoReceber()
        .subscribe(resultado => {
          this.tipoPagamento = resultado;
          this.filtroBaixa.naturezaId = 1;
        },
          () => { });
    } else {
      this.tituloParcelaBaixaService.obterTodosTipoPagamentoPagar()
        .subscribe(resultados => {
          this.tipoPagamento = resultados;
          this.filtroBaixa.naturezaId = 2;
        },
          () => { });
    }

    this.tituloParcelaBaixaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.tituloParcelaBaixaService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);


    this.tituloParcelaBaixaService.obterTodosContaCaixa()
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

    this.data = [];
    this.tituloParcelaBaixaComponent.Habilitar = true;
  }

  obterBaixa(id: string) {
    this.tituloParcelaBaixaService.obterBaixa(id)
      .subscribe(
        baixa => this.preencherFormGerarBaixa(baixa),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormGerarBaixa(baixa: BaixaPagarReceber): void {

    this.baixa = baixa;

    this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos = [];
    this.tituloParcelaBaixaComponent.Parcelas = [];


    if (this.baixa.baixaPagarReceberPgto != null) {
      this.baixa.baixaPagarReceberPgto.forEach(baixaPgRec => {
        if (baixaPgRec.baixaPagarReceberId != null) {
          if (this.tipoPagamento != null) {
            this.tipoPagamento.forEach(tipoPg => {
              if (baixaPgRec.siglaTipoPagamento == tipoPg.sigla) {
                baixaPgRec.tipoPagamento = tipoPg.descricao;
              }
            });
            this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.push(baixaPgRec);
          }
        }
      });
    }
    if (this.baixa.parcelasPagasBaixa != null) {
      this.baixa.parcelasPagasBaixa.forEach(pc => {
        this.tituloParcelaBaixaComponent.Parcelas.push(pc.parcela);
      });
    }

    this.gerarBaixaForm.patchValue({
      empresaId: this.baixa.empresaId,
      grupoEmpresaId: this.baixa.grupoEmpresaId,
      contaCorrenteId: this.baixa.contaCorrenteId,
      clienteId: this.baixa.clienteId,
      fornecedorId: this.baixa.fornecedorId,
      codigo: this.baixa.codigo,
      data: this._utilService.ToDate(this.baixa.data),
      valor: this.baixa.valor,
      observacao: this.baixa.observacao
    });
    this.carregarListaBaixaPgto = true;
  }


  async gerarBaixa(): Promise<void> {

    if (this.gerarBaixaForm.dirty) {

      let p = Object.assign({}, this.baixa, this.gerarBaixaForm.value);

      if (this.natureza == 'receber') {
        p.flagPagarReceber = 'R';
        p.fornecedorId = null;
      } else {
        p.flagPagarReceber = 'P';
        p.clienteId = null;
      }

      p.parcelasPagasBaixa = new Array();

      for (let i = 0; i < this.tituloParcelaBaixaComponent.Parcelas.length; i++) {
        let parcelaBaixa = new ParcelasPagasBaixa();

        parcelaBaixa.parcelaId = this.tituloParcelaBaixaComponent.Parcelas[i].id;
        parcelaBaixa.percentualJuros = this.tituloParcelaBaixaComponent.Parcelas[i].percentualJuros;
        //parcelaBaixa.valorJuros = this.tituloParcelaBaixaComponent.Parcelas[i].valorJuros;
        parcelaBaixa.percentualMulta = this.tituloParcelaBaixaComponent.Parcelas[i].percentualMulta;
        //parcelaBaixa.valorMulta = this.tituloParcelaBaixaComponent.Parcelas[i].valorMulta;
        //parcelaBaixa.percentualDesconto = this.tituloParcelaBaixaComponent.Parcelas[i].parcelaDesconto[i].percentualDesconto;
        parcelaBaixa.valorDesconto = this.tituloParcelaBaixaComponent.Parcelas[i].valorDesconto;
        parcelaBaixa.valorPago = this.tituloParcelaBaixaComponent.Parcelas[i].valorPago;
        parcelaBaixa.valorParcela = this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquido;
        parcelaBaixa.empresaId = p.empresaId;
        parcelaBaixa.grupoEmpresaId = p.grupoEmpresaId;
        parcelaBaixa.excluido = 'N';
        p.parcelasPagasBaixa.push(parcelaBaixa);
      }

      p.baixaPagarReceberPgto = this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos;

      for (let i = 0; p.baixaPagarReceberPgto.length > i; i++) {
        p.valor = p.valor + p.baixaPagarReceberPgto[i].valor;
        p.baixaPagarReceberPgto[i].id = 0;

        if (p.baixaPagarReceberPgto[i].chequeFolha != null && p.baixaPagarReceberPgto[i].chequeFolha != "") {
          let chequeFolha = new ChequeFolha();

          chequeFolha = p.baixaPagarReceberPgto[i].chequeFolha;

          let chequeF = await this.tituloParcelaBaixaService.adicionarChequeFolha(chequeFolha);
          p.baixaPagarReceberPgto[i].chequeFolhaId = chequeF.id;
          p.baixaPagarReceberPgto[i].chequeFolha = null;

        };

        if (p.baixaPagarReceberPgto[i].controleCartao != null && p.baixaPagarReceberPgto[i].controleCartao != "") {
          let controleCartao = new ControleCartao();

          controleCartao = p.baixaPagarReceberPgto[i].controleCartao;

          let controleC = await this.tituloParcelaBaixaService.adicionarControleCartao(controleCartao);

          p.baixaPagarReceberPgto[i].controleCartaoId = controleC.id;
          p.baixaPagarReceberPgto[i].controleCartao = null;

        };

      };

      this.baixa = p;

      this.tituloParcelaBaixaService.adicionarBaixaPagarReceber(this.baixa)
        .subscribe(result => {
          this.swal.showSwalSuccess('Baixa concluída com Sucesso!');

          if (this.natureza == "receber") {
            this.router.navigate(['tituloparcelabaixa/lista/receber']);
          } else if (this.natureza == "pagar") {
            this.router.navigate(['tituloparcelabaixa/lista/pagar']);
          }
        })


    }
  }

  public toasterMensagem(msg) {
    this.toastr.success(msg, 'Sucesso', { dismiss: 'controlled' })
      .then((toast: Toast) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);

        }, 2500);
      });
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

  ngOnDestroy() {
  }

  public setarValorsrcImagem(caminho: string): void {
    this.srcImagem = caminho + '.png';
  }

  public showModal(modal: string): void {
    if (modal == 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    }
    else if (modal == 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  cancelar() {
    if (this.natureza == "receber") {
      this.router.navigate(['tituloparcelabaixa/lista/receber']);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['tituloparcelabaixa/lista/pagar']);
    }
  }
}

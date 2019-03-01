import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { Parcela, ConfiguracaoPagamento, ContaCorrente, Desconto, Titulo } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
//import { ToastsManager, Toast } from 'ng2-toastr';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { UtilService } from '../../../services/util.service';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';
import { BaixaPagarReceber, FiltroBaixa } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-filtro-baixaparcela',
  templateUrl: './filtro-baixaparcela.component.html',
  styleUrls: ['./filtro-baixaparcela.component.css'],
  providers: [DateUtils]
})
export class FiltroBaixaparcelaComponent implements OnInit, AfterViewInit {

  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() natureza: string;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public filtroBaixaForm: FormGroup;
  public gerarBaixaForm: FormGroup;
  public filtroBaixa: FiltroBaixa;
  public baixa: BaixaPagarReceber;

  busy: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  configuracaoPagamentos: ConfiguracaoPagamento[];
  contaCorrentes: ContaCorrente[];
  descontos: Desconto[];
  //tipoCobrancas: TipoCobranca[];
  titulo: Titulo;

  swal: SweetAlertAdviceService;
  public innerHtml: SafeHtml;

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

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
    private _utilService: UtilService,
    private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      grupoEmpresaId: {
        required: 'O Grupo Empresa é requerido.'
      },
      empresaId: {
        required: 'A Empresa é requerida.'
      }
    };


    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroBaixa = new FiltroBaixa();
    this.titulo = new Titulo();
    this.modalVisible = false;
    this.srcImagem = '';
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.filtroBaixaForm = this.fb.group({
      grupoEmpresaId: [''],
      empresaId: [''],
      clienteId: [0, Validators.required],
      fornecedorId: [0, Validators.required],
      dataVencimentoInicial: [''],
      dataVencimentoFinal: [''],
      vencer: '',
      vencido: '',
      naturezaId: 0
    });

    this.gerarBaixaForm = this.fb.group({
      valorAbono: 0,
      valorAcrescimo: 0,
      observacao: '',
      configuracaoPagamentoId: 0,
      contaCorrenteId: 0,
      descontoId: 0,
      tipoCobrancaId: 0
    });

    let idEmpresa = this.tituloParcelaBaixaComponent.BaixaPagarReceber.empresaId.toString();

    this.clientes = [];
    this.fornecedores = [];

    if (this.natureza != "pagar") {
      this.tituloParcelaBaixaService.obterTodosClientePorEmpresa(idEmpresa)
        .subscribe(clientes => {
          this.clientes = clientes
        },
          () => this.errors);
    } else {
      this.tituloParcelaBaixaService.obterTodosFornecedorPorEmpresa(idEmpresa)
        .subscribe(fornecedores => {
          this.fornecedores = fornecedores
        },
          () => this.errors);

    }

    this.data = [];
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.filtroBaixaForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.filtroBaixaForm);
    });
  }


  filtrarBaixa(): void {

    this.data = [];

    let p = Object.assign({}, this.filtroBaixa, this.filtroBaixaForm.value);

    if (this.natureza == 'receber') {
      if (p.clienteId == undefined || p.clienteId == "") {
        this.swal.showSwalErro("Cliente, é requerido!");
        return;
      }
    } else {
      if (p.fornecedorId == undefined || p.fornecedorId == "") {
        this.swal.showSwalErro("Fornecedor, é requerido!");
        return;
      }
    }

    this.tituloParcelaBaixaComponent.dirty = true;

    if (this.tituloParcelaBaixaComponent.baixaPagarReceber.clienteId > 0) {
      p.clienteId = this.tituloParcelaBaixaComponent.baixaPagarReceber.clienteId;
    } else {
      p.clienteId = 0;
    }
    if (this.tituloParcelaBaixaComponent.baixaPagarReceber.fornecedorId > 0) {
      p.fornecedorId = this.tituloParcelaBaixaComponent.baixaPagarReceber.fornecedorId;
    }

    p.empresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.empresaId;
    p.grupoEmpresaId = this.tituloParcelaBaixaComponent.baixaPagarReceber.grupoEmpresaId;

    if (p.dataVencimentoInicial != '')
      p.dataVencimentoInicial = this._utilService.ToDate(p.dataVencimentoInicial);

    if (p.dataVencimentoFinal != '')
      p.dataVencimentoFinal = this._utilService.ToDate(p.dataVencimentoFinal);

    this.filtroBaixa = p;
    this.filtroBaixa.naturezaId = this.natureza == 'pagar' ? 2 : 1;

    this.busy = this.tituloParcelaBaixaService.obterParcelaPorFiltro(p)
      .subscribe(result => {
        this.data = result;

        if (p.vencido == 'S') {
          this.data.filter(c => c.dataVencimento <= Date.now)
        }
        if (p.vencer == 'S') {
          this.data.filter(c => c.dataVencimento >= Date.now)
        }

        this.carregarTable = true;

      });

  }

  selecionarParcelas() {
    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      this.swal.showSwalErro("Selecione ao menos uma parcela");
    }
    else {
      this.parcelas = this.selectedEntities;
    }

    this.tituloParcelaBaixaComponent.Parcelas = this.parcelas;

    for (var i = 0; i < this.tituloParcelaBaixaComponent.Parcelas.length; i++) {
      this.tituloParcelaBaixaComponent.Parcelas[i].valorPago = this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquido - this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquidado;
    }

    this.close();
  }

  onItemSelect(item: any) {
    console.log('onItemSelect')
    console.log(item);
    this.selectedItems.push(item)
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log('OnItemDeSelect');
    console.log(item);
    for (var i = 0; i < this.selectedItems.length; i++) {
      if (item.id == this.selectedItems[i].id)
        this.selectedItems.splice(i, 1)
    }


    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log('onDeSelectAll')
    console.log(items);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public setSelectedEntities($event: any) {
    this.selectedEntities = $event;
  }

  ngOnDestroy() {
    // this.busy.unsubscribe();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}


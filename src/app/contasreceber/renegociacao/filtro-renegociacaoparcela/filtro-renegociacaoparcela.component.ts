import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { DateUtils } from '../../../utils/date.utils';
import { Renegociacao, RenegociacaoParcela, FiltroRenegociacao } from '../models/renegociacao';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { RenegociacaoService } from '../renegociacao.service';
import { Subscription } from 'rxjs';
import { Parcela, Titulo } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { SafeHtml } from '@angular/platform-browser';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { RenegociacaoComponent } from '../renegociacao.component';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filtro-renegociacaoparcela',
  templateUrl: './filtro-renegociacaoparcela.component.html',
  styleUrls: ['./filtro-renegociacaoparcela.component.css'],
  providers: [DateUtils]
})
export class FiltroRenegociacaoparcelaComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() natureza: string;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public filtroRenegociacaoForm: FormGroup;
  //public gerarRenegociacaoForm: FormGroup;
  public filtroRenegociacao: FiltroRenegociacao;
  public renegociacao: Renegociacao;

  busy: Subscription;

  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
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
    private renegociacaoService: RenegociacaoService,
    vcr: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private renegociacaoComponent: RenegociacaoComponent) {

    this.validationMessages = {
      clienteId: {
        required: 'Cliente é requerido.'
      },
      fornecedorId: {
        required: 'Fornecedor é requerido.'
      },
      dataVencimentoInicial: {
        required: 'A Dt. Vencimento Inicial é requerida.'
      },
      dataVencimentoFinal: {
        required: 'A Dt. Vencimento Final é requerida.'
      }

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroRenegociacao = new FiltroRenegociacao();
    this.titulo = new Titulo();
    this.modalVisible = false;
    this.srcImagem = '';
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.filtroRenegociacaoForm = this.fb.group({
      clienteId: ['', [Validators.required]],
      fornecedorId: ['', [Validators.required]],
      dataVencimentoInicial: '',
      dataVencimentoFinal: '',
      vencer: '',
      vencido: '',
      naturezaId: ''
    });

    let empresaId = this.renegociacaoComponent.Renegociacao.empresaId;
    let naturezaId;
    if (this.natureza == 'receber') {
      naturezaId = 1;
      this.renegociacaoService.obterTodosClientePorEmpresa(empresaId.toString())
        .subscribe(clientes => {
          this.clientes = clientes
        },
          error => this.errors);
    }

    if (this.natureza == 'pagar') {
      naturezaId = 2;
      this.renegociacaoService.obterTodosFornecedorPorEmpresa(empresaId.toString())
        .subscribe(fornecedores => {
          this.fornecedores = fornecedores
        },
          error => this.errors);
    }

    this.renegociacaoComponent.renegociacao.naturezaId = naturezaId;

    this.data = [];
  }

  filtrarRenegociacao(): void {

    this.data = [];
    let p = Object.assign({}, this.filtroRenegociacao, this.filtroRenegociacaoForm.value);
    let filtra: boolean = true;

    if (this.natureza == 'receber') {
      if (p.clienteId == undefined || p.clienteId == "") {
        this.swal.showSwalErro("Cliente, é requerido!");
        filtra = false;
      }
    } else {
      if (p.fornecedorId == undefined || p.fornecedorId == "") {
        this.swal.showSwalErro("Fornecedor, é requerido!");
        filtra = false;
      }      
    }

    if (filtra){
      p.empresaId = this.renegociacaoComponent.Renegociacao.empresaId.toString();
      p.grupoEmpresaId = this.renegociacaoComponent.Renegociacao.grupoEmpresaId.toString();
      p.dataVencimentoInicial = p.dataVencimentoInicial;
      p.dataVencimentoFinal = p.dataVencimentoFinal;
      p.naturezaId = this.renegociacaoComponent.Renegociacao.naturezaId;
      this.renegociacaoComponent.Renegociacao.clienteId = p.clienteId;
      this.renegociacaoComponent.Renegociacao.fornecedorId = p.fornecedorId;
      this.filtroRenegociacao = p;
      this.busy = this.renegociacaoService.obterParcelaPorFiltro(p)
        .subscribe(result => {
          this.data = result;
          console.log(this.data);
          if (p.vencido == 'S') {
            this.data.filter(c => c.dataVencimento <= Date.now)
          }
          if (p.vencer == 'S') {
            this.data.filter(c => c.dataVencimento >= Date.now)
          }  
          this.carregarTable = true;  
        })  
    }

  }

  selecionarParcelas() {
    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      // alert("Selecione ao menos uma parcela");
    }
    else {
      this.parcelas = this.selectedEntities;
    }
    this.renegociacaoComponent.Parcelas = this.parcelas;
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

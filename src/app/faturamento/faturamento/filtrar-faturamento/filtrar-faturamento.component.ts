import { Component, OnInit, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente, TipoFaturamento, FiltroLancamentoFaturamento } from '../models/faturamento';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { FaturamentoService } from '../faturamento.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import CustomStore from 'devextreme/data/custom_store';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MaskService } from '../../../services/mask.service';
import { DateUtils } from '../../../utils/date.utils';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-filtrar-faturamento',
  templateUrl: './filtrar-faturamento.component.html',
  providers: [MaskService, DateUtils],
  styleUrls: []
})
export class FiltrarFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  dropdownList = [];
  gridDataSource: any;
  _gridBoxValue: string[] = [];

  public faturamentoForm: FormGroup;
  public filtroLancamentoFaturamento: FiltroLancamentoFaturamento;

  swal: SweetAlertAdviceService;

  filtros: any;
  refazerFiltro: boolean;
  valorRadio: string;

  public filtrarLancamentoFaturamento: string;

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();
  public myDatePickerOptions1 = DateUtils.getMyDatePickerDisableOptions('');

  mesAnoMask = this._maskService.MesAno();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public clientes: Cliente[];
  public tiposFaturamento: TipoFaturamento[];

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
    displayAllSelectedText: true
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
    allSelected: 'Todos',
  };

  //dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  public errors: any[] = [];
  public minDate: Date;
  public maxDate: Date;

  constructor(private faturamentoService: FaturamentoService,
    private fb: FormBuilder,
    private router: Router,
    private _maskService: MaskService,
    private _dateUtils: DateUtils) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      dataVencimentoInicial: {
        required: 'Data de Vencimento Inicial requerida'
      },
      dataVencimentoFinal: {
        required: 'Data de Vencimento Final requerida'
      },
      dataEncerramento: {
        required: 'Data de Encerramento requerida'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroLancamentoFaturamento = new FiltroLancamentoFaturamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.valorRadio = "lancamento";
    let date = new Date();

    this.faturamentoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      dataVencimentoInicial: ['', [Validators.required]],
      dataVencimentoFinal: ['', [Validators.required]],
      lancamentoFixo: 'N',
      faturadoContrato: 'N',
      optionsModelCliente: [],
      dataEncerramento: ['', [Validators.required]]
    });

    this.faturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors);

    this.filtrarLancamentoFaturamento = 'N';

    //this.faturamentoForm.controls['faturadoContrato'].patchValue('S');
  }

  makeAsyncDataSource(clientes) {
    return new CustomStore({
      loadMode: "raw",
      key: "id",
      load: function () {
        return clientes;
      }
    });
  };

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.formInputElements, ...controlBlurs).debounceTime(1000).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.faturamentoForm);
    });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['faturamento/lista']);
  }

  filtrar() {
    if (this.faturamentoForm.valueChanges) {
      this.refazerFiltro = false;
    }

    this.filtrarLancamentoFaturamento = 'N';

    let p = Object.assign({}, [], this.faturamentoForm.value);

    let itens = [];
  
    if (this._gridBoxValue.length > 0) {
      for (var i = 0; i < this._gridBoxValue.length; i++) {
        itens.push(this._gridBoxValue[i]);
      }
    }

    p.optionsModelCliente = itens;

    console.log(p);
    this.filtros = p;
    this.refazerFiltro = true;

    this.filtrarLancamentoFaturamento = 'S';

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
    this.selectedItems = [];
    for (var i = 0; i < items.length; i++) {
      this.selectedItems.push(items[i])
    }
  }

  onDeSelectAll(items: any) {
    this.selectedItems = [];
  }

  setarValorFiltro(event: Event) {
    const valor = event.target as HTMLInputElement;
    this.valorRadio = valor.value;
    this.refazerFiltro = false;
  }

  setarValorFiltroFat(event: Event) {
    const valor = event.target as HTMLInputElement;
    let vRadio = valor.value;

    this.faturamentoForm.controls['faturadoContrato'].patchValue('N');
    this.faturamentoForm.controls['lancamentoFixo'].patchValue('N');

    if (vRadio == 'faturadoContrato') {
      this.faturamentoForm.controls['faturadoContrato'].patchValue('S');
    }
    if (vRadio == 'lancamentoFixo') {
      this.faturamentoForm.controls['lancamentoFixo'].patchValue('S');
    }

    this.refazerFiltro = false;
  }

  setarTrintaDias(data: any) {
    if (data.date.day > 0) {
      var dataFinal = new Date(data.date.year, data.date.month - 1, data.date.day);

      this.myDatePickerOptions1 = DateUtils.getMyDatePickerDisableOptions(dataFinal);
    }
    this.refazerFiltro = false;
  }

  ConsultaEmpresa(idGrupo) {
    this.faturamentoService.obterTodosEmpresaGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaCliente(idEmpresa) {
    //let myOptions = [];
    this.dropdownList = [];

    this.faturamentoService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(f => {
        this.clientes = f;
        this.clientes.forEach(el => {
          this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, cliente: el.pessoa.nome });
        });

        console.log(this.clientes);

        this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

      }, () => { });

    // this.faturamentoService.obterTodosClienteEmpresa(idEmpresa)
    //   .subscribe(clientes => {
    //     this.clientes = clientes
    //     this.clientes.forEach(element => {
    //       myOptions.push({ id: element.id, name: element.pessoa.nome })
    //       this.dropdownList.push({ id: element.id, itemName: element.pessoa.nome })
    //     })
    //     return this.myOptionsClientes = myOptions;
    //   },
    //     () => this.errors);

    this.dropdownSettings = {
      singleSelection: false,
      text: "Selecione um cliente",
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Desmarcar Todos',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      badgeShowLimit: 1
    };
  }

  definirValor(event) {
    this.minDate = event.value;
    var ultimoDia = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, 0);
    this.maxDate = ultimoDia;
  }

  get gridBoxValue(): string[] {
    return this._gridBoxValue;
  }

  set gridBoxValue(value: string[]) {
    this._gridBoxValue = value || [];
  }

}

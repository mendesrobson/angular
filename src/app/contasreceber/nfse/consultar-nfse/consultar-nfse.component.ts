import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControlName, FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { FiltroNfse, ContaCorrente, Cliente, Nfse } from '../models/nfse';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { NfseService } from '../nfse.service';
import { Subscription } from 'rxjs';
import { Parcela } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ToastsManager, Toast } from 'ng2-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-consultar-nfse',
  templateUrl: './consultar-nfse.component.html',
  styleUrls: ['./consultar-nfse.component.css'],
  providers: [DateUtils]
})
export class ConsultarNfseComponent implements OnInit {

  public filtroNfseForm: FormGroup;
  public filtroNfse: FiltroNfse;

  busy: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  contasCorrente: ContaCorrente[];
  parcelas: Parcela[];
  nfse: Nfse[];
  clientes: Cliente[];

  swal: SweetAlertAdviceService;
  public innerHtml: SafeHtml;

  public myDatePickerOptions = DateUtils.getMyDatePickerDefaultOptions();

  displayMessage: { [key: string]: string } = {};

  public data: any[];

  public carregarTable: boolean = false;

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
    private nfseService: NfseService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private report: ReportService) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      grupoEmpresaId: {
        required: 'O Grupo Empresa é requerido.'
      },
      empresaId: {
        required: 'A Empresa é requerida.'
      },
      contaCorrenteId: {
        required: 'A Conta Corrente Cobrança é requerida.'

      },
      dataVencimentoInicial: {
        required: 'A Dt. Vencimento Inicial é requerida.'

      },
      dataVencimentoFinal: {
        required: 'A Dt. Vencimento Final é requerida.'

      },
      tipoEmissaoId: {
        required: 'O tipo de emissão é requerida.'
      }

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroNfse = new FiltroNfse();
    //this.parcelas = [];
    this.modalVisible = false;
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.filtroNfseForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      numeroRps: '',
      numeroNfse: '',
      dataVencimentoInicial: ['', [Validators.required]],
      dataVencimentoFinal: ['', [Validators.required]],
      clientes: [[]]

    });

    this.nfseService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      () => this.errors);

    this.nfseService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      () => this.errors);

    this.nfseService.obterContasCorrente()
      .subscribe(contasCorrente => {
        this.contasCorrente = contasCorrente
        //  console.log(this.contasCorrenteCobranca)
      },
      () => this.errors);

    this.data = [];

    let myOptions = [];
    this.nfseService.obterTodosCliente()
      .subscribe(clientes => {
        this.clientes = clientes,
          this.clientes.forEach(element => {
            myOptions.push({ id: element.id, name: element.pessoa.nome })
            this.dropdownList.push({ id: element.id, itemName: element.pessoa.nome })
          })
        return this.myOptionsClientes = myOptions;
      }
      ,
      () => this.errors);

    this.dropdownSettings = {
      singleSelection: false,
      text: "Selecione um cliente",
      selectAllText: 'Marcar Todos',
      checkedStyle: 'fontawesome',
      unSelectAllText: 'Desmarcar Todos',
      searchPlaceholder: 'Procurar',
      enableSearchFilter: true,
      containerClasses: 'custom-select',
      //classes: "myclass custom-class ng-untouched ng-pristine ng-valid",
      badgeShowLimit: 1,
    };
  }

  filtrarParcelas(): void {
    this.carregarTable = true;
    this.data = [];
    if (this.filtroNfseForm.dirty /*&& this.filtroNfseForm.valid*/) {
      let p = Object.assign({}, this.filtroNfse, this.filtroNfseForm.value);

      if (p.dataVencimentoInicial != '') {
        p.dataVencimentoInicial = p.dataVencimentoInicial.formatted;
      }

      if (p.dataVencimentoFinal != '') {
        p.dataVencimentoFinal = p.dataVencimentoFinal.formatted;
      }

      p.empresaId = p.empresaId.toString();
      p.grupoEmpresaId = p.grupoEmpresaId.toString();
      p.numeroNfse = p.numeroNfse.toString();
      p.numeroRps = p.numeroRps.toString();

      let clientes = "";

      if (this.selectedItems.length > 0) {
        for (var i = 0; i < this.selectedItems.length; i++) {
          if (clientes != "")
            clientes = clientes + "&" + "clientes[" + [i] + "]=" + this.selectedItems[i].id;
          else
            clientes = "clientes[" + [i] + "]=" + this.selectedItems[i].id

        }
      } else {
        clientes = "clientes[]"
      }


      this.busy = this.nfseService.obterNfsePorFiltro(p, clientes)
        .subscribe(result => {
          this.data = result;
        })
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


  public cancelarNfse() {

    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      // alert("Selecione ao menos uma parcela");
    }
    else {
      //let contaCorrenteCobrancaId = this.filtroBoletoForm.get('contaCorrenteCobrancaId').value;
      this.nfse = this.selectedEntities;

      //for (let i = 0; this.nfse.length > i; i++) {
        this.busy = this.nfseService.CancelarNfse(this.nfse)
          .subscribe(() => {
            
            this.swal.showSwalSuccess('NFS-e Cancelado com Sucesso!');
            this.filtrarParcelas();
          })
      //}

    }
  }

  ngOnDestroy() {
    // this.busy.unsubscribe();
  }
    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "NFS-e - Consultar",id))
      this.toastr.error("Não Possui Informações");
    }
    gerarPDF(model: string) {
    this.report.pdfFile(model, "NFS-e - Consultar");
    }

}

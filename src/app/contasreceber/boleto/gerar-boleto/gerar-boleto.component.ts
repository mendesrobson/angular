import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControlName, FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { FiltroBoleto, ContaCorrenteCobranca, Cliente } from '../models/boleto';
import { GenericValidator } from '../../../validation/generic-form-validator';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { BoletoService } from '../boleto.service';
import { Subscription, Observable } from 'rxjs';
import { Parcela } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { SafeHtml } from '@angular/platform-browser';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager, Toast } from 'ng2-toastr';

@Component({
  selector: 'app-gerar-boleto',
  templateUrl: './gerar-boleto.component.html',
  styleUrls: ['./gerar-boleto.component.css'],
  providers: [DateUtils]
})
export class GerarBoletoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public filtroBoletoForm: FormGroup;
  public filtroBoleto: FiltroBoleto;

  busy: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  contasCorrenteCobranca: ContaCorrenteCobranca[];
  parcelas: Parcela[];
  clientes: Cliente[];
  public innerHtml: SafeHtml;

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  displayMessage: { [key: string]: string } = {};

  public data: any[];

  valorRadio: string = 'parcelas';

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
    // maxHeight: '300px',
    displayAllSelectedText: true

    // isLazyLoad: true,
    //   loadViewDistance: 1,
    // stopScrollPropagation: true
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

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};



  constructor(private fb: FormBuilder,
    private boletoService: BoletoService,
    private report: ReportService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      grupoEmpresaId: {
        required: 'O Grupo Empresa é requerido.'
      },
      empresaId: {
        required: 'A Empresa é requerida.'
      },
      contaCorrenteCobrancaId: {
        required: 'A Conta Corrente Cobrança é requerida.'

      },
      dataVencimentoInicial: {
        required: 'A Dt. Vencimento Inicial é requerida.'

      },
      dataVencimentoFinal: {
        required: 'A Dt. Vencimento Final é requerida.'
      }
    };


    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroBoleto = new FiltroBoleto();
    this.parcelas = [];
    this.modalVisible = false;
    this.srcImagem = '';
  }

  ngOnInit(): void {
    this.filtroBoletoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      contaCorrenteCobrancaId: ['', [Validators.required]],
      dataVencimentoInicial: ['', [Validators.required]],
      dataVencimentoFinal: ['', [Validators.required]],
      clientes: [[]]
    });

    this.boletoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors);

    this.boletoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.boletoService.obterTodosContaCorrenteCobranca()
      .subscribe(contasCorrenteCobranca => {
        this.contasCorrenteCobranca = contasCorrenteCobranca
        //  console.log(this.contasCorrenteCobranca)
      },
        () => this.errors);

    this.data = [];

    let myOptions = [];
    this.boletoService.obterTodosCliente()
      .subscribe(clientes => {
        this.clientes = clientes,
          this.clientes.forEach(element => {
            myOptions.push({ id: element.id, name: element.pessoa.nome })
            this.dropdownList.push({ id: element.id, itemName: element.pessoa.nome })
          })
        return this.myOptionsClientes = myOptions;
      }
        ,
        error => this.errors);

    this.dropdownSettings = {
      singleSelection: false,
      text: "Selecione um cliente",
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Desmarcar Todos',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      badgeShowLimit: 1
    };
    //console.log(this.dropdownList);
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



  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.filtroBoletoForm);
    });

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

  filtrarParcelas(): void {
    this.carregarTable = true;
    this.data = [];
    if (this.filtroBoletoForm.dirty && this.filtroBoletoForm.valid) {
      let p = Object.assign({}, this.filtroBoleto, this.filtroBoletoForm.value);

      p.dataVencimentoInicial = p.dataVencimentoInicial.formatted;
      p.dataVencimentoFinal = p.dataVencimentoFinal.formatted;

      p.contaCorrenteCobrancaId = p.contaCorrenteCobrancaId.toString();
      p.empresaId = p.empresaId.toString();
      p.grupoEmpresaId = p.grupoEmpresaId.toString();

      //  p.clientes[0] = 64;
      //  p.clientes[1] = 22;

      //  let clientes = "clientes[0]=64&clientes[1]=22"

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

      this.busy = this.boletoService.obterTodosPorContaVencimento(p, clientes)
        .subscribe(result => {
          this.data = result;
          this.carregarTable = true;
        });
    }
  }

  filtrarBoletos(): void {
    this.carregarTable = false;
    this.data = [];
    if (this.filtroBoletoForm.dirty && this.filtroBoletoForm.valid) {
      let p = Object.assign({}, this.filtroBoleto, this.filtroBoletoForm.value);

      p.dataVencimentoInicial = p.dataVencimentoInicial.formatted;
      p.dataVencimentoFinal = p.dataVencimentoFinal.formatted;

      p.contaCorrenteCobrancaId = p.contaCorrenteCobrancaId.toString();
      p.empresaId = p.empresaId.toString();
      p.grupoEmpresaId = p.grupoEmpresaId.toString();


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

      this.busy = this.boletoService.obterTodosBoletosGerados(p, clientes)
        .subscribe(result => {
          this.data = result;
          this.carregarTable = true;

        })
    }
  }

  gerarBoletos() {
    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      // alert("Selecione ao menos uma parcela");
    }
    else {
      let contaCorrenteCobrancaId = this.filtroBoletoForm.get('contaCorrenteCobrancaId').value;
      this.parcelas = this.selectedEntities;
      this.busy = this.boletoService.gerarBoletos(contaCorrenteCobrancaId, this.parcelas)
        .subscribe(() => {
          this.toasterMensagem('Boleto(s) gerados(s) com sucesso');
          this.filtrarParcelas();

        }
        )
    }

  }

  cancelarBoletos() {
    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      // alert("Selecione ao menos uma parcela");
    }
    else {
      this.parcelas = this.selectedEntities;
      this.busy = this.boletoService.cancelarBoletos(this.parcelas)
        .subscribe(result => {

          this.toasterMensagem('Boleto(s) cancelado(s) com sucesso');
          this.filtrarBoletos();
        }
        )
    }


  }

  setarValorFiltro(event: Event) {
    this.carregarTable = false;

    const valor = event.target as HTMLInputElement;

    this.valorRadio = valor.value;


  }

  filtrar(): void {
    console.log('valor no filtrar' + this.valorRadio)
    if (this.valorRadio == 'parcelas')
      this.filtrarParcelas()
    else
      this.filtrarBoletos();
  }


  public toasterMensagem(msg) {

    this.toastr.success(msg, 'Sucesso', { dismiss: 'click' });
    this.toastr.success(msg, 'Sucesso', { dismiss: 'controlled' })
      .then((toast: Toast) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);
        }, 2500);
      });
  }

  public showModal(): void {
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  public setInnerHtml(pdfurl: string) {
    // this.innerHtml = this._sanitizer.bypassSecurityTrustHtml(
    //     "<object data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
    //     "Object " + pdfurl + " failed" +
    //     "</object>");
  }

  public setarValorsrcImagem(caminho: string): void {
    this.srcImagem = caminho + '.png';
  }

    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Boletos",id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Boletos");
  }
}

import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControlName, FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { CobrancaContato, TipoAtendimento, FiltroParcela } from '../models/cobranca';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { CobrancaService } from '../cobranca.service';
import { Subscription } from 'rxjs';
import { Parcela, ConfiguracaoPagamento, ContaCorrente, Desconto, Titulo } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ToastsManager, Toast } from 'ng2-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { CobrancaComponent } from '../cobranca.component';
import { UtilService } from '../../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';

@Component({
  selector: 'app-filtro-cobrancaparcela',
  templateUrl: './filtro-cobrancaparcela.component.html',
  styleUrls: [],
  providers: [DateUtils]
})
export class FiltroCobrancaparcelaComponent implements OnInit {
  public filtroCobrancaParcelaForm: FormGroup;
  public gerarRenegociacaoForm: FormGroup;
  public conbrancaContato: CobrancaContato;

  busy: Subscription;
  public sub: Subscription;
  index: number = 0;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  filtroParcela: FiltroParcela;
  public natureza: string = "";
  swal: SweetAlertAdviceService;
  public innerHtml: SafeHtml;

  displayMessage: { [key: string]: string } = {};

  selectedEntities: any[];
  selectedItems = [];

  carregarTable: boolean = false;

  public data: any[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];


  constructor(private fb: FormBuilder,
    private cobrancaService: CobrancaService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private cobrancaComponent: CobrancaComponent,
    private _utilService: UtilService) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {


      clienteId: {
        required: 'Cliente é requerido.'
      },
      dataReferencia: {
        required: 'Data de Referência é requerido.'
      }

    };


    this.genericValidator = new GenericValidator(this.validationMessages);
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
      }
    )
    this.filtroCobrancaParcelaForm = this.fb.group({
      empresaId: [0, [Validators.required]],
      grupoEmpresaId: [0, [Validators.required]],
      clienteId: [0, [Validators.required]],
      fornecedorId: [0, [Validators.required]],
      dataReferencia: ''
    });

    this.cobrancaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors); 

    this.data = [];
  }

  filtrarParcelas(): void {

    this.data = [];
    if (this.filtroCobrancaParcelaForm.dirty /*&& this.filtroRenegociacaoForm.valid*/) {
      let p = Object.assign({}, this.filtroParcela, this.filtroCobrancaParcelaForm.value);

      if (p.clienteId == undefined || p.clienteId == "") {
        this.swal.showSwalErro("Cliente, é requerido!");
        return;
      }

      this.filtroParcela = p;

      this.busy = this.cobrancaService.obterParcelaPorFiltro(p)
        .subscribe(result => {
          this.data = result;
          this.cobrancaComponent.Parcela = result;
          this.carregarTable = true;
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

    for (let x = 0; this.selectedEntities.length > x; x++) {
      for (let i = 0; this.cobrancaComponent.parcela.length > i; i++) {
        if (this.cobrancaComponent.parcela[i].id == this.selectedEntities[x].id) {
          this.cobrancaComponent.parcela[i].selecionado = 'S';
        }
      }
    }

  }

  cancelar() {
    // if (this.natureza == "receber") {
    //   this.router.navigate(['renegociacao/lista/receber']);
    // } else if (this.natureza == "pagar") {
    //   this.router.navigate(['renegociacao/lista/pagar']);
    // }
  }

  onChange_Parcela(i): void {
    this.index = i;
  }
  
  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.cobrancaService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {

    this.clientes = [];
    this.cobrancaService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);

    this.fornecedores = [];
    this.cobrancaService.obterTodosFornecedorPorEmpresa(idEmpresa)
      .subscribe(fornecedores => {
        this.fornecedores = fornecedores
      },
        error => this.errors);
  }
}

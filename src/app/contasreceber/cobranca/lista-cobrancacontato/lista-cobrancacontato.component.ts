import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef, Input, AfterViewInit } from '@angular/core';
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
  selector: 'app-lista-cobrancacontato',
  templateUrl: './lista-cobrancacontato.component.html',
  styleUrls: []
})
export class ListaCobrancacontatoComponent implements OnInit, AfterViewInit {

  public parcelaId = 0;
  @Input() ind: number = 0;

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public CobrancaContato: CobrancaContato;
  public CobrancaContatos: CobrancaContato[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public cobrancaService: CobrancaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private cobrancaComponent: CobrancaComponent) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {

    if (this.cobrancaComponent.Parcela.length > 0) {
      this.data = this.cobrancaComponent.Parcela[this.ind].cobrancaContato;
    } else {
      this.data = [];
    }

  }

  ngAfterViewInit(): void {
    if (this.cobrancaComponent.Parcela.length > 0) {
      this.data = this.cobrancaComponent.Parcela[this.ind].parcelaDesconto;
    }
  }

  cadastrarCobranca() {
    this.router.navigate(['cobranca/adicionarCobrancaContato']);
  }
  cadastrarParcelaDesconto() {
    this.router.navigate(['cobranca/adicionarCobrancaContato']);
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

  public cobrancaGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public cobrancaNaoGravado(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

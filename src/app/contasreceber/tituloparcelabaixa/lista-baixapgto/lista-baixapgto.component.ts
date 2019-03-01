import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { BaixaPagarReceberPgto } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { ContaCorrente } from './../../../cadastros/contacorrente/models/contacorrente';


@Component({
  selector: 'app-lista-baixapgto',
  templateUrl: './lista-baixapgto.component.html',
  styleUrls: []
})
export class ListaBaixapgtoComponent implements OnInit {

  public baixaPagarReceberPgto: BaixaPagarReceberPgto[];
  public baixaId = 0;
  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public modalConsultarVisible: boolean;

  showDialog = false;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";s
  public sortOrder = "asc";
  public habilitarEditar: boolean = false;

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;
  public contaCorrentes: ContaCorrente[];

  constructor(public tituloParcelaBaixaService: TituloParcelaBaixaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    public tituloParcelaBaixaComponent: TituloParcelaBaixaComponent) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.modalConsultarVisible = false;
    this.habilitarEditar = this.route.snapshot.url[0].path == "editar" ? true : false;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.baixaId = 0
    else
      this.baixaId = this.route.snapshot.params['id'];

    this.data = this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos;
  }

  // editarBaixaPgto(baixaPgto) {
  //   this.tituloParcelaBaixaComponent.BaixaPagarReceberPgto = baixaPgto;
  //   this.showModal('modalEditar');
  // }
  // consultaBaixapgto(baixaPgto){
  //   this.tituloParcelaBaixaComponent.BaixaPagarReceberPgto = baixaPgto;
  //   this.showModal('modalConsultar');
  // }


  cadastrarBaixaPgto() {
    this.router.navigate(['pessoacontato/adicionar']);
  }

  public showModal(modal: string): void {
    if (this.tituloParcelaBaixaComponent.BaixaPagarReceber.empresaId != undefined
      && this.tituloParcelaBaixaComponent.BaixaPagarReceber.grupoEmpresaId != undefined) {
      if (this.tituloParcelaBaixaComponent.Parcelas.length > 0) {

        if (modal == 'modalEditar') {
          this.modalEditVisible = true;
          this.modalAddVisible = false;
          this.modalConsultarVisible = false;
        }
        else if (modal == 'modalAdicionar') {
          this.modalEditVisible = false;
          this.modalAddVisible = true;
          this.modalConsultarVisible = false;
        }
        else if (modal == 'modalConsultar') {
          this.modalEditVisible = false;
          this.modalAddVisible = false;
          this.modalConsultarVisible = true;
        }
      } else {
        this.swal.showSwalErro("Parcela a Baixar, é requerido.");
      }
    } else {
      this.swal.showSwalErro("Grupo e Empresa, é requerido.");
    }
  }

  inativarBaixaPgto(baixaPgto) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerBaixaPgto(baixaPgto);
      }
    });
  }


  removerBaixaPgto(baixaPgto) {
    for (var i = 0; i < this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.length; i++) {
      if (baixaPgto.id == this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos[i].id) {
        this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.splice(i, 1);
        this.baixaPgtoGravado('Forma de Pagamento, excluida com sucesso!');
      }
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public baixaPgtoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public baixaPgtoErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  editarBaixapgto(baixapgto: BaixaPagarReceberPgto) {
    this.tituloParcelaBaixaComponent.BaixaPagarReceberPgto = baixapgto;
    this.showModal('modalEditar');
  }

  consultaBaixapgto(baixaPgtos : BaixaPagarReceberPgto){
    this.tituloParcelaBaixaComponent.BaixaPagarReceberPgto = baixaPgtos;
    this.showModal('modalConsultar');
  }
}


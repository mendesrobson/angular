import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ChequeProprioService } from '../chequeproprio.service';
import { ChequeTalao, ChequeFolha, ChequeFolhaHistorico } from '../models/chequeproprio';
import { ChequeproprioComponent } from '../chequeproprio.component';

@Component({
  selector: 'app-lista-chequefolhahistorico',
  templateUrl: './lista-chequefolhahistorico.component.html',
  styleUrls: []
})
export class ListaChequefolhahistoricoComponent implements OnInit {

  @Input() ind: number = 0;

  public chequeFolhaHistorico: ChequeFolhaHistorico[];
  public chequeTalaoId = 0;
  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public chequeProprioService: ChequeProprioService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private chequeProprioComponent: ChequeproprioComponent) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.chequeTalaoId = 0
    else
      this.chequeTalaoId = this.route.snapshot.params['id'];

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

  public chequeFolhaHistoricoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public chequeFolhaHistoricoErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

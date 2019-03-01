import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { HistoricoPadraoService } from '../historicopadrao.service';
import { HistoricoPadrao, CentroCusto, CentroResultado } from '../models/historicopadrao';
import { HistoricopadraoComponent } from '../historicopadrao.component';
import { ToastsManager, Toast } from 'ng2-toastr';

@Component({
  selector: 'app-lista-historicocentrocusto',
  templateUrl: './lista-historicocentrocusto.component.html',
  styleUrls: []
})
export class ListaHistoricocentrocustoComponent implements OnInit {

  public centroCusto: CentroCusto[];
  public historicoPadraoId = 0;
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

  constructor(public historicoPadraoService: HistoricoPadraoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private historicoPadraoComponent: HistoricopadraoComponent) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.historicoPadraoId = 0
    else
      this.historicoPadraoId = this.route.snapshot.params['id'];

    this.data = this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro;

  }

  editarHistoricoPadraoCentro(centroCusto) {
    this.historicoPadraoComponent.HistoricoPadraoCentro = centroCusto;
    this.showModal('modalEditar');
  }


  cadastrarCentroCusto() {
    this.router.navigate(['centrocusto/adicionar']);
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

  inativarHistoricoPadraoCentro(historicoPadraoCentro) {

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerHistoricoPadraoCentro(historicoPadraoCentro);
      }
      else {
      }
    });

  }



  removerHistoricoPadraoCentro(historicoPadraoCentro) {
    //this.atualizaValorParcelaDesconto.emit(parcelaDesconto.valorDesconto);

    if (this.historicoPadraoId > 0) {

      this.historicoPadraoService.RemoverHistoricoPadraoCentro(historicoPadraoCentro)
        .subscribe(
          result => {
            //let descontos = this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto;

            for (var i = 0; i < this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length; i++) {
              if (historicoPadraoCentro.id == this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].id) {
                this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.splice(i, 1);
              }
            }


          },
          error => {
            this.errors;
          });


    } else {

      for (var i = 0; i < this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length; i++) {
        if (historicoPadraoCentro.id == this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].id) {
          this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.splice(i, 1);
        }
      }

    }


  }

  public historicoPadraoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public historicoPadraoErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Itinerario, ValorTransporte } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from './../empregado.component';

import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';

@Component({
  selector: 'app-lista-itinerario',
  templateUrl: './lista-itinerario.component.html',
  styleUrls: []
})
export class ListaItinerarioComponent implements OnInit {

  itinerarios: Itinerario[];
  public valorTransporte: ValorTransporte[];
  empregadoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  showModalEdit = false;
  showDialog = false;
  swal: SweetAlertAdviceService;

  constructor(
    public empregadoService: EmpregadoService,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    public empregadoComponent: EmpregadoComponent) {

    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined) {
      this.empregadoId = 0
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }

    this.itinerarios = this.empregadoComponent.empregado.itinerario;

    if (this.itinerarios != null) {

      this.empregadoService.obterTodosValortransporte()
        .subscribe(result => {
        this.valorTransporte = result;

          for (let i = 0; i < this.itinerarios.length; i++) {

            for (let y = 0; y < this.valorTransporte.length; y++) {

              if (this.itinerarios[i].valorTransporteId == this.valorTransporte[y].id) {

                this.itinerarios[i].valorTransporte = this.valorTransporte[y];
              }

            }

          }

        },
          () => { });

    }
  }

  editaritinerario(itinerario) {
    this.empregadoComponent.itinerario = itinerario;
    this.showModal('modalEditar');
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

  inativaritinerario(itinerario) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removeritinerario(itinerario);
      }
      else {
      }
    });
  }

  removeritinerario(itinerario) {

    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      this.empregadoService.excluirItinerario(itinerario.id)
        .subscribe(
          result => {
            for (var i = 0; i < this.empregadoComponent.empregado.itinerario.length; i++) {
              if (itinerario.id == this.empregadoComponent.empregado.itinerario[i].id) {
                this.empregadoComponent.empregado.itinerario.splice(i, 1);
              }
            }
          },
          () => { });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.itinerario.length; i++) {
        if (itinerario.id == this.empregadoComponent.empregado.itinerario[i].id) {
          this.empregadoComponent.empregado.itinerario.splice(i, 1);
        }
      }
    }
  }

  public itinerarioGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

}

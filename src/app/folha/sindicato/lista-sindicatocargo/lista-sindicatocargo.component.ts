import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SindicatoCargo, Cargo } from '../models/sindicato';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { SindicatoService } from './../sindicato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SindicatoComponent } from './../sindicato.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-sindicatocargo',
  templateUrl: './lista-sindicatocargo.component.html',
  styleUrls: ['./lista-sindicatocargo.component.css']
})
export class ListaSindicatocargoComponent implements OnInit {

  public sindicatoCargo: SindicatoCargo[];
  public sindicatoCargoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public cargos: Cargo[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  showModalEdit = false;
  showDialog = false;
  swal: SweetAlertAdviceService;
  public excluido: boolean;

  constructor(
    public sindicatoService: SindicatoService,
    private router: Router, public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private sindicatoComponent: SindicatoComponent) {

    this.toastr.setRootViewContainerRef(vcr);

    this.excluido = this.sindicatoComponent.Excluido;
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;

  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] === undefined) {
      this.sindicatoCargoId = 0;
    } else {
      this.sindicatoCargoId = this.route.snapshot.params['id'];
    }

    this.sindicatoCargo = this.sindicatoComponent.Sindicato.sindicatoCargo;

    this.sindicatoService.obterTodosCargo()
      .subscribe(cargos => {
        this.cargos = cargos

        if (this.sindicatoCargo != null) {
          for (let i = 0; i < this.sindicatoCargo.length; i++) {

            for (let y = 0; y < this.cargos.length; y++) {

              if (this.sindicatoCargo[i].cargoId == this.cargos[y].id) {

                this.sindicatoCargo[i].cargo = this.cargos[y];

              }
            }
          }
        }
      },
        error => this.errors);

    this.data = this.sindicatoCargo;

  }

  cadastrarSindicatoCargo() {
    this.router.navigate(['sindicatocargo/adicionar']);
  }

  inativarSindicatoCargo(sindicatoCargo) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerSindicatoCargo(sindicatoCargo);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerSindicatoCargo(sindicatoCargo) {
    if (this.sindicatoCargoId > 0) {
      this.sindicatoService.excluirSindicatoCargo(sindicatoCargo.id)
        .subscribe(
          result => {
            for (let i = 0; i < this.sindicatoComponent.Sindicato.sindicatoCargo.length; i++) {
              if (sindicatoCargo.id == this.sindicatoComponent.Sindicato.sindicatoCargo[i].id) {
                this.sindicatoComponent.Sindicato.sindicatoCargo.splice(i, 1);
              }
            }
          },
          error => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.sindicatoComponent.Sindicato.sindicatoCargo.length; i++) {
        if (sindicatoCargo.id === this.sindicatoComponent.Sindicato.sindicatoCargo[i].id) {
          this.sindicatoComponent.Sindicato.sindicatoCargo.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public SindicatoCargoGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

  public showModal(modal: string): void {
    if (modal === 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    } else if (modal === 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }
  }

}

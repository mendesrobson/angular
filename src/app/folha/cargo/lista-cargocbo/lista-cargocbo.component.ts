import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CargoCbo, Cbo } from '../models/cargo';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CargoService } from './../cargo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CargoComponent } from './../cargo.component';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';

@Component({
  selector: 'app-lista-cargocbo',
  templateUrl: './lista-cargocbo.component.html',
  styleUrls: []
})
export class ListaCargocboComponent implements OnInit {

  // Propriedades
  public cargoCbo: CargoCbo[];
  public cargoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public cbos: Cbo[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  public excluido: boolean;

  // variaveis Globais
  showModalEdit = false;
  showDialog = false;
  // Controller Mensansagens
  swal: SweetAlertAdviceService;

  constructor(
    public cargoService: CargoService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private cargoComponent: CargoComponent
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.excluido = this.cargoComponent.Excluido;
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id'] === undefined) {
      this.cargoId = 0;
    } else {
      this.cargoId = this.route.snapshot.params['id'];
    }
    this.cargoCbo = this.cargoComponent.Cargo.cargoCbo;
    console.log(this.cargoCbo);

    this.cargoService.obterTodosCbo()
      .subscribe(cbos => {
        this.cbos = cbos

        if (this.cargoCbo != null) {
          for (let i = 0; i < this.cargoCbo.length; i++) {

            for (let y = 0; y < this.cbos.length; y++) {

              if (this.cargoCbo[i].cboId == this.cbos[y].id) {
                this.cargoCbo[i].cbo = this.cbos[y];
              }

            }

          }
        }

      },
        error => this.errors);

    this.data = this.cargoCbo;

  }

  cadastrarCargoCbo() {
    this.router.navigate(['cargocbo/adicionar']);
  }

  editarCargoCbo(cargoCbo) {
    if (!this.excluido) {
      this.cargoComponent.CargoCbo = cargoCbo;
      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  inativarCargoCbo(cargoCbo) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerCargoCbo(cargoCbo);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerCargoCbo(cargoCbo) {
    if (this.cargoId > 0) {
      this.cargoService.excluirCargoCbo(cargoCbo.id)
        .subscribe(
          result => {
            for (let i = 0; i < this.cargoComponent.Cargo.cargoCbo.length; i++) {
              if (cargoCbo.id === this.cargoComponent.Cargo.cargoCbo[i].id) {
                this.cargoComponent.Cargo.cargoCbo.splice(i, 1);
              }
            }
          },
          error => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.cargoComponent.Cargo.cargoCbo.length; i++) {
        if (cargoCbo.id === this.cargoComponent.Cargo.cargoCbo[i].id) {
          this.cargoComponent.Cargo.cargoCbo.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public cargoCboGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

  public showModal(modal: string): void {
    console.log('ShowModal');
    if (modal === 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    } else if (modal === 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }
  }


}

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { EmpregadoOrgaoClasse, Uf } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from './../empregado.component';

import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';

@Component({
  selector: 'app-lista-empregadoorgaoclasse',
  templateUrl: './lista-empregadoorgaoclasse.component.html',
  styleUrls: []
})
export class ListaEmpregadoorgaoclasseComponent implements OnInit {

  public empregadoOrgaoClasses: EmpregadoOrgaoClasse[];
  public uf: Uf[];
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

    this.empregadoService.obterTodosUf()
      .subscribe(uf => {
        this.uf = uf
      },
        () => this.errors);

    this.empregadoOrgaoClasses = this.empregadoComponent.empregado.empregadoOrgaoClasse;

    if (this.empregadoOrgaoClasses != null) {

      for (let i = 0; i < this.empregadoOrgaoClasses.length; i++) {

        for (let y = 0; y < this.uf.length; y++) {

          if (this.empregadoOrgaoClasses[i].ufId.toString() == this.uf[y].id) {

            this.empregadoOrgaoClasses[i].uf = this.uf[y];
          }

        }

      }
    }
    console.log(this.empregadoOrgaoClasses);
  }

  editarempregadoOrgaoClasse(empregadoOrgaoClasse) {
    this.empregadoComponent.empregadoOrgaoClasse = empregadoOrgaoClasse;
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

  inativarempregadoOrgaoClasse(empregadoOrgaoClasse) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerempregadoOrgaoClasse(empregadoOrgaoClasse);
      }
      else {
      }
    });
  }

  removerempregadoOrgaoClasse(empregadoOrgaoClasse) {

    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      this.empregadoService.excluirEmpregadoorgaoclasse(empregadoOrgaoClasse.id)
        .subscribe(
          result => {
            for (var i = 0; i < this.empregadoComponent.empregado.empregadoOrgaoClasse.length; i++) {
              if (empregadoOrgaoClasse.id == this.empregadoComponent.empregado.empregadoOrgaoClasse[i].id) {
                this.empregadoComponent.empregado.empregadoOrgaoClasse.splice(i, 1);
              }
            }
          },
          () => { });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.empregadoOrgaoClasse.length; i++) {
        if (empregadoOrgaoClasse.id == this.empregadoComponent.empregado.empregadoOrgaoClasse[i].id) {
          this.empregadoComponent.empregado.empregadoOrgaoClasse.splice(i, 1);
        }
      }
    }
  }

  public empregadoOrgaoClasseGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

}

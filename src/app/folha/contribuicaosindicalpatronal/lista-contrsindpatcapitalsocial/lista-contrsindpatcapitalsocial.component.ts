import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { ContribuicaoSindicalPatronal, ContrSindPatCapitalSocial } from '../models/contribuicaosindicalpatronal';

@Component({
  selector: 'app-lista-contrsindpatcapitalsocial',
  templateUrl: './lista-contrsindpatcapitalsocial.component.html',
  styleUrls: []
})
export class ListaContrsindpatcapitalsocialComponent implements OnInit {

  public contrSindPatCapitalSocial: ContrSindPatCapitalSocial[];
  public ContribuicaoSindicalPatronalId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public ContribuicaoSindicalPatronals: ContribuicaoSindicalPatronal[];

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
    public contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent) {

    this.excluido = this.contribuicaosindicalpatronalComponent.Excluido;
    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;

  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] === undefined) {
      this.ContribuicaoSindicalPatronalId = 0;
    } else {
      this.ContribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }

    this.contrSindPatCapitalSocial = this.contribuicaosindicalpatronalComponent.ContribuicaoSindicalPatronal.contrSindPatCapitalSocial;

    this.data = this.contrSindPatCapitalSocial;
    console.log(this.contribuicaosindicalpatronalComponent);
  }

  inativarContrSindPatCapitalSocial(contrSindPatCapitalSocial) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerContrSindPatCapitalSocial(contrSindPatCapitalSocial);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerContrSindPatCapitalSocial(contrSindPatCapitalSocial) {
    if (this.ContribuicaoSindicalPatronalId > 0) {
      this.contribuicaoSindicalPatronalService.excluirContrSindPatCapitalSocial(contrSindPatCapitalSocial.id)
        .subscribe(
          result => {
            for (let i = 0; i < this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.length; i++) {
              if (contrSindPatCapitalSocial.id == this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial[i].id) {
                this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.splice(i, 1);
              }
            }
          },
          error => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.length; i++) {
        if (contrSindPatCapitalSocial.id === this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial[i].id) {
          this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.splice(i, 1);
        }
      }
    }
  }

  public editarContrSindPatCapitalSocial(contrSindPatCapitalSocial) {
    if (!this.excluido) {
      this.contribuicaosindicalpatronalComponent.contrSindPatCapitalSocial = contrSindPatCapitalSocial;

      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }

  };

  public ContrSindPatCapitalSocialGravado(msg) {
    // this.toastr.success(msg, 'Sucesso', '');
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

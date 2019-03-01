import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ContrSindPatReceitaBruta } from '../models/contribuicaosindicalpatronal';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ContribuicaosindicalpatronalComponent } from './../contribuicaosindicalpatronal.component';
import { ContribuicaoSindicalPatronal, ReceitaBruta } from './../models/contribuicaosindicalpatronal';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-contrsindpatreceitabruta',
  templateUrl: './lista-contrsindpatreceitabruta.component.html',
  styleUrls: []
})
export class ListaContrsindpatreceitabrutaComponent implements OnInit {

  public contrSindPatReceitaBruta: ContrSindPatReceitaBruta[];
  public contribuicaoSindicalPatronalId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public contrSindPatReceitaBrutas: ContrSindPatReceitaBruta[];
  public excluido: boolean;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  // variaveis Globais
  showModalEdit = false;
  showDialog = false;
  // Controller Mensansagens
  swal: SweetAlertAdviceService;

  constructor(
    public contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.excluido = this.contribuicaosindicalpatronalComponent.Excluido;
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] === undefined) {
      this.contribuicaoSindicalPatronalId = 0;
    } else {
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }
    this.contrSindPatReceitaBruta = this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta;

    this.contribuicaoSindicalPatronalService.obterTodosContribuicaoSindicalPatronalReceitaBruta()
      .subscribe(resultado => {
        this.contrSindPatReceitaBrutas = resultado;

        if (this.contrSindPatReceitaBruta != null) {
          for (let i = 0; i < this.contrSindPatReceitaBruta.length; i++) {

            for (let f = 0; f < this.contrSindPatReceitaBruta.length; f++) {

              if (this.contrSindPatReceitaBrutas[i].id === this.contrSindPatReceitaBruta[f].id) {
                this.contrSindPatReceitaBrutas[i] = this.contrSindPatReceitaBruta[f];
              }
            }
          }
        }
      }, () => this.errors);
    this.data = this.contrSindPatReceitaBruta;

  }

  cadastrarContrSindPatReceitaBruta() {
    this.router.navigate(['contrsindpatreceitabruta/adicionar']);
  }

  editarContrSindPatReceitaBruta(contrSindPatReceitaBruta) {
    if (!this.excluido) {
      this.contribuicaosindicalpatronalComponent.contrSindPatReceitaBruta = contrSindPatReceitaBruta;
      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  inativarContrSindPatReceitaBruta(contrSindPatReceitaBruta) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerContrSindPatReceitaBruta(contrSindPatReceitaBruta);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerContrSindPatReceitaBruta(contrSindPatReceitaBruta) {
    if (this.contribuicaoSindicalPatronalId > 0) {
      this.contribuicaoSindicalPatronalService.excluirContrSindPatReceitaBruta(contrSindPatReceitaBruta.id)
        .subscribe(
          result => {
            // tslint:disable-next-line:max-line-length
            for (let i = 0; i < this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.length; i++) {
              if (contrSindPatReceitaBruta.id === this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta[i].id) {
                this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.splice(i, 1);
              }
            }
          },
          error => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.length; i++) {
        // tslint:disable-next-line:max-line-length
        if (contrSindPatReceitaBruta.id === this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta[i].id) {
          this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.splice(i, 1);
        }
      }
    }
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


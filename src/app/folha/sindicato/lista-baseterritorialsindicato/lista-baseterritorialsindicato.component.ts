import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Sindicato, BaseTerritorialSindicato, Localidade, Uf } from './../models/sindicato';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { SindicatoService } from '../sindicato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SindicatoComponent } from '../sindicato.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-baseterritorialsindicato',
  templateUrl: './lista-baseterritorialsindicato.component.html',
  styleUrls: ['./lista-baseterritorialsindicato.component.css']
})
export class ListaBaseterritorialsindicatoComponent implements OnInit {

  // Propriedades
  public baseTerritorialSindicato: BaseTerritorialSindicato[];
  public sindicatoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public localidades: Localidade[];
  public ufs: Uf[];


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
  public excluido: boolean;

  constructor(
    public sindicatoService: SindicatoService,
    private router: Router, public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private sindicatoComponent: SindicatoComponent
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.excluido = this.sindicatoComponent.Excluido;
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id'] === undefined) {
      this.sindicatoId = 0;
    } else {
      this.sindicatoId = this.route.snapshot.params['id'];
    }

    this.baseTerritorialSindicato = this.sindicatoComponent.Sindicato.baseTerritorialSindicato;

    this.sindicatoService.obterTodosLocalidade()
      .subscribe(localidades => {
        this.localidades = localidades;
        if (this.baseTerritorialSindicato != null) {
          for (let i = 0; i < this.baseTerritorialSindicato.length; i++) {

            for (let y = 0; y < this.localidades.length; y++) {
              if (this.baseTerritorialSindicato[i].localidadeId == this.localidades[y].id) {
                this.baseTerritorialSindicato[i].localidade = this.localidades[y];
              }
            }
          }
        }
      },
        error => this.errors);

    this.sindicatoService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs;
        if (this.baseTerritorialSindicato != null) {
          for (let i = 0; i < this.baseTerritorialSindicato.length; i++) {

            for (let y = 0; y < this.ufs.length; y++) {
              if (this.baseTerritorialSindicato[i].ufId == this.ufs[y].id) {
                this.baseTerritorialSindicato[i].uf = this.ufs[y];
              }
            }
          }
        }
      },
        error => this.errors);

    this.data = this.baseTerritorialSindicato;
  }
  cadastrarBaseTerritorialSindicato() {
    this.router.navigate(['baseterritorialsindicato/adicionar']);
  }

  editarBaseTerritorialSindicato(baseTerritorialSindicato) {
    if (!this.excluido) {
      this.sindicatoComponent.BaseTerritorialSindicato = baseTerritorialSindicato;
      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  inativarBaseTerritorialSindicato(baseTerritorialSindicato) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerBaseTerritorialSindicato(baseTerritorialSindicato);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerBaseTerritorialSindicato(baseTerritorialSindicato) {
    if (this.sindicatoId > 0) {
      this.sindicatoService.excluirBaseTerritorialSindicato(baseTerritorialSindicato.id)
        .subscribe(
          result => {
            for (let i = 0; i < this.sindicatoComponent.Sindicato.baseTerritorialSindicato.length; i++) {
              if (baseTerritorialSindicato.id === this.sindicatoComponent.Sindicato.baseTerritorialSindicato[i].id) {
                this.sindicatoComponent.Sindicato.baseTerritorialSindicato.splice(i, 1);
              }
            }
          },
          () => this.errors
        );
    } else {
      for (let i = 0; i < this.sindicatoComponent.Sindicato.baseTerritorialSindicato.length; i++) {
        if (baseTerritorialSindicato.id === this.sindicatoComponent.Sindicato.baseTerritorialSindicato[i].id) {
          this.sindicatoComponent.Sindicato.baseTerritorialSindicato.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public baseTerritorialSindicatoGravado(msg) {
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


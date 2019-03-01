import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ContrSindPatNumeroAlunos } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { dashboardRouterConfig } from './../../../dashboard/dashboard/dashboard.routes';
import { DataFilterPipe } from './../../../utils/datafilter.pipe';

@Component({
  selector: 'app-lista-contrsindpatnumeroalunos',
  templateUrl: './lista-contrsindpatnumeroalunos.component.html',
  styleUrls: []
})
export class ListaContrsindpatnumeroalunosComponent implements OnInit {
  public contrSindPatNumeroAluno: ContrSindPatNumeroAlunos[];
  public contribuicaoSindicalPatronalId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public contrSindPatNumeroAlunos: ContrSindPatNumeroAlunos[];

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
    private router: Router, private toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    public contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.excluido = this.contribuicaosindicalpatronalComponent.Excluido;
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id'] === undefined) {
      this.contribuicaoSindicalPatronalId = 0;
    } else {
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }

    this.contrSindPatNumeroAluno = this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno;

    this.contribuicaoSindicalPatronalService.obterTodosContrSindPatNumeroAlunos()
      .subscribe(resultado => {
        this.contrSindPatNumeroAlunos = resultado

        if (this.contrSindPatNumeroAluno != null) {
          for (let i = 0; i < this.contrSindPatNumeroAluno.length; i++) {

            for (let f = 0; f < this.contrSindPatNumeroAluno.length; f++) {
              if (this.contrSindPatNumeroAlunos[i].contribuicaoSindicalPatronalId == this.contrSindPatNumeroAluno[f].id) {
                this.contrSindPatNumeroAlunos[i] = this.contrSindPatNumeroAluno[f];
              }
            }
          }
        }
      }, () => this.errors);

    this.data = this.contrSindPatNumeroAluno;
  }

  cadastrarContrSindPatNumeroAlunos() {
    this.router.navigate(['contrsindpatnumeroalunos/adicionar']);
  }

  editarContrSindPatNumeroAlunos(numeroAluno) {
    if (!this.excluido) {
      this.contribuicaosindicalpatronalComponent.contrSindPatNumeroAluno = numeroAluno;
      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  inativarContrSindPatNumeroAlunos(numeroAluno) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerContrSindPatNumeroAlunos(numeroAluno);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerContrSindPatNumeroAlunos(numeroAluno) {
    if (this.contribuicaoSindicalPatronalId > 0) {
      this.contribuicaoSindicalPatronalService.excluirContrSindPatNumeroAlunos(numeroAluno.id)
        .subscribe(
          () => {
            for (let i = 0; i < this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.length; i++) {
              if (numeroAluno.id === this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno[i].id) {
                this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.splice(i, 1);
              }
            }
          },
          () => {
            this.errors;
          }
        );
    } else {
      for (let i = 0; i < this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.length; i++) {
        if (numeroAluno.id === this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno[i].id) {
          this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public contrSindPatNumeroAlunosGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public contrSindPatNumeroAlunosErro(msg) {
    this.toastr.error(msg, 'Falha', '');
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
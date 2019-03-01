import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DiretoriaSindical, Cargo } from '../models/sindicato';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { SindicatoComponent } from '../sindicato.component';
import { SindicatoService } from '../sindicato.service';

@Component({
  selector: 'app-lista-diretoriasindical',
  templateUrl: './lista-diretoriasindical.component.html',
  styleUrls: ['./lista-diretoriasindical.component.css']
})
export class ListaDiretoriasindicalComponent implements OnInit {
  public diretoriaSindical: DiretoriaSindical[];
  public sindicatoId: 0;
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
    private router: Router, private toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    public sindicatoComponent: SindicatoComponent) {

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

    this.diretoriaSindical = this.sindicatoComponent.Sindicato.diretoriaSindical;

    this.sindicatoService.obterTodosCargo()
      .subscribe(cargos => {
        this.cargos = cargos

        if (this.diretoriaSindical != null) {
          for (let i = 0; i < this.diretoriaSindical.length; i++) {

            for (let f = 0; f < this.cargos.length; f++) {

              if (this.diretoriaSindical[i].cargoId == this.cargos[f].id) {

                this.diretoriaSindical[i].cargo = this.cargos[f];

              }
            }
          }
        }
      },
        (erro) => this.errors = erro);

    this.data = this.diretoriaSindical;

  }

  cadastrarDiretoriaSindical() {
    this.router.navigate(['diretoriaSindical/adicionar']);
  }

  inativarDiretoriaSindical(diretoriaSindical) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerDiretoriaSindical(diretoriaSindical);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerDiretoriaSindical(diretoriaSindical) {
    if (this.sindicatoId > 0) {
      this.sindicatoService.excluirDiretoriaSindical(diretoriaSindical.id)
        .subscribe(
          () => {
            for (let i = 0; i < this.sindicatoComponent.Sindicato.diretoriaSindical.length; i++) {
              if (diretoriaSindical.id == this.sindicatoComponent.Sindicato.diretoriaSindical[i].id) {
                this.sindicatoComponent.Sindicato.diretoriaSindical.splice(i, 1);
              }
            }
          },
          () => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.sindicatoComponent.Sindicato.diretoriaSindical.length; i++) {
        if (diretoriaSindical.id === this.sindicatoComponent.Sindicato.diretoriaSindical[i].id) {
          this.sindicatoComponent.Sindicato.diretoriaSindical.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public diretoriaSindicalGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }
  
  editarDiretoriaSindical(diretoriaSindical) {
    if (!this.excluido) {
      this.sindicatoComponent.DiretoriaSindical = diretoriaSindical;
      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
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

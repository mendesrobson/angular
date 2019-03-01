import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SindicatoConvencao, Convencao } from '../models/sindicato';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { SindicatoService } from '../sindicato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SindicatoComponent } from '../sindicato.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-sindicatoconvencao',
  templateUrl: './lista-sindicatoconvencao.component.html',
  styleUrls: ['./lista-sindicatoconvencao.component.css']
})
export class ListaSindicatoconvencaoComponent implements OnInit {

  // Propriedades
  public sindicatoConvencao: SindicatoConvencao[];
  public sindicatoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public convencaos: Convencao[];

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

    this.sindicatoConvencao = this.sindicatoComponent.sindicato.sindicatoConvencao;

    this.sindicatoService.obterTodosConvencao()
      .subscribe(convencaos => {
        this.convencaos = convencaos;
        if (this.sindicatoConvencao != null) {
          for (let i = 0; i < this.sindicatoConvencao.length; i++) {

            for (let y = 0; y < this.convencaos.length; y++) {
              if (this.sindicatoConvencao[i].convencaoId == this.convencaos[y].id) {
                this.sindicatoConvencao[i].convencao = this.convencaos[y];
              }
            }
          }
        }

      },
        error => this.errors);


    this.data = this.sindicatoConvencao;

  }
  cadastrarSindicatoConvencao() {
    this.router.navigate(['sindicatoconvencao/adicionar']);
  }

  editarSindicatoConvencao(sindicatoConvencao) {
    if (!this.excluido) {
      this.sindicatoComponent.SindicatoConvencao = sindicatoConvencao;
      this.showModal('modalEditar');
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  inativarSindicatoConvencao(sindicatoConvencao) {
    if (!this.excluido) {
      const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerSindicatoConvencao(sindicatoConvencao);
        }
      });
    } else {
      this.toastr.error('Não é possível alterar um registro removido', 'Ops!');
    }
  }

  removerSindicatoConvencao(sindicatoConvencao) {
    if (this.sindicatoId > 0) {
      this.sindicatoService.excluirSindicatoConvencao(sindicatoConvencao.id)
        .subscribe(
          result => {
            for (let i = 0; i < this.sindicatoComponent.Sindicato.sindicatoConvencao.length; i++) {
              if (sindicatoConvencao.id === this.sindicatoComponent.Sindicato.sindicatoConvencao[i].id) {
                this.sindicatoComponent.Sindicato.sindicatoConvencao.splice(i, 1);
              }
            }
          },
          () => this.errors
        );
    } else {
      for (let i = 0; i < this.sindicatoComponent.Sindicato.sindicatoConvencao.length; i++) {
        if (sindicatoConvencao.id === this.sindicatoComponent.Sindicato.sindicatoConvencao[i].id) {
          this.sindicatoComponent.Sindicato.sindicatoConvencao.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public cargoCboGravado(msg) {
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

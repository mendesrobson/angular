import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from './../pessoa.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { PessoaComponent } from './../pessoa.component';
import { Cliente, ClienteSindicato, Sindicato, SindicatoConvencao } from './../../cliente/models/cliente';
import { Convencao } from './../../../folha/sindicato/models/sindicato';

@Component({
  selector: 'app-lista-clientesindicato',
  templateUrl: './lista-clientesindicato.component.html',
  styleUrls: []
})
export class ListaClientesindicatoComponent implements OnInit {
  public clienteSindicato: ClienteSindicato[];
  public pessoaId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public convencao: Convencao[];
  public sindicato: Sindicato[];
  public sindicatoConvencao: SindicatoConvencao[];

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
    public pessoaService: PessoaService,
    private router: Router, private toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;

  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] === undefined) {
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }

    this.clienteSindicato = this.pessoaComponent.Cliente.clienteSindicato;
    
    this.pessoaService.obterTodosSindicatoConvencao()
      .subscribe(sc => {
        this.sindicatoConvencao = sc;

        if (this.clienteSindicato != null) {
          for (let i = 0; i < this.clienteSindicato.length; i++) {

            for (let f = 0; f < this.sindicatoConvencao.length; f++) {

              if (this.clienteSindicato[i].sindicatoConvencaoId == this.sindicatoConvencao[f].id) {

                this.clienteSindicato[i].sindicatoConvencao = this.sindicatoConvencao[f];

                if (this.clienteSindicato[i].sindicatoConvencao != null) {

                  this.pessoaService.obterTodosSindicato()
                    .subscribe(s => {
                      this.sindicato = s;

                      if (this.clienteSindicato != null) {
                        for (let i = 0; i < this.clienteSindicato.length; i++) {

                          for (let f = 0; f < this.sindicato.length; f++) {

                            if (this.clienteSindicato[i].sindicatoConvencao.sindicatoId == this.sindicato[f].id) {

                              this.clienteSindicato[i].sindicatoConvencao.sindicato = this.sindicato[f];
                            }
                          }
                        }
                      }
                    }, () => { });
                  this.pessoaService.obterConvencaoPorId(this.clienteSindicato[i].sindicatoConvencao.convencaoId.toString())
                    .subscribe(c => {
                      this.clienteSindicato[i].sindicatoConvencao.convencao = c;
                    });

                }
              }
            }
          }
        }
      }, () => { }
      );


    this.data = this.clienteSindicato;

  }

  cadastrarClienteSindicato() {
    this.router.navigate(['clientesindicato/adicionar']);
  }

  inativarClieteSindicato(model) {
    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.RemoverClienteSindicato(model);
      }
    });
  }

  RemoverClienteSindicato(model) {
    if (this.pessoaId > 0) {
      console.log("Remover");
      console.log(model);
      this.pessoaService.removerClienteSindicato(model)
        .subscribe(
          () => {
            for (let i = 0; i < this.pessoaComponent.Cliente.clienteSindicato.length; i++) {
              if (model.id == this.pessoaComponent.Cliente.clienteSindicato[i].id) {
                this.pessoaComponent.Cliente.clienteSindicato.splice(i, 1);
              }
            }
          },
          () => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.pessoaComponent.Cliente.clienteSindicato.length; i++) {
        if (model.id === this.pessoaComponent.Cliente.clienteSindicato[i].id) {
          this.pessoaComponent.Cliente.clienteSindicato.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public clienteSindicatoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  editarClieteSindicato(model) {
    this.pessoaComponent.ClienteSindicato = model;
    this.showModal('modalEditar');
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

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PessoaContato, TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { EmpregadoService } from '../empregado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpregadoComponent } from './../empregado.component';

@Component({
  selector: 'app-lista-pessoacontato',
  templateUrl: './lista-pessoacontato.component.html',
  styleUrls: ['./lista-pessoacontato.component.css']
})
export class ListaPessoacontatoComponent implements OnInit {

  public contatos: PessoaContato[];
  public empregadoId: 0;
  public tipoContatos: TipoContato[];
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

  constructor(public empregadoService: EmpregadoService,
    private router: Router,
    private route: ActivatedRoute,
    vcr: ViewContainerRef,
    private empregadoComponent: EmpregadoComponent) {

    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;

  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined) {
      this.empregadoId = 0
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }

    this.contatos = this.empregadoComponent.empregado.pessoa.pessoaContato;

    this.empregadoService.obterTodosTipoContato()
      .subscribe(tipoContatos => {
        this.tipoContatos = tipoContatos;

        if (this.contatos != null) {

          for (let i = 0; i < this.contatos.length; i++) {

            for (let y = 0; y < this.tipoContatos.length; y++) {

              if (this.contatos[i].tipoContatoId == this.tipoContatos[y].id) {

                this.contatos[i].tipoContato = this.tipoContatos[y];
              }

            }
          }

        }
      },
        error => this.errors);

    this.data = this.contatos;

  }

  editarPessoaContato(contato) {
    this.empregadoComponent.contato = contato;
    this.showModal('modalEditar');
  }

  cadastrarPessoaContato() {
    this.router.navigate(['pessoacontato/adicionar']);
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

  inativarPessoaContato(contato) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerPessoaContato(contato);
      }
      else {
      }
    });
  }

  removerPessoaContato(contato) {
    this.empregadoComponent.dirty = true;
    if (this.empregadoId > 0) {
      this.empregadoService.excluirContato(contato.id)
        .subscribe(
          result => {
            for (var i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++) {
              if (contato.id == this.empregadoComponent.empregado.pessoa.pessoaContato[i].id) {
                this.empregadoComponent.empregado.pessoa.pessoaContato.splice(i, 1);
              }
            }
          },
          error => {
            this.errors;
          });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++) {
        if (contato.id == this.empregadoComponent.empregado.pessoa.pessoaContato[i].id) {
          this.empregadoComponent.empregado.pessoa.pessoaContato.splice(i, 1);
        }
      }
    }
  }

  public pessoaContatoGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

}

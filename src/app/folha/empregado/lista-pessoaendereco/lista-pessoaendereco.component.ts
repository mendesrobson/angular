import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Endereco } from '../../../cadastros/pessoa/models/pessoa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { EmpregadoService } from '../empregado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpregadoComponent } from './../empregado.component';

@Component({
  selector: 'app-lista-pessoaendereco',
  templateUrl: './lista-pessoaendereco.component.html',
  styleUrls: ['./lista-pessoaendereco.component.css']
})
export class ListaPessoaenderecoComponent implements OnInit {

  public enderecos: Endereco[];
  public pessoaId: 0;
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

  ngOnInit() : void {

    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.data = this.empregadoComponent.empregado.pessoa.endereco;

  }

  editarPessoaEndereco(endereco) {
    this.empregadoComponent.endereco = endereco;
    this.showModal('modalEditar');
  }

  cadastrarPessoaEndereco() {
    this.router.navigate(['pessoaendereco/adicionar']);
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

  inativarPessoaEndereco(endereco) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerPessoaEndereco(endereco);
      }
      else {
      }
    });
  }

  removerPessoaEndereco(endereco) {
    this.empregadoComponent.dirty = true;
    if (this.pessoaId > 0) {
      this.empregadoService.excluirEndereco(endereco.id)
        .subscribe(
        result => {
          for (var i = 0; i < this.empregadoComponent.empregado.pessoa.endereco.length; i++) {
            if (endereco.id == this.empregadoComponent.empregado.pessoa.endereco[i].id) {
              this.empregadoComponent.empregado.pessoa.endereco.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.pessoa.endereco.length; i++) {
        if (endereco.id == this.empregadoComponent.empregado.pessoa.endereco[i].id) {
          this.empregadoComponent.empregado.pessoa.endereco.splice(i, 1);
        }
      }
    }
  }

  public pessoaEnderecoGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

  public pessoaEnderecoErro(msg) {
    //this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  

}

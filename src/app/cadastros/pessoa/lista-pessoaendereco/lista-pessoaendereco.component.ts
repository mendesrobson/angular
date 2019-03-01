import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, Endereco } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';

@Component({
  selector: 'app-lista-pessoaendereco',
  templateUrl: './lista-pessoaendereco.component.html',
  styleUrls: []
})
export class ListaPessoaenderecoComponent implements OnInit {

  public endereco: Endereco[];
  public pessoaId = 0;
  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public pessoaService: PessoaService,
    private router: Router,
    private route: ActivatedRoute,
   // private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private pessoaComponent: PessoaComponent) {

   // this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.data = this.pessoaComponent.Pessoa.endereco;

  }

  editarPessoaEndereco(endereco) {
    this.pessoaComponent.pessoaEndereco = endereco;
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

  inativarPessoaEndereco(pessoaEndereco) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerPessoaEndereco(pessoaEndereco);
      }
      else {
      }
    });
  }

  removerPessoaEndereco(pessoaEndereco) {
    this.pessoaComponent.dirty = true;
    if (this.pessoaId > 0) {
      this.pessoaService.RemoverPessoaEndereco(pessoaEndereco)
        .subscribe(
        result => {
          for (var i = 0; i < this.pessoaComponent.Pessoa.endereco.length; i++) {
            if (pessoaEndereco.id == this.pessoaComponent.Pessoa.endereco[i].id) {
              this.pessoaComponent.Pessoa.endereco.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.pessoaComponent.Pessoa.endereco.length; i++) {
        if (pessoaEndereco.id == this.pessoaComponent.Pessoa.endereco[i].id) {
          this.pessoaComponent.Pessoa.endereco.splice(i, 1);
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


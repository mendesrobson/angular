import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, PessoaContato } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';
@Component({
  selector: 'app-lista-pessoacontato',
  templateUrl: './lista-pessoacontato.component.html',
  styleUrls: [],
})
export class ListaPessoacontatoComponent implements OnInit {

  public pessoaContato: PessoaContato[];
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
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
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
    this.data = this.pessoaComponent.Pessoa.pessoaContato;
  }

  editarPessoaContato(contato) {
    this.pessoaComponent.PessoaContato = contato;
    this.showModal('modalEditar');
  }


  cadastrarPessoaContato() {
    this.router.navigate(['pessoacontato/adicionar']);
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

  inativarPessoaContato(pessoaContato) {
    console.log('Click Botao Inativar');
    const self = this;
     this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
       if (isConfirmed) {
         self.removerPessoaContato(pessoaContato);
       }
     });
  }


  removerPessoaContato(pessoaContato) {
    this.pessoaComponent.dirty = true;
    if (this.pessoaId > 0) {
      this.pessoaService.RemoverPessoaContato(pessoaContato)
        .subscribe(
        result => {
          for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaContato.length; i++) {
            if (pessoaContato.id == this.pessoaComponent.Pessoa.pessoaContato[i].id) {
              this.pessoaComponent.Pessoa.pessoaContato.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaContato.length; i++) {
        if (pessoaContato.id == this.pessoaComponent.Pessoa.pessoaContato[i].id) {
          this.pessoaComponent.Pessoa.pessoaContato.splice(i, 1);
        }
      }
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public pessoaContatoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public pessoaContatoErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

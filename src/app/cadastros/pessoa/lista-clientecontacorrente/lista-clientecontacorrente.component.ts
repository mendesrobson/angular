import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';

import { ClienteContaCorrente, Banco, ContaCorrente } from './../models/pessoa';
import { PessoaService } from './../pessoa.service';
import { PessoaComponent } from './../pessoa.component';

@Component({
  selector: 'app-lista-clientecontacorrente',
  templateUrl: './lista-clientecontacorrente.component.html',
  styleUrls: []
})
export class ListaClientecontacorrenteComponent implements OnInit {

  public clienteContaCorrente: ClienteContaCorrente[];
  public pessoaId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  public bancos: Banco[];
  public contaCorrente: ContaCorrente;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];

  showModalEdit = false;
  showDialog = false;
  swal: SweetAlertAdviceService;

  constructor(
    public pessoaService: PessoaService,
    private router: Router, 
    private toastr: ToastsManager, 
    vcr: ViewContainerRef,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent) { 

      this.toastr.setRootViewContainerRef(vcr);
      this.swal = new SweetAlertAdviceService();
      this.modalAddVisible = false;
      this.modalEditVisible = false;
      this.contaCorrente = new ContaCorrente();

    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }

    this.clienteContaCorrente = this.pessoaComponent.cliente.clienteContaCorrente;

  }

  cadastrarClienteContaCorrente() {
    this.router.navigate(['clientecontacorrente/adicionar']);
  }

  inativarClienteContaCorrente(clienteContaCorrente) {
    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerClienteContaCorrente(clienteContaCorrente);
      }
    });
  }

  removerClienteContaCorrente(clienteContaCorrente) {
    
    if (this.pessoaId > 0) {

      this.contaCorrente = clienteContaCorrente.contaCorrente;

      this.pessoaService.excluirClienteContaCorrente(clienteContaCorrente)
        .subscribe(
          () => {

            this.contaCorrente.banco = null;

            this.pessoaService.excluirContaCorrente(this.contaCorrente)
            .subscribe(() => {}, () => { this.errors; });

            for (let i = 0; i < this.pessoaComponent.cliente.clienteContaCorrente.length; i++) {
              if (clienteContaCorrente.id == this.pessoaComponent.cliente.clienteContaCorrente[i].id) {
                this.pessoaComponent.cliente.clienteContaCorrente.splice(i, 1);
              }
            }
            
          },
          () => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.pessoaComponent.cliente.clienteContaCorrente.length; i++) {
        if (clienteContaCorrente.id === this.pessoaComponent.cliente.clienteContaCorrente[i].id) {
          this.pessoaComponent.cliente.clienteContaCorrente.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public clienteContaCorrenteGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }
  
  editarClienteContaCorrente(clienteContaCorrente){
    this.pessoaComponent.clienteContaCorrente = clienteContaCorrente;
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

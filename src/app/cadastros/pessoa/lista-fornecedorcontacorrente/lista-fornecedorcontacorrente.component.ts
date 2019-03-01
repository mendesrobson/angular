import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { FornecedorComponent } from '../../fornecedor/fornecedor.component';
import { FornecedorContaCorrente, Banco, ContaCorrente } from './../models/pessoa';
import { PessoaService } from './../pessoa.service';
import { PessoaComponent } from './../pessoa.component';


@Component({
  selector: 'app-lista-fornecedorcontacorrente',
  templateUrl: './lista-fornecedorcontacorrente.component.html',
  styleUrls: [],
  providers: [FornecedorComponent]
})
export class ListaFornecedorcontacorrenteComponent implements OnInit {

  public fornecedorContaCorrente: FornecedorContaCorrente[];
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
      this.contaCorrente = new ContaCorrente();

    }

  ngOnInit() : void {

    if (this.route.snapshot.params['id'] === undefined) {
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }
    
    this.fornecedorContaCorrente = this.pessoaComponent.Fornecedor.fornecedorContaCorrente;


    this.pessoaService.obterTodosBanco()
      .subscribe(b => {
        this.bancos = b
        
        // if (this.fornecedorContaCorrente != null) {
        //   for (let i = 0; i < this.fornecedorContaCorrente.length; i++) {

        //     for (let f = 0; f < this.bancos.length; f++) {

        //       if (this.fornecedorContaCorrente[i].bancoId == this.bancos[f].id) {
                
        //         this.fornecedorContaCorrente[i].banco = this.bancos[f];
                
        //       }
        //     }
        //   }
        // }
      },
      (erro) => this.errors = erro);

    this.data = this.fornecedorContaCorrente;

  }

  cadastrarFornecedorContaCorrente() {
    this.router.navigate(['fornecedorcontacorrente/adicionar']);
  }

  inativarFornecedorContaCorrente(fornecedorContaCorrente) {
    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerFornecedorContaCorrente(fornecedorContaCorrente);
      }
    });
  }

  removerFornecedorContaCorrente(fornecedorContaCorrente) {
    if (this.pessoaId > 0) {

      this.contaCorrente = fornecedorContaCorrente.contaCorrente;

      this.pessoaService.RemoverFornecedorContaCorrente(fornecedorContaCorrente)
        .subscribe(
          () => {

            this.contaCorrente.banco = null;

            this.pessoaService.excluirContaCorrente(this.contaCorrente)
            .subscribe(() => {}, () => { this.errors; });

            for (let i = 0; i < this.pessoaComponent.Fornecedor.fornecedorContaCorrente.length; i++) {
              if (fornecedorContaCorrente.id == this.pessoaComponent.Fornecedor.fornecedorContaCorrente[i].id) {
                this.pessoaComponent.Fornecedor.fornecedorContaCorrente.splice(i, 1);
              }
            }
            
          },
          () => {
            this.errors;
          });
    } else {
      for (let i = 0; i < this.pessoaComponent.Fornecedor.fornecedorContaCorrente.length; i++) {
        if (fornecedorContaCorrente.id === this.pessoaComponent.Fornecedor.fornecedorContaCorrente[i].id) {
          this.pessoaComponent.Fornecedor.fornecedorContaCorrente.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public fornecedorContaCorrenteGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }
  
  editarFornecedorContaCorrente(fornecedorContaCorrente){
    this.pessoaComponent.FornecedorContaCorrente = fornecedorContaCorrente;
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

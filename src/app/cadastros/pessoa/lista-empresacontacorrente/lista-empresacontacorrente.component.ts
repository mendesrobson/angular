import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, EmpresaContaCorrente } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';

@Component({
  selector: 'app-lista-empresacontacorrente',
  templateUrl: './lista-empresacontacorrente.component.html',
  styleUrls: []
})
export class ListaEmpresacontacorrenteComponent implements OnInit {

  public empresaContaCorrente: EmpresaContaCorrente[];
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

  constructor(
    public pessoaService: PessoaService,
    private router: Router,
    private route: ActivatedRoute,
   // private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private pessoaComponent: PessoaComponent) {

    //this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.data = this.pessoaComponent.Pessoa.empresaContaCorrente;

  }

  editarEmpresaContaCorrente(contato) {
    this.pessoaComponent.EmpresaContaCorrente = contato;
    this.showModal('modalEditar');
  }

  cadastrarEmpresaContaCorrente() {
    this.router.navigate(['empresacontacorrente/adicionar']);
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

  inativarEmpresaContaCorrente(empresaContaCorrente) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerEmpresaContaCorrente(empresaContaCorrente);
      }
      else {
      }
    });
  }

  removerEmpresaContaCorrente(empresaContaCorrente) {
    this.pessoaComponent.dirty = true;
    if (this.pessoaId > 0) {
      this.pessoaService.RemoverEmpresaContaCorrente(empresaContaCorrente)
        .subscribe(
        result => {
          for (var i = 0; i < this.pessoaComponent.Pessoa.empresaContaCorrente.length; i++) {
            if (empresaContaCorrente.id == this.pessoaComponent.Pessoa.empresaContaCorrente[i].id) {
              this.pessoaComponent.Pessoa.empresaContaCorrente.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.pessoaComponent.Pessoa.empresaContaCorrente.length; i++) {
        if (empresaContaCorrente.id == this.pessoaComponent.Pessoa.empresaContaCorrente[i].id) {
          this.pessoaComponent.Pessoa.empresaContaCorrente.splice(i, 1);
        }
      }
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public empresaContaCorrenteGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

  public empresaContaCorrenteErro(msg) {
   // this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

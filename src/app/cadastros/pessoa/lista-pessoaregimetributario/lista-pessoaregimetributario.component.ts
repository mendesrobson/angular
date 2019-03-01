import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, PessoaRegimeTributario } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';

@Component({
  selector: 'app-lista-pessoaregimetributario',
  templateUrl: './lista-pessoaregimetributario.component.html',
  styleUrls: []
})
export class ListaPessoaregimetributarioComponent implements OnInit {

  public pessoaRegimeTributario: PessoaRegimeTributario[];
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
    //private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private pessoaComponent: PessoaComponent) {

    //this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.data = this.pessoaComponent.Pessoa.pessoaRegimeTributario;
  }

  editarPessoaRegimeTributario(pessoaRegimeTributario) {
    this.pessoaComponent.PessoaRegimeTributario = pessoaRegimeTributario;
    this.showModal('modalEditar');
  }


  cadastrarPessoaRegimeTributario() {
    this.router.navigate(['pessoaregimetributario/adicionar']);
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

  inativarPessoaRegimeTributario(pessoaRegimeTributario) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerPessoaRegimeTributario(pessoaRegimeTributario);
      }
      else {
      }
    });
  }


  removerPessoaRegimeTributario(pessoaRegimeTributario) {
    this.pessoaComponent.dirty = true;
    if (this.pessoaId > 0) {
      this.pessoaService.RemoverPessoaRegimeTributario(pessoaRegimeTributario)
        .subscribe(
        result => {
          for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaRegimeTributario.length; i++) {
            if (pessoaRegimeTributario.id == this.pessoaComponent.Pessoa.pessoaRegimeTributario[i].id) {
              this.pessoaComponent.Pessoa.pessoaRegimeTributario.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaRegimeTributario.length; i++) {
        if (pessoaRegimeTributario.id == this.pessoaComponent.Pessoa.pessoaRegimeTributario[i].id) {
          this.pessoaComponent.Pessoa.pessoaRegimeTributario.splice(i, 1);
        }
      }
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public pessoaRegimeTributarioGravado(msg) {
   //this.toastr.success(msg, 'Sucesso', '');
  }

  public pessoaRegimeTributarioErro(msg) {
   //this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

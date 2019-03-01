import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, PessoaCnae } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';

@Component({
  selector: 'app-lista-pessoacnae',
  templateUrl: './lista-pessoacnae.component.html',
  styleUrls: []
})
export class ListaPessoacnaeComponent implements OnInit {

  public pessoaCnae: PessoaCnae[];
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

    this.data = this.pessoaComponent.Pessoa.pessoaCnae;
  }

  editarPessoaCnae(cnae) {
    this.pessoaComponent.PessoaCnae = cnae;
    this.showModal('modalEditar');
  }


  cadastrarPessoaCnae() {
    this.router.navigate(['pessoacnae/adicionar']);
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

  inativarPessoaCnae(cnae) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerPessoaCnae(cnae);
      }
      else {
      }
    });
  }


  removerPessoaCnae(cnae) {
    this.pessoaComponent.dirty = true;
    if (this.pessoaId > 0) {
      this.pessoaService.RemoverPessoaCnae(cnae)
        .subscribe(
        result => {
          for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaCnae.length; i++) {
            if (cnae.id == this.pessoaComponent.Pessoa.pessoaCnae[i].id) {
              this.pessoaComponent.Pessoa.pessoaCnae.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaCnae.length; i++) {
        if (cnae.id == this.pessoaComponent.Pessoa.pessoaCnae[i].id) {
          this.pessoaComponent.Pessoa.pessoaCnae.splice(i, 1);
        }
      }
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public pessoaCnaeGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

  public pessoaCnaeErro(msg) {
    //this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

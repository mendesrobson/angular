import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';
//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { Administradoracartao, AdministradoraCartaoEndereco } from '../models/administradoracartao';
import { AdministradoracartaoComponent } from '../administradoracartao.component';

@Component({
  selector: 'app-lista-administradoracartaoendereco',
  templateUrl: './lista-administradoracartaoendereco.component.html',
  styleUrls: []
})
export class ListaAdministradoracartaoenderecoComponent implements OnInit {

  public endereco: AdministradoraCartaoEndereco[];
  public administradoraCartaoId = 0;
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

  constructor(public administradoraCartaoService: AdministradoracartaoService,
    private router: Router,
    private route: ActivatedRoute,
    //private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private administradoraCartaoComponent: AdministradoracartaoComponent) {

    //this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.administradoraCartaoId = 0
    else
      this.administradoraCartaoId = this.route.snapshot.params['id'];

    this.data = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco;

  }

  editarAdministradoraCartaoEndereco(endereco) {
    this.administradoraCartaoComponent.administradoraCartaoEndereco = endereco;
    this.showModal('modalEditar');
  }


  cadastrarAdministradoraCartaoEndereco() {
    this.router.navigate(['administradoracartaoendereco/adicionar']);
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

  inativarAdministradoraCartaoEndereco(endereco) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerAdministradoraCartaoEndereco(endereco);
      }
      else {
      }
    });
  }

  removerAdministradoraCartaoEndereco(endereco) {
    if (this.administradoraCartaoId > 0) {
      this.administradoraCartaoService.RemoverAdministradoraCartaoEndereco(endereco)
        .subscribe(
        result => {
          for (var i = 0; i < this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.length; i++) {
            if (endereco.id == this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco[i].id) {
              this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.length; i++) {
        if (endereco.id == this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco[i].id) {
          this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.splice(i, 1);
        }
      }
    }
  }

  public administradoraCartaoEnderecoGravado(msg) {
   // this.toastr.success(msg, 'Sucesso', '');
  }

  public administradoraCartaoEnderecoErro(msg) {
    //this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

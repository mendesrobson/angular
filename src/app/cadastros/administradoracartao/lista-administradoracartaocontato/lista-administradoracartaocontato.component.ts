import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';
//import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from '../models/administradoracartao';
import { AdministradoracartaoComponent } from '../administradoracartao.component';

@Component({
  selector: 'app-lista-administradoracartaocontato',
  templateUrl: './lista-administradoracartaocontato.component.html',
  styleUrls: []
})
export class ListaAdministradoracartaocontatoComponent implements OnInit {

  public contato: AdministradoraCartaoContato[];
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

    this.data = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato;

  }

  editarAdministradoraCartaoContato(contato) {
    this.administradoraCartaoComponent.AdministradoracartaoContato = contato;
    this.showModal('modalEditar');
  }


  cadastrarAdministradoraCartaoContato() {
    this.router.navigate(['administradoracartaocontato/adicionar']);
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

  inativarAdministradoraCartaoContato(contato) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerAdministradoraCartaoContato(contato);
      }
    });
  }

  removerAdministradoraCartaoContato(contato) {
    if (this.administradoraCartaoId > 0) {
      this.administradoraCartaoService.RemoverAdministradoraCartaoContato(contato)
        .subscribe(
        result => {
          for (var i = 0; i < this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.length; i++) {
            if (contato.id == this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato[i].id) {
              this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.length; i++) {
        if (contato.id == this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato[i].id) {
          this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.splice(i, 1);
        }
      }
    }
  }

  public administradoraCartaoContatoGravado(msg) {
   //this.toastr.success(msg, 'Sucesso', '');
  }

  public administradoraCartaoContatoErro(msg) {
    //this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

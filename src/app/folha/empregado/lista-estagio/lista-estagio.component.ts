import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Estagio, Empregado, CoordenadorDeEstagio } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from './../empregado.component';

import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

@Component({
  selector: 'app-lista-estagio',
  templateUrl: './lista-estagio.component.html',
  styleUrls: ['./lista-estagio.component.css']
})
export class ListaEstagioComponent implements OnInit {

  estagios: Estagio[];
  coordenadoresDeEstagios: CoordenadorDeEstagio[];
  empregadoId: 0;
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

  constructor(
    public empregadoService: EmpregadoService,
    private router: Router,
    private route: ActivatedRoute,
    vcr: ViewContainerRef,
    private empregadoComponent: EmpregadoComponent) { 

      this.swal = new SweetAlertAdviceService();
      this.modalAddVisible = false;
      this.modalEditVisible = false;

    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined) {
      this.empregadoId = 0
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }
    
    this.estagios = this.empregadoComponent.empregado.estagio;
    
    if(this.estagios != null){

      this.empregadoService.obterTodosCoordenadorDeEstagio()
      .subscribe(result => { this.coordenadoresDeEstagios = result;
      
          for(let i = 0; i < this.estagios.length; i++){

              for(let y = 0; y < this.coordenadoresDeEstagios.length; y++){

                  if(this.estagios[i].coordenadorEstagioId == this.coordenadoresDeEstagios[y].id){

                      this.estagios[i].coordenadorDeEstagio = this.coordenadoresDeEstagios[y]; 
                  }

              }

          }

      },
      error => this.errors);

    }
  }

  editarEstagio(estagio) {
    this.empregadoComponent.estagio = estagio;
    this.showModal('modalEditar');
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

  inativarEstagio(estagio) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerEstagio(estagio);
      }
      else {
      }
    });
  }

  removerEstagio(estagio) {

    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      this.empregadoService.excluirEstagio(estagio.id)
        .subscribe(
          result => {
            for (var i = 0; i < this.empregadoComponent.empregado.estagio.length; i++) {
              if (estagio.id == this.empregadoComponent.empregado.estagio[i].id) {
                this.empregadoComponent.empregado.estagio.splice(i, 1);
              }
            }
          },
          error => {
            this.errors;
          });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.estagio.length; i++) {
        if (estagio.id == this.empregadoComponent.empregado.estagio[i].id) {
          this.empregadoComponent.empregado.estagio.splice(i, 1);
        }
      }
    }
  }

  public estagioGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

}

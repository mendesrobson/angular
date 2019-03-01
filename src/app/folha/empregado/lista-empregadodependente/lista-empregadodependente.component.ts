import { Component, OnInit } from '@angular/core';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';

import { EmpregadoDependente, Parentesco } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from './../empregado.component';

@Component({
  selector: 'app-lista-empregadodependente',
  templateUrl: './lista-empregadodependente.component.html',
  styleUrls: ['./lista-empregadodependente.component.css']
})
export class ListaEmpregadodependenteComponent implements OnInit {

  public empregadoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  empregadoDependente: EmpregadoDependente[];
  public parentescos: Parentesco[];

  public errors: any[] = [];
  public data: any[];

  showModalEdit = false;
  showDialog = false;
  swal: SweetAlertAdviceService;

  constructor(
    public empregadoService: EmpregadoService,
    private router: Router,
    private route: ActivatedRoute,
    private empregadoComponent: EmpregadoComponent) {

      this.swal = new SweetAlertAdviceService();
      this.modalAddVisible = false;
      this.modalEditVisible = false;
      this.empregadoDependente = new Array();

     }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined)
      this.empregadoId = 0
    else
      this.empregadoId = this.route.snapshot.params['id'];

    this.empregadoDependente = this.empregadoComponent.empregado.empregadoDependente;

    if(this.empregadoDependente != null){

          this.empregadoService.obterTodosParentescos()
          .subscribe(result => { this.parentescos = result;
          
                for(let i = 0; i < this.empregadoDependente.length; i++){

                      for(let y = 0; y < this.parentescos.length; y ++){

                            if(this.empregadoDependente[i].parentescoId == this.parentescos[y].id){

                                this.empregadoDependente[i].parentesco = this.parentescos[y];

                            }

                      }


                }
          
          });

    }

  }

  editarEmpregadoDependente(empregadoDependente) {
    this.empregadoComponent.empregadoDependente = empregadoDependente;
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

  inativarEmpregadoDependente(empregadoDependente) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerEmpregadoDependente(empregadoDependente);
      }
      else {
      }
    });
  }

  removerEmpregadoDependente(empregadoDependente) {
    
    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      this.empregadoService.excluirEmpregadoDependente(empregadoDependente.id)
        .subscribe(
        result => {
          for (var i = 0; i < this.empregadoComponent.empregado.empregadoDependente.length; i++) {
            if (empregadoDependente.id == this.empregadoComponent.empregado.empregadoDependente[i].id) {
              this.empregadoComponent.empregado.empregadoDependente.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.empregadoDependente.length; i++) {
        if (empregadoDependente.id == this.empregadoComponent.empregado.empregadoDependente[i].id) {
          this.empregadoComponent.empregado.empregadoDependente.splice(i, 1);
        }
      }
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

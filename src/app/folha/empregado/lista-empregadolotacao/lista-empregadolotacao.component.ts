import { Component, OnInit } from '@angular/core';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';

import { EmpregadoLotacao, Cargo, Departamento, TiposSalarios } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from './../empregado.component';

@Component({
  selector: 'app-lista-empregadolotacao',
  templateUrl: './lista-empregadolotacao.component.html',
  styleUrls: ['./lista-empregadolotacao.component.css']
})
export class ListaEmpregadolotacaoComponent implements OnInit {

  public empregadoId: 0;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  empregadoLotacoes: EmpregadoLotacao[];
  cargos: Cargo[];
  departamentos: Departamento[];
  tiposSalarios: TiposSalarios[];


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
      this.empregadoLotacoes = new Array();

     }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined)
      this.empregadoId = 0
    else
      this.empregadoId = this.route.snapshot.params['id'];

    this.empregadoLotacoes = this.empregadoComponent.empregado.empregadoLotacao;

    if(this.empregadoLotacoes != null){

        this.empregadoService.obterTodosCargo()
        .subscribe(result => { this.cargos = result;
        
              for(let i = 0; i < this.empregadoLotacoes.length; i++){

                  for(let y = 0; y < this.cargos.length; y++){

                      if(this.empregadoLotacoes[i].cargoId == this.cargos[y].id){

                          this.empregadoLotacoes[i].cargo = this.cargos[y];
                      }

                  }

              }
        
        });

        this.empregadoService.obterTodosDepartamento()
        .subscribe(result => { this.departamentos = result; 

            for(let i = 0; i < this.empregadoLotacoes.length; i++){

              for(let y = 0; y < this.departamentos.length; y++){

                    if(this.empregadoLotacoes[i].departamentoId == this.departamentos[y].id){

                        this.empregadoLotacoes[i].departamento = this.departamentos[y];
                    }

                }

            }

        });

        this.tiposSalarios = [
                {id: '1', descricao: 'Mensalista'},
                {id: '2', descricao: 'Aulista'},
                {id: '3', descricao: 'Horista'},
                {id: '4', descricao: 'Tarefeiro'}
              ];

        for(let i = 0; i < this.empregadoLotacoes.length; i++){

          for(let y = 0; y < this.tiposSalarios.length; y++){

                if(this.empregadoLotacoes[i].tipoSalario == this.tiposSalarios[y].id.toString()){

                    this.empregadoLotacoes[i].tiposSalarios = this.tiposSalarios[y];
                }

            }

        }

    }

  }

  editarEmpregadoLotacao(empregadoLotacao) {
    this.empregadoComponent.empregadoLotacao = empregadoLotacao;
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

  inativarEmpregadoLotacao(empregadoLotacao) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerEmpregadoLotacao(empregadoLotacao);
      }
      else {
      }
    });
  }

  removerEmpregadoLotacao(empregadoLotacao) {
    
    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      this.empregadoService.excluirEmpregadoLotacao(empregadoLotacao.id)
        .subscribe(
        result => {
          for (var i = 0; i < this.empregadoComponent.empregado.empregadoLotacao.length; i++) {
            if (empregadoLotacao.id == this.empregadoComponent.empregado.empregadoLotacao[i].id) {
              this.empregadoComponent.empregado.empregadoLotacao.splice(i, 1);
            }
          }
        },
        error => {
          this.errors;
        });
    } else {
      for (var i = 0; i < this.empregadoComponent.empregado.empregadoLotacao.length; i++) {
        if (empregadoLotacao.id == this.empregadoComponent.empregado.empregadoLotacao[i].id) {
          this.empregadoComponent.empregado.empregadoLotacao.splice(i, 1);
        }
      }
    }

    if(this.empregadoComponent.empregado.empregadoLotacao.length <= 0){
      this.empregadoComponent.empregado.empregadoLotacao = null;
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}

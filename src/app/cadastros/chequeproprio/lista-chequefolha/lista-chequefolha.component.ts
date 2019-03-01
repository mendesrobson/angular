import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';

import { ToastsManager } from 'ng2-toastr';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ChequeProprioService } from '../chequeproprio.service';
import { ChequeTalao, ChequeFolha } from '../models/chequeproprio';
import { ChequeproprioComponent } from '../chequeproprio.component';

@Component({
  selector: 'app-lista-chequefolha',
  templateUrl: './lista-chequefolha.component.html',
  styleUrls: ['./lista-chequefolha.component.css']
})
export class ListaChequefolhaComponent implements OnInit {
  public chequeFolha: ChequeFolha[];
  public chequeTalaoId = 0;
  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;
  index: number = 0;
  carregaChequeFolhaHistorico: boolean = false;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public chequeProprioService: ChequeProprioService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private chequeProprioComponent: ChequeproprioComponent) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.chequeTalaoId = 0
    else
      this.chequeTalaoId = this.route.snapshot.params['id'];


      if(this.chequeTalaoId > 0){

            if(this.chequeProprioComponent.chequeTalao.chequeFolha != null){

                  for(let i = 0; i < this.chequeProprioComponent.chequeTalao.chequeFolha.length; i++){

                        switch(this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao){
                
                              case 'EMI':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Emitido';
                              break;
                
                              case 'CAN':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Cancelado';
                              break;
                
                              case 'ACR':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Acordo';
                              break;
                
                              case 'COM':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Compensado';
                              break;

                              case 'CON':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Contrato';
                              break;
                
                              case 'DEP':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Depósito';
                              break;

                              case 'DIS':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Disponível';
                              break;
                
                              case 'COB':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Em Cobrança';
                              break;
                
                              case 'SAN':
                              this.chequeProprioComponent.chequeTalao.chequeFolha[i].situacao = 'Sangria';
                              break;
                          
                        }
                  }  
            }

      }

      
  }

  onChange_Folha(i): void {
    this.index = i;
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

  public chequeFolhaGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public chequeFolhaErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public gerarHistorico(chequeFolha){

      this.chequeProprioComponent.chequeFolha = chequeFolha;
      this.showModal('modalAdicionar');
    
  }



}

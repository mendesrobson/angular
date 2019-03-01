import { Component, OnInit, Input } from '@angular/core';
import { Faturamento } from '../models/faturamento';
import { FaturamentoService } from '../faturamento.service';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

@Component({
  selector: 'app-lista-faturamento',
  templateUrl: './lista-faturamento.component.html',
  styleUrls: []
})
export class ListaFaturamentoComponent implements OnInit {
  
  @Input () dadosFiltro: any = null;

  public faturamentos: Faturamento[];

  swal: SweetAlertAdviceService;

  // public filterQuery = "";
  // public rowsOnPage = 10;
  // public sortBy = "nome";
  // public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];  

  constructor(public faturamentoService: FaturamentoService,
              private router: Router) {

                this.swal = new SweetAlertAdviceService();                

               }

  ngOnInit(): void {



    this.faturamentoService.obterFaturamentos(this.dadosFiltro)
    .subscribe(faturamentos => {
      this.faturamentos = faturamentos
      this.data = faturamentos
    },
    error => this.errors);


  }


  removerFaturamento(idfaturamento : any) {

    var valor : boolean;

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.onremoveFaturamento(idfaturamento);


      }

    });



   // alert("entrou");
    console.log(idfaturamento);
  }


  onremoveFaturamento(id : string) {

   this.faturamentoService.removerFaturamento(id)
    .subscribe( faturamento => { 

      this.faturamentoService.obterFaturamentos(this.dadosFiltro)
      .subscribe(faturamentos => {
        this.faturamentos = faturamentos
        this.data = faturamentos
   
      },
      error => this.errors);        



     },
   error => this.errors);

  

  }



}

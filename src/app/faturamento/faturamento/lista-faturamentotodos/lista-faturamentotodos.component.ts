import { Component, OnInit } from '@angular/core';
import { FaturamentoService } from '../faturamento.service';
import { Router } from '@angular/router';
import { Faturamento } from '../models/faturamento';

@Component({
  selector: 'app-lista-faturamentotodos',
  templateUrl: './lista-faturamentotodos.component.html',
  styleUrls: []
})
export class ListaFaturamentoTodosComponent implements OnInit {

  public faturamentos: Faturamento[];  

  public errors: any[] = [];
  public data: any[];    

  constructor(public faturamentoService: FaturamentoService,
    private router: Router) { }

  ngOnInit() {

    this.faturamentoService.obterTodosFaturamento()
    .subscribe(faturamentos => {
      this.faturamentos = faturamentos
      this.data = faturamentos
    },
    error => this.errors);    


  }

}

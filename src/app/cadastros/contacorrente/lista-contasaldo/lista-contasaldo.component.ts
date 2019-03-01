import { Component, OnInit } from '@angular/core';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router } from '@angular/router';
import { ContaCaixaBancoSaldo } from '../models/contacorrente';
import { ContaCorrenteComponent } from '../contacorrente.component';

@Component({
  selector: 'app-lista-contasaldo',
  templateUrl: './lista-contasaldo.component.html',
  styleUrls: []
})
export class ListaContaSaldoComponent implements OnInit {

  public contaCaixaBancoSaldo: ContaCaixaBancoSaldo[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public contaCorrenteService: ContaCorrenteService,
    private router: Router,
    private contaCorrenteComponent: ContaCorrenteComponent) {
      
  }

  ngOnInit(): void {
    this.contaCaixaBancoSaldo = this.contaCorrenteComponent.ContaCorrente.contaCaixaBancoSaldo; 
    
  }


}

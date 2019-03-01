import { Component, OnInit } from '@angular/core';
//import { PessoaService } from '../pessoa.service';
import { ActivatedRoute } from '@angular/router';
import { PessoaComponent } from '../pessoa.component';

@Component({
  selector: 'app-lista-pessoaempresa',
  templateUrl: './lista-pessoaempresa.component.html',
  styleUrls: []
})

export class ListaPessoaempresaComponent implements OnInit  {

  public pessoaId = 0;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(//public pessoaService: PessoaService,
    //private router: Router,
    private route: ActivatedRoute,
   // vcr: ViewContainerRef,
    private pessoaComponent: PessoaComponent) {
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    // console.log('entrou ngoninit');  
    // console.log(this.pessoaComponent.empresa);
    this.data = this.pessoaComponent.empresa;
  }
}
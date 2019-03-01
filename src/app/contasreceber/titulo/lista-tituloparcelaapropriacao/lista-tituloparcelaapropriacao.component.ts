import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { TituloComponent } from '../titulo.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-lista-tituloparcelaapropriacao',
  templateUrl: './lista-tituloparcelaapropriacao.component.html',
  styleUrls: []
})
export class ListaTituloparcelaapropriacaoComponent implements OnInit, AfterViewInit {

  @Input() ind: number = 0;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  public data1: any[];

  public tituloId = 0;

  constructor(
    private route: ActivatedRoute,
    private tituloComponent: TituloComponent
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];
 
    if (this.tituloComponent.Titulo.parcela.length > 0) {
      this.data = this.tituloComponent.Titulo.parcela[this.ind].apropriacaoCentro;
    }
    // this.data1 = this.tituloComponent.Titulo.parcela[this.ind].apropriacaoCentro.filter(a => a._CentroResultado != null);
  }

  ngAfterViewInit() {
    if (this.tituloComponent.Titulo.parcela.length > 0) {
      this.data = this.tituloComponent.Titulo.parcela[this.ind].apropriacaoCentro;
    }
    //   this.data1 = this.tituloComponent.Titulo.parcela[this.ind].apropriacaoCentro.filter(a => a._CentroResultado != null);    
  }

}

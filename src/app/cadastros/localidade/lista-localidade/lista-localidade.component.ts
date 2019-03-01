import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../utils/report.service';
import { LocalidadeService } from '../localidade.service';
import { Router } from '@angular/router';
import { Localidade } from './../models/localidade';

@Component({
  selector: 'app-lista-localidade',
  templateUrl: './lista-localidade.component.html',
  styleUrls: []
})
export class ListaLocalidadeComponent implements OnInit {
  public localidade: Localidade[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  
  public errors: any[] = [];
  public data: any[];

  constructor(public localidadeSevice: LocalidadeService,
      private report: ReportService,private router: Router) {}

  ngOnInit (): void {
      this.localidadeSevice.ObterTodosLocalidade()
      .subscribe(localidade => {
          this.localidade = localidade
          this.data = localidade}, 
       () => this.errors);
  }

  editarLocalidade(id) {
      this.router.navigate(['localidade/editar/' + id]);
  }

  cadastrarLocalidade() {
      this.router.navigate(['localidade/adicionar']);
  }  
  gerarExcel(model,id?) {
      this.report.gerarExcel(model, "Localidade",id);
  }
  gerarPDF(model: string) {
      this.report.pdfFile(model, "Localidade");
  }
}

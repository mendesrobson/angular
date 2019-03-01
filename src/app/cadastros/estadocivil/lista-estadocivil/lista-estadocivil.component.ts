import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../utils/report.service';
import { EstadoCivil } from './../models/estadocivil';
import { Router } from '@angular/router';
import { EstadocivilService } from '../estadocivil.service';

@Component({
  selector: 'app-lista-estadocivil',
  templateUrl: './lista-estadocivil.component.html',
  styleUrls: []
})
export class ListaEstadocivilComponent implements OnInit {
  public estadosCivil: EstadoCivil[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  
  public errors: any[] = [];
  public data: any[];

  constructor(public estadoCivilSevice: EstadocivilService,
      private report: ReportService,private router: Router) {}

  ngOnInit (): void {
      this.estadoCivilSevice.ObterTodosEstadoCivil()
      .subscribe(estadoCivil => {
          this.estadosCivil = estadoCivil
          this.data = estadoCivil}, 
       () => this.errors);
  }

  editarEstadoCivil(id) {
      this.router.navigate(['estadocivil/editar/' + id]);
  }

  cadastrarEstadoCivil() {
      this.router.navigate(['estadocivil/adicionar']);
  }  
  gerarExcel(model,id?) {
      this.report.gerarExcel(model, "Estado Civil",id);
  }
  gerarPDF(model: string) {
      this.report.pdfFile(model, "Estado Civil");
  }
}

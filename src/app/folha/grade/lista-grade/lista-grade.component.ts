import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Grade } from '../models/grade';
import { GradeService } from '../grade.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-lista-grade',
  templateUrl: './lista-grade.component.html',
  styleUrls: []
})
export class ListaGradeComponent implements OnInit {
  public grades: Grade[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";
  public errors: any[] = [];
  public data: any[];

  constructor(
    public gradeService: GradeService,
    private router: Router, private report: ReportService, private toastr: ToastsManager,
    vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit(): void {
    this.gradeService.ObterTodosGrade()
      .subscribe(grade => {
        this.grades = grade,
          this.data = grade;
      },
        () => this.errors);
  }

  editarGrade(id) {
    this.router.navigate(['grade/editar/' + id]);
  }

  cadastrarGrade() {
    this.router.navigate(['grade/adicionar']);
  }

    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Remessa",id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Remessa");
  }
}

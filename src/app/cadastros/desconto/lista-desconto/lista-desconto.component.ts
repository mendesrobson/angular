import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { DescontoService } from '../desconto.service';
import { Desconto } from '../models/desconto';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-desconto',
    templateUrl: './lista-desconto.component.html',
    styleUrls: []
})
export class ListaDescontoComponent implements OnInit {

    public desconto: Desconto[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public descontoService: DescontoService,
        private router: Router, private report: ReportService) { }

    ngOnInit(): void {
        this.descontoService.ObterTodosDesconto()
            .subscribe(descontos => {
                this.desconto = descontos
                this.data = descontos
            },
                () => this.errors);
    }

    editarDesconto(id) {
        this.router.navigate(['desconto/editar/' + id]);
    }

    cadastrarDesconto() {
        this.router.navigate(['desconto/adicionar']);
    }
      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Desconto",id);
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Desconto");
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoContratoService } from '../tipocontrato.service';
import { TipoContrato } from '../models/tipocontrato';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-tipocontrato',
    templateUrl: './lista-tipocontrato.component.html',
    styleUrls: ['./lista-tipocontrato.component.css']
})

export class ListaTipoContratoComponent implements OnInit {
    public tipocontratos: TipoContrato[];

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public tipoContratoService: TipoContratoService,
        private router: Router, private report: ReportService) {
    }

    ngOnInit(): void {
        this.tipoContratoService.obterTodosTipoContrato()
            .subscribe(tipocontratos => {
                this.tipocontratos = tipocontratos
                this.data = tipocontratos
            },
                () => this.errors);
    }

    editarTipoContrato(id) {
        this.router.navigate(['tipocontrato/editar/' + id]);
    }

    cadastrarTipoContrato() {
        this.router.navigate(['tipocontrato/adicionar']);
    }

      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Tipo de Contrato",id);
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Tipo de Contrato");
    }
}
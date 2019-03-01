import { Component, OnInit } from '@angular/core';
import { LeiauteArquivoBancario } from '../models/leiautearquivobancario';
import { LeiauteArquivoBancarioService } from '../leiautearquivobancario.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-leiautearquivobancario',
    templateUrl: './lista-leiautearquivobancario.component.html',
    styleUrls: []
})
export class ListaLeiauteArquivoBancarioComponent implements OnInit {

    public leiautesArquivoBancario: LeiauteArquivoBancario[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private report: ReportService,
        private router: Router) { }

    ngOnInit(): void {
        this.leiauteArquivoBancarioService.ObterTodosLeiauteArquivoBancario()
            .subscribe(leiautesArquivoBancario => {
                this.leiautesArquivoBancario = leiautesArquivoBancario
                this.data = leiautesArquivoBancario
            },
                () => this.errors);
    }

    editarLeiauteArquivoBancario(id) {
        this.router.navigate(['leiautearquivobancario/editar/' + id]);
    }

    cadastrarLeiauteArquivoBancario() {
        this.router.navigate(['leiautearquivobancario/adicionar']);
    }
      gerarExcel(model,id?)  {
        this.report.gerarExcel(model, "Layout p/ Arquivo Bancário",id);
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Layout p/ Arquivo Bancário");
    }
}

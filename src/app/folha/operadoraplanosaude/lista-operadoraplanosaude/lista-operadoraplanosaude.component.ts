import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OperadoraPlanoSaude } from '../models/operadoraplanosaude';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { OperadoraPlanoSaudeService } from './../operadoraplanosaude.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OperadoraplanosaudeComponent } from './../operadoraplanosaude.component';
import { ToastsManager } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-operadoraplanosaude',
    templateUrl: './lista-operadoraplanosaude.component.html',
    styleUrls: []
})
export class ListaOperadoraPlanoSaudeComponent implements OnInit {

    public operadoraplanosaudes: OperadoraPlanoSaude[];
    public operadoraplanosaudeId = 0;

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "descricao";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(
        public operadoraplanosaudeService: OperadoraPlanoSaudeService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private operadoraplanosaudeComponent: OperadoraplanosaudeComponent,
        private report: ReportService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
        this.operadoraplanosaudeService.obterTodosOperadoraPlanoSaude()
            .subscribe(operadoraplanosaude => {
                this.operadoraplanosaudes = operadoraplanosaude,
                    this.data = operadoraplanosaude;
            },
                () => this.errors);
    }

    editarOperadoraplanosaude(id) {
        this.router.navigate(['operadoraplanosaude/editar/' + id]);
    }

    cadastrarOperadoraplanosaude() {
        this.router.navigate(['operadoraplanosaude/adicionar']);
    }

    gerarExcel(model, id?) {
        if (!this.report.gerarExcel(model, "Operadora Plano Saúde", id)) {
            this.toastr.error("Não Possui Informações");
        }
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Operadora Plano Saúde");
    }

}

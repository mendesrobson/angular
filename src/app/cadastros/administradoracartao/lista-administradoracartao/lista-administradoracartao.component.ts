import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { Administradoracartao } from '../models/administradoracartao';
import { AdministradoracartaoComponent } from '../administradoracartao.component';
import { ReportService } from '../../../utils/report.service';

@Component({
    selector: 'app-lista-administradoracartao',
    templateUrl: './lista-administradoracartao.component.html',
    styleUrls: []
})
export class ListaAdministradoracartaoComponent implements OnInit {
    public administradoracartaos: Administradoracartao[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public administradoraCartaoService: AdministradoracartaoService,
        private administradoraCartaoComponent: AdministradoracartaoComponent,
        private report: ReportService,
        private router: Router) {
    }

    ngOnInit(): void {

        this.administradoraCartaoService.ObterTodosAdministradoraCartao()
            .subscribe(administradoracartaos => {
                this.administradoracartaos = administradoracartaos
                this.data = administradoracartaos
            },
                () => this.errors);
    }

    editarAdministradoraCartao(id) {
        this.router.navigate(['administradoracartao/editar/' + id]);
    }

    cadastrarAdministradoraCartao() {

        this.administradoraCartaoComponent.Administradoracartao = new Administradoracartao();
        this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco = new Array();
        this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato = new Array();

        this.router.navigate(['administradoracartao/adicionar']);
    }
    gerarExcel(model,id?) {
        this.report.gerarExcel(model, "Cadastro Administradora de Cartão",id);
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Cadastro Administradora de Cartão");
    }

}

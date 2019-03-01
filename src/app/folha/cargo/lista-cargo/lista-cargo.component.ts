import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CargoService } from '../cargo.service';
import { Cargo } from '../models/cargo';

import { Router } from '@angular/router';
import { DataFilterPipe } from '../../../utils/datafilter.pipe';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';


@Component({
    selector: 'app-lista-cargo',
    templateUrl: './lista-cargo.component.html',
    styleUrls: []
})

export class ListaCargoComponent implements OnInit {
    public cargos: Cargo[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];

    constructor(public cargoService: CargoService, private toastr: ToastsManager,
        vcr: ViewContainerRef, private router: Router, private report: ReportService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit(): void {
        this.cargoService.obterTodosCargo()
            .subscribe(cargo => {
                this.cargos = cargo,
                    this.data = cargo;
            },
                () => this.errors);
    }

    editarCargo(id) {
        this.router.navigate(['cargo/editar/' + id]);
    }

    cadastrarCargo() {
        this.router.navigate(['cargo/adicionar']);
    }

    gerarExcel(model, id?) {
        if (!this.report.gerarExcel(model, "Cargo", id))
            this.toastr.error("Não Possui Informações");
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Cargo");
    }
}

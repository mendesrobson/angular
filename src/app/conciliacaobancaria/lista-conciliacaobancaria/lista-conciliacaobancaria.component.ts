import { Component, OnInit } from '@angular/core';
import { MovimentoConta } from '../models/movimentoconta';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { ConciliacaoBancariaService } from '../conciliacaobancaria.service';
import { ReportService } from '../../utils/report.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { ConciliacaoBancariaComponent } from '../conciliacaobancaria.component';

@Component({
    selector: 'app-lista-conciliacaobancaria',
    templateUrl: './lista-conciliacaobancaria.component.html',
    styleUrls: []
})
export class ListaConciliacaoBancariaComponent implements OnInit {

    public movimentosConta: MovimentoConta[];
    public dataCompensacao: string;
    public conciliacaoBancariaForm: FormGroup;
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";

    public sub: Subscription;

    public errors: any[] = [];
    public data: any[];

    constructor(public conciliacaoBancariaService: ConciliacaoBancariaService, public conciliacaoBancariaComponent: ConciliacaoBancariaComponent,
        private router: Router, private report: ReportService, private _utilService: UtilService) {
    }

    ngOnInit(): void {

        this.conciliacaoBancariaForm = new FormGroup({
            dataCompensacao: new FormControl()
        });

        this.movimentosConta = new Array();
        this.data = new Array();

        this.conciliacaoBancariaService.obterTodosConciliacaoBancaria()
            .subscribe(movimentosConta => {
                this.movimentosConta = movimentosConta;
                this.conciliacaoBancariaComponent.MovimentoConta = movimentosConta;
            },
                error => this.errors);

    }

    editarConciliacaoBancaria(id) {
        this.router.navigate(['conciliacaobancaria/editar/' + id]);
    }

    gerarExcel(model, id?) {
        this.report.gerarExcel(model, "Conciliação Bancária", id);
    }

    gerarPDF(model: string) {
        this.report.pdfFile(model, "Conciliação Bancária");
    }

    registrarDataCompensacao(event) {
        if (this.dataCompensacao === null) return;

        for (var i = 0; i < this.movimentosConta.length; i++) {
            if (this.movimentosConta[i].id == event) {
                this.movimentosConta[i].dataCompensacao = new Date(this.dataCompensacao).toDateString();
                this.conciliacaoBancariaService.conciliacaoBancariaDataCompensacao(this.movimentosConta[i])
                    .subscribe((result) => {
                        if (result) {
                            for (var j = 0; j < this.conciliacaoBancariaComponent.MovimentoConta.length; j++){
                                if (this.conciliacaoBancariaComponent.MovimentoConta[j].id == event){
                                    this.conciliacaoBancariaComponent.MovimentoConta.splice(j, 1);
                                    break;
                                }
                            }  
                        }
                    });
                break;
            }
        }
    }
}
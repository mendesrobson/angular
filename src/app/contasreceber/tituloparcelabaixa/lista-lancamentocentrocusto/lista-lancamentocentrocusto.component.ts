import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';

import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Router, ActivatedRoute } from '@angular/router';
//import { ToastsManager } from 'ng2-toastr';
import { MovimentoContaCentro } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';


@Component({
    selector: 'app-lista-lancamentocentrocusto',
    templateUrl: './lista-lancamentocentrocusto.component.html'
})
export class ListaLancamentoCentroCustoComponent implements OnInit {
    @Input() permitirEditar: boolean;

    public movimentoContaCentro: MovimentoContaCentro;
    public movimentoContaCentros: MovimentoContaCentro[];

    public modalEditVisible: boolean;
    public modalAddVisible: boolean;

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "descricao";
    public sortOrder = "asc";

    public errors: any[] = [];
    public data: any[];
    swal: SweetAlertAdviceService;

    constructor(public tituloParcelaBaixaService: TituloParcelaBaixaService,
        private router: Router,
        private route: ActivatedRoute,
        //private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent) {

        //this.toastr.setRootViewContainerRef(vcr);
        this.swal = new SweetAlertAdviceService();
        this.modalAddVisible = false;
        this.modalEditVisible = false;
    }

    ngOnInit(): void {

        if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length > 0)
            this.data = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null);
    }

    atualizaStorage() {

        if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length > 0)
            this.data = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null);


    }

    editarCentroCusto(movimentoContaCentro) {
        this.tituloParcelaBaixaComponent.MovimentoContaCentro = movimentoContaCentro;
        console.log(this.tituloParcelaBaixaComponent.MovimentoContaCentro)
        this.modalEditVisible = true;
    }

    public centroCustoGravado(msg) {

        //this.toastr.success(msg, 'Sucesso', '');
    }

    public centroCustoErro(msg) {

        //this.toastr.error(msg, 'Falha', '');
    }

    inativarCentroCusto(movimentoContaCentro) {
        var self = this;
        this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
            if (isConfirmed) {
                self.removerMovimentoContaCentro(movimentoContaCentro);
            }
            else {
            }
        });
    }

    removerMovimentoContaCentro(movimentoContaCentro) {

        this.movimentoContaCentros = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro;

        for (var i = 0; i < this.movimentoContaCentros.length; i++) {
            if (movimentoContaCentro.id == this.movimentoContaCentros[i].id) {
                this.movimentoContaCentros.splice(i, 1);
            }
        }

        this.data = this.movimentoContaCentros;
        this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro = this.movimentoContaCentros;

        this.centroCustoGravado('Centro Custo, removido com sucesso!')
    }


}

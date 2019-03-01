import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';

import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Router, ActivatedRoute } from '@angular/router';
//import { ToastsManager } from 'ng2-toastr';
import { MovimentoContaCentro } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';


@Component({
    selector: 'app-lista-lancamentocentroresultado',
    templateUrl: './lista-lancamentocentroresultado.component.html'
})
export class ListaLancamentoCentroResultadoComponent implements OnInit {
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

       // this.toastr.setRootViewContainerRef(vcr);
        this.swal = new SweetAlertAdviceService();
        this.modalAddVisible = false;
        this.modalEditVisible = false;
    }

    ngOnInit(): void {

        if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length > 0)
            this.data = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null);
    }

    atualizaStorage() {

        if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length > 0)
            this.data = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null);


    }

    editarCentroResultado(movimentoContaCentro) {
        this.tituloParcelaBaixaComponent.MovimentoContaCentro = movimentoContaCentro;
        console.log(this.tituloParcelaBaixaComponent.MovimentoContaCentro)
        this.modalEditVisible = true;

    }

    public centroResultadoGravado(msg) {

       // this.toastr.success(msg, 'Sucesso', '');
    }

    public centroResultadoErro(msg) {

       // this.toastr.error(msg, 'Falha', '');
    }

    inativarCentroResultado(movimentoContaCentro) {
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

        this.centroResultadoGravado('Centro Resultado, removido com sucesso!')


    }
}
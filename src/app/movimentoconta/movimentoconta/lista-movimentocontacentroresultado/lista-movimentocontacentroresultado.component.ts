import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { MovimentoContaCentro } from '../models/movimentoconta';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MovimentoContaService } from '../movimentoconta.service';
import { Router, ActivatedRoute } from '@angular/router';
//import { ToastsManager } from 'ng2-toastr';
import { MovimentoContaComponent } from '../movimentoconta.component';

@Component({
    selector: 'app-lista-movimentocontacentroresultado',
    templateUrl: './lista-movimentocontacentroresultado.component.html'
})
export class ListaMovimentoContaCentroResultadoComponent implements OnInit {
    @Input() permitirEditar: boolean;

    public movimentoContaId = 0;

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

    constructor(public movimentoContaService: MovimentoContaService,
        private router: Router,
        private route: ActivatedRoute,
       // private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private movimentoContaComponent: MovimentoContaComponent) {

       // this.toastr.setRootViewContainerRef(vcr);
        this.swal = new SweetAlertAdviceService();
        this.modalAddVisible = false;
        this.modalEditVisible = false;
    }

    ngOnInit(): void {
        if (this.route.snapshot.params['id'] == undefined)
            this.movimentoContaId = 0
        else
            this.movimentoContaId = this.route.snapshot.params['id'];

        if (this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length > 0)
            this.data = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null);
    }

    atualizaStorage() {

        if (this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length > 0)
            this.data = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null);


    }

    editarCentroResultado(movimentoContaCentro) {
        this.movimentoContaComponent.MovimentoContaCentro = movimentoContaCentro;
        console.log(this.movimentoContaComponent.MovimentoContaCentro)
        this.modalEditVisible = true;

    }

    cadastrarCentroResultado() {
        this.router.navigate(['movimentoconta/adicionarCentroresultado']);
    }

    public centroResultadoGravado(msg) {

       // this.toastr.success(msg, 'Sucesso', '');
    }

    public centroResultadoErro(msg) {

        //this.toastr.error(msg, 'Falha', '');
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
        if (this.movimentoContaId > 0) {
            this.movimentoContaService.excluirMovimentoContaCentroId(movimentoContaCentro.id.toString())
                .subscribe(
                    result => {
                        this.movimentoContaCentros = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro;
                        for (var i = 0; i < this.movimentoContaCentros.length; i++) {
                            if (movimentoContaCentro.id == this.movimentoContaCentros[i].id) {
                                this.movimentoContaCentros.splice(i, 1);
                            }
                        }
                        this.data = this.movimentoContaCentros;
                        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = this.movimentoContaCentros;


                    },
                    error => {
                        this.errors;
                    })
        }
        else {
            this.movimentoContaCentros = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro;

            for (var i = 0; i < this.movimentoContaCentros.length; i++) {
                if (movimentoContaCentro.id == this.movimentoContaCentros[i].id) {
                    this.movimentoContaCentros.splice(i, 1);
                }
            }

            this.data = this.movimentoContaCentros;
            this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = this.movimentoContaCentros;

            this.centroResultadoGravado('Centro Resultado, removido com sucesso!')
        }

    }
}
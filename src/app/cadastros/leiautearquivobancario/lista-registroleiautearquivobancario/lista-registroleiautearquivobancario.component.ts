import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { RegLeiauteArquivoBancario } from "../models/leiautearquivobancario";
import { SweetAlertAdviceService } from "../../../services/sweetalert.advice.service";
import { LeiauteArquivoBancarioService } from "../leiautearquivobancario.service";
import { Router, ActivatedRoute } from "@angular/router";
//import { ToastsManager } from "ng2-toastr";
import { LeiauteArquivoBancarioComponent } from "../leiautearquivobancario.component";

@Component({
    selector: 'app-lista-registroleiautearquivobancario',
    templateUrl: './lista-registroleiautearquivobancario.component.html',
    styleUrls: []
})
export class ListaRegistroLeiauteArquivoBancarioComponent implements OnInit {
    public leiauteArquivoBancarioId = 0;

    public modalAddVisible: boolean = false;
    public modalEditVisible: boolean = false;

    public registroLeiauteArquivoBancario: RegLeiauteArquivoBancario[];

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "codigo";
    public sortOrder = "asc";

    swal: SweetAlertAdviceService;

    public errors: any[] = [];
    public data: any[];

    index: number = 0;

    constructor(public leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private router: Router,
        private route: ActivatedRoute,
        //private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent) {
       // this.toastr.setRootViewContainerRef(vcr);
        this.swal = new SweetAlertAdviceService();

    }

    ngOnInit(): void {
        if (this.route.snapshot.params['id'] == undefined)
            this.leiauteArquivoBancarioId = 0
        else
            this.leiauteArquivoBancarioId = this.route.snapshot.params['id'];

            this.data = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario;
    }

    atualizaStorage() {

        this.data = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario;
    }

    registroLeiauteGravado(msg) {
        //this.toastr.success(msg, 'Sucesso', '')
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    onChange_RegistroLeiaute(i): void {
        this.index = i;
    }

    editarRegistroLeiaute(regLeiauteArquivoBancario) {
        this.leiauteArquivoBancarioComponent.RegLeiauteArquivoBancario = regLeiauteArquivoBancario;
        this.modalEditVisible = true;
    }

    inativarRegistroLeiaute(regLeiauteArquivoBancario) {
        var self = this;
        this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
            if (isConfirmed) {
                self.removerRegistroLeiaute(regLeiauteArquivoBancario);
            }
            else {
            }
        });
    }

    removerRegistroLeiaute(regLeiauteArquivoBancario) {
        if (this.leiauteArquivoBancarioId > 0) {
            this.leiauteArquivoBancarioService.removerRegLeiauteArquivoBancario(regLeiauteArquivoBancario)
                .subscribe(
                    result => {
                        for (var i = 0; i < this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length; i++) {
                            if (regLeiauteArquivoBancario.id == this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[i].id) {
                                this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.splice(i, 1);
                            }
                        }

                        this.registroLeiauteGravado('Registro Leiaute removido')
                    },
                    error => {
                        this.errors;
                    });
        } else {
            for (var i = 0; i < this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length; i++) {
                if (regLeiauteArquivoBancario.id == this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[i].id) {
                    this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.splice(i, 1);
                }
            }
            this.registroLeiauteGravado('Registro Leiaute removido')
        }
    }




}
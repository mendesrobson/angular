import { Component, OnInit, Input, ViewContainerRef } from "@angular/core";
import { SweetAlertAdviceService } from "../../../services/sweetalert.advice.service";
import { LeiauteArquivoBancarioService } from "../leiautearquivobancario.service";
import { Router, ActivatedRoute } from "@angular/router";
//import { ToastsManager } from "ng2-toastr";
import { LeiauteArquivoBancarioComponent } from "../leiautearquivobancario.component";

@Component({
    selector: 'app-lista-itemregistroleiautearquivobancario',
    templateUrl: './lista-itemregistroleiautearquivobancario.component.html'
})
export class ListaItemRegistroLeiauteArquivoBancario implements OnInit {

    @Input() ind: number = 0;
    public leiauteRegistroArquivoBancarioId = 0;

    public modalEditVisible: boolean = false;
    public modalAddVisible: boolean = false;

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "posicaoInicial";
    public sortOrder = "asc";
  
    public errors: any[] = [];
    public data: any[];
    swal: SweetAlertAdviceService;

    constructor(public leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private router: Router,
        private route: ActivatedRoute,
        //private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent) {
    
        //this.toastr.setRootViewContainerRef(vcr);
        this.swal = new SweetAlertAdviceService();

      }    
    
    ngOnInit(): void {

        if (this.route.snapshot.params['id'] == undefined)
          this.leiauteRegistroArquivoBancarioId = 0
        else
          this.leiauteRegistroArquivoBancarioId = this.route.snapshot.params['id'];

          if (this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length > 0) {
              this.data = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario;

          }
          
     //   throw new Error("Method not implemented.");
    }

    editarItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario) {
        this.leiauteArquivoBancarioComponent.IteRegLeiauteArquivoBancario = iteRegLeiauteArquivoBancario;
        this.modalEditVisible = true;
    }

    public itemGravado(msg) {
        //this.toastr.success(msg, 'Sucesso', '');
    }

    public itemNaoGravado(msg) {
       // this.toastr.error(msg, 'Falha', '');
    }

    inativarItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario) {
        var self = this;
        this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
          if (isConfirmed) {
            self.removerItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario);
          }
          else {
          }
        });
    }

    removerItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario) {
        if(this.leiauteRegistroArquivoBancarioId > 0) {
            this.leiauteArquivoBancarioService.removerItemRegistroLeiauteArquivoBancario(iteRegLeiauteArquivoBancario)
            .subscribe(
                result => {
                    let itensRegistro = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario;

                    for (var i =0; i < itensRegistro.length; i++) {
                        if(iteRegLeiauteArquivoBancario.id == itensRegistro[i].id) {
                            itensRegistro.splice(i, 1);
                        }
                    }

                    this.data = itensRegistro;

                    this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario = itensRegistro;

                    this.itemGravado('Item removido com sucesso!');

                },
                error => {
                    this.onError(error);
                }
                
            )
            
        }
        else {
            let itensRegistro = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario;

            for (var i=0; i < itensRegistro.length; i++) {
                if (iteRegLeiauteArquivoBancario.id == itensRegistro[i].id) {
                    itensRegistro.splice(i, 1);
                }
            }

            this.data = itensRegistro;

            this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario = itensRegistro;

            this.itemGravado('Item removido com sucesso!');


        }
    }


    onError(error) {
        this.errors = JSON.parse(error._body).errors;
      }


}
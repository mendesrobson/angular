
import { Component, OnInit } from "@angular/core";
import { UtilService } from "../../../services/util.service";
import { RetornoPagamentoService } from "../retornopagamento.service";

@Component({
    selector: 'app-lerretornopagamento',
    templateUrl: './ler-retornopagamento.component.html',
    styleUrls: ['./ler-retornopagamento.component.css'],
})
export class LerRetornoPagamentoComponent implements OnInit {
    public nomeArquivo: string = "";

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
  
    public errors: any[] = [];
    public data: any[];
    index: number = 0;

    constructor(private _utilService: UtilService,
        private retornoPagamentoService: RetornoPagamentoService) {
    }

    ngOnInit(): void {
    }


    lerArquivo(event) {
        console.log("lerArquivo: event => "+event);
        this.nomeArquivo = event.srcElement.files[0].name;
        this._utilService.ConverterConteudoArquivoParaString(event, (result) => this.arquivoString(result));
    }

    arquivoString(result) {

        console.log("arquivoString: result => "+result);

        let registosFormatados = [];

        var linha : string = "";
        for(var i=0; i < result.length; i++){
           if (result[i] != "\n") {
               linha += result[i]
               
           } else {
               if (linha != "") {
                   registosFormatados.push(linha);
                   linha = "";
               }
           }
        }


        this.retornoPagamentoService.lerArquivoRetornoPagamento(registosFormatados)
            .subscribe(
                result => {
                   this.data = result;
                }, y => console.log("arquivoString: result => "+y)
            )
    }

    onChange_Parcela(i): void {
        this.index = i;
        console.log("arquivoString: result => "+this.index);
    }
}
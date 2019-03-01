import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ParcelaOcorrencias } from "./models/retornopagamento";
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RetornoPagamentoService {

  constructor(private httpClient: HttpClient) {  }

  lerArquivoRetornoPagamento(conteudoArquivo): Observable<ParcelaOcorrencias[]> {
    return this.httpClient.post<ParcelaOcorrencias[]>(environment.url_contas_receber + "/LeiauteArquivoBancario/LerArquivoRetornoPagamento", conteudoArquivo);
  }
}
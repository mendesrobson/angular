import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { Mascara } from '../cadastros/mascara/models/mascara';
import { Tarefa } from '../cadastros/tarefa/models/tarefa';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
    FormsModule,
        TextMaskModule
    ],
    declarations: []
})


@Injectable()
export class MaskService  {


    constructor(private httpClient: HttpClient) {  }

    private centroCustoNivel1;
    private centroCustoNivel2;
    private centroCustoNivel3;
    private centroCustoNivel4;
    private retorno;


    public mascara: Mascara;
    public tarefas: Tarefa[];


    public CodigoMaskNivel(guid, tarefa, mascaraPai) {

        let nivel = 0;

        let listMascaraFormatada = [];

        this.obterTarefaPorNome(guid, tarefa)
            .subscribe(tarefas => {
                this.obterMascaraPorTarefaId(tarefas[0].id.toString())
                    .subscribe(mascara => {
                        this.mascara = mascara;
                        var code = /\d/;

                        if (mascaraPai != null) {
                            if (mascaraPai.length > 0) {
                                for (let i = 0; mascaraPai.length > i; i++) {
                                    listMascaraFormatada.push(mascaraPai.substring(i, (i + 1)));
                                }
                                listMascaraFormatada.push(this.mascara.separadorNiveis);
                            }
                        }

                        let maskPai = mascaraPai.split(this.mascara.separadorNiveis);
                        let mask = this.mascara.mascaraFormatada.split(this.mascara.separadorNiveis);

                        for (let i = 0; mask.length > i; i++) {
                            if (mask[i] === this.mascara.prefixo) {
                                mask.splice(i, 1);
                            } else if (mask[i] === this.mascara.sufixo) {
                                mask.splice(i, 1);
                            }
                        }

                        if (mascaraPai == "") {
                            for (let y = 0; mask[0].length > y; y++) {
                                listMascaraFormatada.push(code);
                            }
                        } else {
                            for (let y = 0; mask[(maskPai.length)].length > y; y++) {
                                listMascaraFormatada.push(code);
                            }
                        }

                    });
            });
        return listMascaraFormatada;
    }


    public CodigoMask(guid, tarefa, empresaId) {

        let listMascaraFormatada = [];

        this.obterTarefaPorNome(guid, tarefa)
            .subscribe(tarefas => {
                this.obterMascaraPorEmpresaIdTarefaId(empresaId, tarefas[0].id.toString())
                    .subscribe(mascara => {
                        this.mascara = mascara;
                        
                        if(this.mascara != null){

                                var code = /\d/;

                                let mask = this.mascara.mascaraFormatada.split(this.mascara.separadorNiveis);

                                for (let i = 0; mask.length > i; i++) {
                                    if (mask[i] === this.mascara.prefixo) {
                                        mask.splice(i, 1);
                                    } else if (mask[i] === this.mascara.sufixo) {
                                        mask.splice(i, 1);
                                    }
                                }

                                if (this.mascara.prefixo != null) {
                                    if (this.mascara.prefixo.length > 0) {
                                        for (let i = 0; this.mascara.prefixo.length > i; i++) {
                                            listMascaraFormatada.push(this.mascara.prefixo.substring(i, (i + 1)));
                                        }
                                        listMascaraFormatada.push(this.mascara.separadorNiveis);
                                    }
                                }

                                for (let i = 0; mask.length > i; i++) {
                                    for (let y = 0; mask[i].length > y; y++) {
                                        listMascaraFormatada.push(code);
                                    }
                                    if (i < (mask.length - 1)) {
                                        listMascaraFormatada.push(this.mascara.separadorNiveis);
                                    }
                                }
                                if (this.mascara.sufixo != null) {
                                    if (this.mascara.sufixo.length > 0) {
                                        listMascaraFormatada.push(this.mascara.separadorNiveis);
                                        for (let i = 0; this.mascara.sufixo.length > i; i++) {
                                            listMascaraFormatada.push(this.mascara.sufixo.substring(i, (i + 1)));
                                        }
                                    }
                                }
                        }
                    });
            });

        return listMascaraFormatada;
    }

    public CodigoMaskGrupo(mascara: Mascara){
        
        let listMascaraFormatada = [];

        var code = /\d/;

        let mask = mascara.mascaraFormatada.split(mascara.separadorNiveis);

        for (let i = 0; mask.length > i; i++) {
            if (mask[i] === mascara.prefixo) {
                mask.splice(i, 1);
            } else if (mask[i] === mascara.sufixo) {
                mask.splice(i, 1);
            }
        }

        if (mascara.prefixo != null) {
            if (mascara.prefixo.length > 0) {
                for (let i = 0; mascara.prefixo.length > i; i++) {
                    listMascaraFormatada.push(mascara.prefixo.substring(i, (i + 1)));
                }
                listMascaraFormatada.push(mascara.separadorNiveis);
            }
        }

        for (let i = 0; mask.length > i; i++) {
            for (let y = 0; mask[i].length > y; y++) {
                listMascaraFormatada.push(code);
            }
            if (i < (mask.length - 1)) {
                listMascaraFormatada.push(mascara.separadorNiveis);
            }
        }
        if (mascara.sufixo != null) {
            if (mascara.sufixo.length > 0) {
                listMascaraFormatada.push(mascara.separadorNiveis);
                for (let i = 0; mascara.sufixo.length > i; i++) {
                    listMascaraFormatada.push(mascara.sufixo.substring(i, (i + 1)));
                }
            }
        }

        return listMascaraFormatada;
    
    }

    async VerificaCodSequencialGrupoEmpresa(guid, tarefa, grupoEmpresaId, empresaId): Promise<Mascara>{
        
        this.tarefas = await this.obterTarefaPorNome(guid, tarefa).toPromise();

        if(this.tarefas.length < 1)
        return null;

        this.mascara = await this.obterMascaraPorTarefaIdGrupoEmpresaIdEmpresaId(this.tarefas[0].id.toString(), grupoEmpresaId, empresaId).toPromise();
        return this.mascara;
    }

    async VerificaCodSequencialGrupo(guid, tarefa, grupoEmpresaId): Promise<Mascara>{
        
        this.tarefas = await this.obterTarefaPorNome(guid, tarefa).toPromise();
        
        if(this.tarefas.length < 1)
        return null;

        this.mascara = await this.obterMascaraPorTarefaIdGrupoEmpresaId(this.tarefas[0].id.toString(), grupoEmpresaId).toPromise();
        return this.mascara;
    }

    private cep = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]

    public Cep() {
        return this.cep;
    }

    private cnae = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, '/', /\d/, /\d/]

    public Cnae() {
        return this.cnae;
    }

    private telefone = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

    public Telefone() {
        return this.telefone;
    }

    private celular = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

    public Celular() {
        return this.celular;
    }

    private cpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]

    public Cpf() {
        return this.cpf;
    }

    public cpfPattern = "^[0-9]+.[0-9]+.[0-9]+-[0-9]{2,11}$"

    public cnpjPattern = "^[0-9]+.[0-9]+.[0-9]+/[0-9]+-[0-9]{2,14}$"

    public competenciaPattern = "^[0-9]+/[0-9]{2,6}$"

    private rg = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/]

    public Rg() {
        return this.rg;
    }

    private cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]

    public Cnpj() {
        return this.cnpj;
    }

    private mesAno = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]

    public MesAno() {
        return this.mesAno;
    }

    private numCartao = [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]

    public NumCartao() {
        return this.numCartao;
    }

    obterTarefaPorNome(id, tarefa: string): Observable<Tarefa[]> {
        return this.httpClient.get<Tarefa[]>(environment.url_contas_receber + "/Mascara/ObterTarefaPorNome/" + id + "&" + tarefa);
    };

    obterMascaraPorTarefaId(id: string): Observable<Mascara> {
        return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorTarefaId/" + id);
    };

    obterMascaraPorEmpresaIdTarefaId(empresaId: string, tarefaId: string): Observable<Mascara> {
        return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorEmpresaIdTarefaId/" + empresaId + "&" + tarefaId);
    };

    obterMascaraPorTarefaIdGrupoEmpresaIdEmpresaId(tarefaId: string, grupoEmpresaId: string, empresaId: string): Observable<Mascara> {
        return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorTarefaIdGrupoEmpresaIdEmpresaId/" + tarefaId + "&" + grupoEmpresaId + "&" + empresaId);
    };

    obterMascaraPorTarefaIdGrupoEmpresaId(tarefaId: string, grupoEmpresaId: string): Observable<Mascara>{
        return this.httpClient.get<Mascara>(environment.url_contas_receber + "/Mascara/ObterMascaraPorTarefaIdGrupoEmpresaId/" + tarefaId + "&" + grupoEmpresaId);
    }

    RecuperarCodigoSequencial(mascaraNivelId: number): Observable<string>{
        return this.httpClient.get<string>(environment.url_codigosequencial + "/CodigoSequencial/GerarCodigoSequencial/" + mascaraNivelId);
    }

    async GerarCodigoSequencial(mascara: Mascara, nivel: number) : Promise<string>{

        let codigo: string = await this.RecuperarCodigoSequencial(mascara.mascaraNivel[nivel - 1].id).toPromise();
        let codidoPronto: string = '';

        if(mascara.prefixo != undefined)
            if(mascara.prefixo != null)
                if(mascara.prefixo != '')
                    codidoPronto = mascara.prefixo + mascara.separadorNiveis;
       
        if(mascara.mascaraNivel.length > 1)
        {
            for(let i = 0; i < mascara.mascaraNivel.length; i++)
            {
                if(i + 1 == nivel)
                {   
                    while(mascara.mascaraNivel[i].quantidadeNivel > codigo.toString().length)
                    {
                        codigo = '0' + codigo;
                    } 
                    
                    codidoPronto = codidoPronto + codigo;
                }   
                else
                {
                    let y = 0;
                    while(mascara.mascaraNivel[i].quantidadeNivel > (mascara.mascaraNivel[i].sequencia.toString().length + y))
                    {
                        codidoPronto = codidoPronto + '0';
                        y++;
                    } 
                    
                    codidoPronto = codidoPronto + mascara.mascaraNivel[i].sequencia.toString();
                    
                }   

                if(i + 1 < mascara.mascaraNivel.length)
                    codidoPronto = codidoPronto + mascara.separadorNiveis;
            }
        }
        else
        {
            while(mascara.mascaraNivel[0].quantidadeNivel > codigo.toString().length)
            {
                codigo = '0' + codigo;
            }

            codidoPronto = codidoPronto + codigo;
        }

        if(mascara.sufixo != undefined)
            if(mascara.sufixo != null)
                if(mascara.sufixo != '')
                    codidoPronto = codidoPronto + mascara.separadorNiveis + mascara.sufixo;

        return codidoPronto;
        
    }
}
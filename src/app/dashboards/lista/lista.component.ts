import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent {

  http = undefined;
    loading = true;

    convet: number;

    ciclo: 0;
    nomeCiclo: any = "Educação Infantil";

    mediaPessoal: any;
    mediaMateriais: any;
    mediaGerais: any;
    mediaIndiretos: any;
    mediaRateioDepartamento: any;

    vagas: number = 249;
    bolsistas: number = 40;
    pagantes: number = 209;

    imposto: number = 0;
    margemLucro: number = 0;
    parcelas: number = 12;
    percentualMercado: number = 0;

    valorAnuidade: any = 0;
    media: any = 0;
    valorMensalidadeParcela: any;
    valorMensalidadeAtual: any = 0;
    valorMensalidadeComReajusteMercado: any;

    resultsPessoalInfantil;
    resultsPessoalFundI;
    resultsPessoalFundII;
    resultsPessoalMedio;
    resultsReceitasInfantil;
    resultsReceitasFundI;
    resultsReceitasFundII;
    resultsReceitasMedio;
    resultsMateriaisInfantil;
    resultsMateriaisFundI;
    resultsMateriaisFundII;
    resultsMateriaisMedio;
    resultsIndiretosInfantil;
    resultsIndiretosFundI;
    resultsIndiretosFundII;
    resultsIndiretosMedio;
    resultsGeraisInfantil;
    resultsGeraisFundI;
    resultsGeraisFundII;
    resultsGeraisMedio;
    resultsRateioDepartamentoInfantil;
    resultsRateioDepartamentoFundI;
    resultsRateioDepartamentoFundII;
    resultsRateioDepartamentoMedio;

    resultsTotalCustoDespesaInfantil;
    resultsTotalCustoDespesaFundI;
    resultsTotalCustoDespesaFundII;
    resultsTotalCustoDespesaMedio;

    resultsTotalReceitas;
    resultsTotalPessoal;
    resultsTotalMateriais;
    resultsTotalIndiretos;
    resultsTotalGerais;
    resultsTotalRateioDespesas;

    receitas: [{ centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any }];
    totalReceitas: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };
    pessoal: [{ centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any }];
    totalPessoal: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };
    materiais: [{ centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any }];
    totalMateriais: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };
    gerais: [{ centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any }];
    totalGerais: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };
    indiretos: [{ centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any }];
    totalIndiretos: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };
    rateioDepartamento: [{ centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any }];
    totalRateioDepartamento: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };
    totalCustosDespesas: { centro: '', jan: any, fev: any, mar: any, abr: any, mai: any, jun: any, jul: any, ago: any, set: any, out: any, nov: any, dez: any };

    reajuste: number;
    indice: number = 0;
    mes: number = 1;

    reajustePessoal: number;
    indicePessoal: number = 0;
    mesPessoal: number = 1;

    pieChartData: any;

    constructor(httpClient: HttpClient) {
        this.http = httpClient;
        this.loading = false;
    }

    ngOnInit() {
        this.getInfantil();
        this.getTotalInfantil();
        this.calculaProjecao();
        this.calculaReajuste(0);
        this.buscarValores(this.ciclo);
        this.getChart();
    }

    calcularMediaGrafico(ciclo) {

        if (ciclo == 0) {
            this.getTotalInfantil();
        } else if (ciclo == 1) {
            this.getTotalFundI();
        } else if (ciclo == 2) {
            this.getTotalFundII();
        } else if (ciclo == 3) {
            this.getTotalMedio();
        }

        this.calculaReajusteSemMoeda(ciclo);

        this.mediaPessoal = parseFloat(((this.totalPessoal[0].jan +
            this.totalPessoal[0].fev +
            this.totalPessoal[0].mar +
            this.totalPessoal[0].abr +
            this.totalPessoal[0].mai +
            this.totalPessoal[0].jun +
            this.totalPessoal[0].jul +
            this.totalPessoal[0].ago +
            this.totalPessoal[0].set +
            this.totalPessoal[0].out +
            this.totalPessoal[0].nov +
            this.totalPessoal[0].dez) / 12).toFixed(2));

        this.mediaMateriais = parseFloat(((this.totalMateriais[0].jan +
            this.totalMateriais[0].fev +
            this.totalMateriais[0].mar +
            this.totalMateriais[0].abr +
            this.totalMateriais[0].mai +
            this.totalMateriais[0].jun +
            this.totalMateriais[0].jul +
            this.totalMateriais[0].ago +
            this.totalMateriais[0].set +
            this.totalMateriais[0].out +
            this.totalMateriais[0].nov +
            this.totalMateriais[0].dez) / 12).toFixed(2));

        this.mediaGerais = parseFloat(((this.totalGerais[0].jan +
            this.totalGerais[0].fev +
            this.totalGerais[0].mar +
            this.totalGerais[0].abr +
            this.totalGerais[0].mai +
            this.totalGerais[0].jun +
            this.totalGerais[0].jul +
            this.totalGerais[0].ago +
            this.totalGerais[0].set +
            this.totalGerais[0].out +
            this.totalGerais[0].nov +
            this.totalGerais[0].dez) / 12).toFixed(2));

        this.mediaIndiretos = parseFloat(((this.totalIndiretos[0].jan +
            this.totalIndiretos[0].fev +
            this.totalIndiretos[0].mar +
            this.totalIndiretos[0].abr +
            this.totalIndiretos[0].mai +
            this.totalIndiretos[0].jun +
            this.totalIndiretos[0].jul +
            this.totalIndiretos[0].ago +
            this.totalIndiretos[0].set +
            this.totalIndiretos[0].out +
            this.totalIndiretos[0].nov +
            this.totalIndiretos[0].dez) / 12).toFixed(2));

        this.mediaRateioDepartamento = parseFloat(((this.totalRateioDepartamento[0].jan +
            this.totalRateioDepartamento[0].fev +
            this.totalRateioDepartamento[0].mar +
            this.totalRateioDepartamento[0].abr +
            this.totalRateioDepartamento[0].mai +
            this.totalRateioDepartamento[0].jun +
            this.totalRateioDepartamento[0].jul +
            this.totalRateioDepartamento[0].ago +
            this.totalRateioDepartamento[0].set +
            this.totalRateioDepartamento[0].out +
            this.totalRateioDepartamento[0].nov +
            this.totalRateioDepartamento[0].dez) / 12).toFixed(2));

        this.getChart();

        this.calculaReajuste(ciclo);

    }

    getChart() {
        this.pieChartData = {
            chartType: 'PieChart',
            dataTable: [
                [' ', 'Porcentagem'],
                ['Pessoal', this.mediaPessoal],
                ['Materiais', this.mediaMateriais],
                ['Gerais', this.mediaGerais],
                ['Indiretos', this.mediaIndiretos],
                ['Rateio Departamentos', this.mediaRateioDepartamento]
            ],
            options: {
                'title': '',
                'width': 320,
                'height': 320,
                pieHole: 0.5,
                legend: { position: 'none' },
                chartArea: { left: 0, top: 0, width: '90%', height: '95%' }
            },
        };
    }

    calcularPagantes() {
        this.pagantes = this.vagas - this.bolsistas;
        this.calculaProjecao();
    }

    calcularMensalidade() {
        this.valorMensalidadeParcela = parseFloat((this.valorAnuidade / this.parcelas).toFixed(2));

        this.valorAnuidade = (this.valorAnuidade).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.valorMensalidadeParcela = (this.valorMensalidadeParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.valorMensalidadeAtual = (this.valorMensalidadeAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.valorMensalidadeComReajusteMercado = (this.valorMensalidadeComReajusteMercado).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

    }

    calcularAnuidade() {

        this.calcularTotalCustoDespesa(this.ciclo);

        this.valorAnuidade = 0;
        this.media = 0;
        this.valorMensalidadeParcela = 0;
        this.valorMensalidadeComReajusteMercado = 0;


        this.media = parseFloat(((this.totalCustosDespesas[0].jan +
            this.totalCustosDespesas[0].fev +
            this.totalCustosDespesas[0].mar +
            this.totalCustosDespesas[0].abr +
            this.totalCustosDespesas[0].mai +
            this.totalCustosDespesas[0].jun +
            this.totalCustosDespesas[0].jul +
            this.totalCustosDespesas[0].ago +
            this.totalCustosDespesas[0].set +
            this.totalCustosDespesas[0].out +
            this.totalCustosDespesas[0].nov +
            this.totalCustosDespesas[0].dez) / 12).toFixed(2));

        this.valorAnuidade = parseFloat((((this.media / this.pagantes) / (1 - ((this.imposto * 0.01) + (this.margemLucro * 0.01)))) * 12).toFixed(2));

        //converter para moeda
        this.totalCustosDespesas[0].jan = (this.totalCustosDespesas[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].fev = (this.totalCustosDespesas[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].mar = (this.totalCustosDespesas[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].abr = (this.totalCustosDespesas[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].mai = (this.totalCustosDespesas[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].jun = (this.totalCustosDespesas[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].jul = (this.totalCustosDespesas[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].ago = (this.totalCustosDespesas[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].set = (this.totalCustosDespesas[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].out = (this.totalCustosDespesas[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].nov = (this.totalCustosDespesas[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.totalCustosDespesas[0].dez = (this.totalCustosDespesas[0].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        this.media = (this.media).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

    }

    calculaProjecao() {
        this.calcularAnuidade();
        this.calcularMensalidade();
    }

    calcularReajusteMercado() {

        if (this.ciclo == 0) {
            this.valorMensalidadeAtual = 1761.50;
        } else if (this.ciclo == 1) {
            this.valorMensalidadeAtual = 1112.75;
        } else if (this.ciclo == 2) {
            this.valorMensalidadeAtual = 1210.05;
        } else if (this.ciclo == 3) {
            this.valorMensalidadeAtual = 1280.05;
        }
        this.valorMensalidadeComReajusteMercado = 0;

        this.valorMensalidadeComReajusteMercado = parseFloat((this.valorMensalidadeAtual * ((this.percentualMercado * 0.01) + 1)).toFixed(2));

        this.valorMensalidadeAtual = (this.valorMensalidadeAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.valorMensalidadeComReajusteMercado = (this.valorMensalidadeComReajusteMercado).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
    }

    calcularTotalCustoDespesa(ciclo) {

        this.totalCustosDespesas = { centro: '', jan: 0, fev: 0, mar: 0, abr: 0, mai: 0, jun: 0, jul: 0, ago: 0, set: 0, out: 0, nov: 0, dez: 0 };

        if (ciclo == 0) {
            this.getTotalCustosDespesasInfantil();
        } else if (ciclo == 1) {
            this.getTotalCustoDespesasFundI();
        } else if (ciclo == 2) {
            this.getTotalCustoDespesasFundII();
        } else if (ciclo == 3) {
            this.getTotalCustosDespesasMedio();
        }

        if (this.mes == 1) {

            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }

        } else if (this.mes == 2) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * (this.reajustePessoal)).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }

        } else if (this.mes == 3) {

            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }



        } else if (this.mes == 4) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }



        } else if (this.mes == 5) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }




        } else if (this.mes == 6) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }

        } else if (this.mes == 7) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }



        } else if (this.mes == 8) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }

        } else if (this.mes == 9) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }

        } else if (this.mes == 10) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].ju).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].ju).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].ju).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].ju).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].ju).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }
  
        } else if (this.mes == 11) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajuste).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }

        } else if (this.mes == 12) {
            if (this.mesPessoal == 1) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 2) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 3) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 4) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 5) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 6) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 7) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 8) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 9) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 10) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 11) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov * this.reajustePessoal).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            } else if (this.mesPessoal == 12) {
                this.totalCustosDespesas[0].jan = parseFloat((this.totalCustosDespesas[0].jan).toFixed(2));
                this.totalCustosDespesas[0].fev = parseFloat((this.totalCustosDespesas[0].fev).toFixed(2));
                this.totalCustosDespesas[0].mar = parseFloat((this.totalCustosDespesas[0].mar).toFixed(2));
                this.totalCustosDespesas[0].abr = parseFloat((this.totalCustosDespesas[0].abr).toFixed(2));
                this.totalCustosDespesas[0].mai = parseFloat((this.totalCustosDespesas[0].mai).toFixed(2));
                this.totalCustosDespesas[0].jun = parseFloat((this.totalCustosDespesas[0].jun).toFixed(2));
                this.totalCustosDespesas[0].jul = parseFloat((this.totalCustosDespesas[0].jul).toFixed(2));
                this.totalCustosDespesas[0].ago = parseFloat((this.totalCustosDespesas[0].ago).toFixed(2));
                this.totalCustosDespesas[0].set = parseFloat((this.totalCustosDespesas[0].set).toFixed(2));
                this.totalCustosDespesas[0].out = parseFloat((this.totalCustosDespesas[0].out).toFixed(2));
                this.totalCustosDespesas[0].nov = parseFloat((this.totalCustosDespesas[0].nov).toFixed(2));
                this.totalCustosDespesas[0].dez = parseFloat((this.totalCustosDespesas[0].dez * (this.reajuste + this.reajustePessoal - 1)).toFixed(2));
            }
        }
    }

    calculaReajuste(ciclo) {
        this.reajuste = (this.indice * 0.01) + 1;
        this.reajustePessoal = (this.indicePessoal * 0.01) + 1;

        if (ciclo == 0) {
            this.getInfantil();
            this.getTotalInfantil();
            this.getTotalCustosDespesasInfantil();
        } else if (ciclo == 1) {
            this.getFundI();
            this.getTotalFundI();
            this.getTotalCustoDespesasFundI();
        } else if (ciclo == 2) {
            this.getFundII();
            this.getTotalFundII();
            this.getTotalCustoDespesasFundII();
        } else if (ciclo == 3) {
            this.getMedio();
            this.getTotalMedio();
            this.getTotalCustosDespesasMedio();
        }

        for (var i = 0; i < this.pessoal.length; i++) {
            if (this.mesPessoal == 1) {
                this.pessoal[i].jan = (parseFloat((this.pessoal[i].jan * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (parseFloat((this.pessoal[i].fev * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (parseFloat((this.pessoal[i].mar * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mesPessoal == 2) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (parseFloat((this.pessoal[i].fev * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (parseFloat((this.pessoal[i].mar * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mesPessoal == 3) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (parseFloat((this.pessoal[i].mar * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mesPessoal == 4) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 5) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 6) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 7) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 8) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (this.pessoal[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 9) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (this.pessoal[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (this.pessoal[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 10) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (this.pessoal[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (this.pessoal[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (this.pessoal[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 11) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (this.pessoal[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (this.pessoal[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (this.pessoal[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (this.pessoal[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mesPessoal == 12) {
                this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].jul = (this.pessoal[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].ago = (this.pessoal[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].set = (this.pessoal[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].out = (this.pessoal[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].nov = (this.pessoal[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.pessoal[i].dez = (parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            }
        }

        for (var i = 0; i < this.materiais.length; i++) {
            if (this.mes == 1) {

                this.materiais[i].jan = (parseFloat((this.materiais[i].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (parseFloat((this.materiais[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (parseFloat((this.materiais[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 2) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (parseFloat((this.materiais[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (parseFloat((this.materiais[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 3) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (parseFloat((this.materiais[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 4) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 5) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 6) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 7) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 8) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (this.materiais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 9) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (this.materiais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (this.materiais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (parseFloat((this.materiais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 10) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (this.materiais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (this.materiais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (this.materiais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (parseFloat((this.materiais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 11) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (this.materiais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (this.materiais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (this.materiais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (this.materiais[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 12) {
                this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].jul = (this.materiais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].ago = (this.materiais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].set = (this.materiais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].out = (this.materiais[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].nov = (this.materiais[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.materiais[i].dez = (parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            }
        }

        for (var i = 0; i < this.indiretos.length; i++) {
            if (this.mes == 1) {
                this.indiretos[i].jan = (parseFloat((this.indiretos[i].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (parseFloat((this.indiretos[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (parseFloat((this.indiretos[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 2) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (parseFloat((this.indiretos[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (parseFloat((this.indiretos[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 3) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (parseFloat((this.indiretos[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 4) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 5) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 6) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 7) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 8) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (this.indiretos[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 9) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (this.indiretos[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (this.indiretos[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 10) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (this.indiretos[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (this.indiretos[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (this.indiretos[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 11) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (this.indiretos[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (this.indiretos[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (this.indiretos[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (this.indiretos[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 12) {
                this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].jul = (this.indiretos[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].ago = (this.indiretos[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].set = (this.indiretos[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].out = (this.indiretos[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].nov = (this.indiretos[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.indiretos[i].dez = (parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            }
        }

        for (var i = 0; i < this.rateioDepartamento.length; i++) {
            if (this.mes == 1) {
                this.rateioDepartamento[i].jan = (parseFloat((this.rateioDepartamento[i].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (parseFloat((this.rateioDepartamento[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (parseFloat((this.rateioDepartamento[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mes == 2) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (parseFloat((this.rateioDepartamento[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (parseFloat((this.rateioDepartamento[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mes == 3) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (parseFloat((this.rateioDepartamento[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mes == 4) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 5) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 6) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 7) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 8) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (this.rateioDepartamento[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 9) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (this.rateioDepartamento[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (this.rateioDepartamento[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 10) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (this.rateioDepartamento[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (this.rateioDepartamento[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (this.rateioDepartamento[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 11) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (this.rateioDepartamento[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (this.rateioDepartamento[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (this.rateioDepartamento[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (this.rateioDepartamento[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 12) {
                this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].jul = (this.rateioDepartamento[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].ago = (this.rateioDepartamento[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].set = (this.rateioDepartamento[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].out = (this.rateioDepartamento[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].nov = (this.rateioDepartamento[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.rateioDepartamento[i].dez = (parseFloat((this.pessoal[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            }
        }

        for (var i = 0; i < this.gerais.length; i++) {
            if (this.mes == 1) {
                this.gerais[i].jan = (parseFloat((this.gerais[i].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (parseFloat((this.gerais[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (parseFloat((this.gerais[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mes == 2) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (parseFloat((this.gerais[i].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (parseFloat((this.gerais[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mes == 3) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (parseFloat((this.gerais[i].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


            } else if (this.mes == 4) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 5) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 6) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 7) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 8) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (this.gerais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 9) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (this.gerais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (this.gerais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (parseFloat((this.gerais[i].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 10) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (this.gerais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (this.gerais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (this.gerais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (parseFloat((this.gerais[i].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 11) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (this.gerais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (this.gerais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (this.gerais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (this.gerais[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            } else if (this.mes == 12) {
                this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].jul = (this.gerais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].ago = (this.gerais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].set = (this.gerais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].out = (this.gerais[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].nov = (this.gerais[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
                this.gerais[i].dez = (parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

            }
        }

        //Receitas
        //converter para moeda
        this.receitas[0].jan = (this.receitas[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].fev = (this.receitas[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].mar = (this.receitas[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].abr = (this.receitas[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].mai = (this.receitas[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].jun = (this.receitas[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].jul = (this.receitas[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].ago = (this.receitas[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].set = (this.receitas[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].out = (this.receitas[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].nov = (this.receitas[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[0].dez = (this.receitas[0].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].jan = (this.receitas[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].fev = (this.receitas[1].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].mar = (this.receitas[1].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].abr = (this.receitas[1].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].mai = (this.receitas[1].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].jun = (this.receitas[1].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].jul = (this.receitas[1].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].ago = (this.receitas[1].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].set = (this.receitas[1].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].out = (this.receitas[1].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].nov = (this.receitas[1].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.receitas[1].dez = (this.receitas[1].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].jan = (this.resultsTotalReceitas[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].fev = (this.resultsTotalReceitas[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].mar = (this.resultsTotalReceitas[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].abr = (this.resultsTotalReceitas[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].mai = (this.resultsTotalReceitas[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].jun = (this.resultsTotalReceitas[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].jul = (this.resultsTotalReceitas[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].ago = (this.resultsTotalReceitas[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].set = (this.resultsTotalReceitas[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].out = (this.resultsTotalReceitas[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].nov = (this.resultsTotalReceitas[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        this.resultsTotalReceitas[0].dez = (this.resultsTotalReceitas[0].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


        //Total Pessoal
        if (this.mesPessoal == 1) {
            this.totalPessoal[0].jan = (parseFloat((this.totalPessoal[0].jan * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (parseFloat((this.totalPessoal[0].fev * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (parseFloat((this.totalPessoal[0].mar * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mesPessoal == 2) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (parseFloat((this.totalPessoal[0].fev * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (parseFloat((this.totalPessoal[0].mar * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


        } else if (this.mesPessoal == 3) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (parseFloat((this.totalPessoal[0].mar * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mesPessoal == 4) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 5) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 6) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 7) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (this.totalPessoal[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 8) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (this.totalPessoal[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (this.totalPessoal[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 9) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (this.totalPessoal[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (this.totalPessoal[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (this.totalPessoal[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 10) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (this.totalPessoal[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (this.totalPessoal[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (this.totalPessoal[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (this.totalPessoal[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 11) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (this.totalPessoal[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (this.totalPessoal[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (this.totalPessoal[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (this.totalPessoal[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (this.totalPessoal[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mesPessoal == 12) {
            this.totalPessoal[0].jan = (this.totalPessoal[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].fev = (this.totalPessoal[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mar = (this.totalPessoal[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].abr = (this.totalPessoal[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].mai = (this.totalPessoal[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jun = (this.totalPessoal[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].jul = (this.totalPessoal[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].ago = (this.totalPessoal[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].set = (this.totalPessoal[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].out = (this.totalPessoal[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].nov = (this.totalPessoal[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalPessoal[0].dez = (parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

        //Total Materiais
        if (this.mes == 1) {
            this.totalMateriais[0].jan = (parseFloat((this.totalMateriais[0].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (parseFloat((this.totalMateriais[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (parseFloat((this.totalMateriais[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 2) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (parseFloat((this.totalMateriais[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (parseFloat((this.totalMateriais[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 3) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (parseFloat((this.totalMateriais[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 4) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 5) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 6) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 7) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (this.totalMateriais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 8) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (this.totalMateriais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (this.totalMateriais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 9) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (this.totalMateriais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (this.totalMateriais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (this.totalMateriais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 10) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (this.totalMateriais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (this.totalMateriais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (this.totalMateriais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (this.totalMateriais[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 11) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (this.totalMateriais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (this.totalMateriais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (this.totalMateriais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (this.totalMateriais[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (this.totalMateriais[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 12) {
            this.totalMateriais[0].jan = (this.totalMateriais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].fev = (this.totalMateriais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mar = (this.totalMateriais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].abr = (this.totalMateriais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].mai = (this.totalMateriais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jun = (this.totalMateriais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].jul = (this.totalMateriais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].ago = (this.totalMateriais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].set = (this.totalMateriais[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].out = (this.totalMateriais[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].nov = (this.totalMateriais[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalMateriais[0].dez = (parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

        //Total Indiretos
        if (this.mes == 1) {
            this.totalIndiretos[0].jan = (parseFloat((this.totalIndiretos[0].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (parseFloat((this.totalIndiretos[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (parseFloat((this.totalIndiretos[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 2) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (parseFloat((this.totalIndiretos[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (parseFloat((this.totalIndiretos[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 3) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (parseFloat((this.totalIndiretos[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 4) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 5) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 6) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 7) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (this.totalIndiretos[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 8) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (this.totalIndiretos[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (this.totalIndiretos[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 9) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (this.totalIndiretos[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (this.totalIndiretos[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (this.totalIndiretos[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 10) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (this.totalIndiretos[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (this.totalIndiretos[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (this.totalIndiretos[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (this.totalIndiretos[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 11) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (this.totalIndiretos[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (this.totalIndiretos[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (this.totalIndiretos[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (this.totalIndiretos[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (this.totalIndiretos[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 12) {
            this.totalIndiretos[0].jan = (this.totalIndiretos[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].fev = (this.totalIndiretos[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mar = (this.totalIndiretos[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].abr = (this.totalIndiretos[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].mai = (this.totalIndiretos[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jun = (this.totalIndiretos[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].jul = (this.totalIndiretos[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].ago = (this.totalIndiretos[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].set = (this.totalIndiretos[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].out = (this.totalIndiretos[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].nov = (this.totalIndiretos[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalIndiretos[0].dez = (parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

        //Total rateio departamentos
        if (this.mes == 1) {
            this.totalRateioDepartamento[0].jan = (parseFloat((this.totalRateioDepartamento[0].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (parseFloat((this.totalRateioDepartamento[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (parseFloat((this.totalRateioDepartamento[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 2) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (parseFloat((this.totalRateioDepartamento[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (parseFloat((this.totalRateioDepartamento[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 3) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (parseFloat((this.totalRateioDepartamento[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 4) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 5) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 6) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 7) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (this.totalRateioDepartamento[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 8) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (this.totalRateioDepartamento[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (this.totalRateioDepartamento[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 9) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (this.totalRateioDepartamento[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (this.totalRateioDepartamento[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (this.totalRateioDepartamento[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 10) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (this.totalRateioDepartamento[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (this.totalRateioDepartamento[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (this.totalRateioDepartamento[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (this.totalRateioDepartamento[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 11) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (this.totalRateioDepartamento[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (this.totalRateioDepartamento[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (this.totalRateioDepartamento[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (this.totalRateioDepartamento[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (this.totalRateioDepartamento[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 12) {
            this.totalRateioDepartamento[0].jan = (this.totalRateioDepartamento[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].fev = (this.totalRateioDepartamento[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mar = (this.totalRateioDepartamento[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].abr = (this.totalRateioDepartamento[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].mai = (this.totalRateioDepartamento[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jun = (this.totalRateioDepartamento[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].jul = (this.totalRateioDepartamento[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].ago = (this.totalRateioDepartamento[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].set = (this.totalRateioDepartamento[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].out = (this.totalRateioDepartamento[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].nov = (this.totalRateioDepartamento[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalRateioDepartamento[0].dez = (parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

        //Total Gerais
        if (this.mes == 1) {
            this.totalGerais[0].jan = (parseFloat((this.totalGerais[0].jan * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (parseFloat((this.totalGerais[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (parseFloat((this.totalGerais[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 2) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (parseFloat((this.totalGerais[0].fev * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (parseFloat((this.totalGerais[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });


        } else if (this.mes == 3) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (parseFloat((this.totalGerais[0].mar * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

        } else if (this.mes == 4) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 5) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 6) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 7) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (this.totalGerais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 8) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (this.totalGerais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (this.totalGerais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 9) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (this.totalGerais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (this.totalGerais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (this.totalGerais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 10) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (this.totalGerais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (this.totalGerais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (this.totalGerais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (this.totalGerais[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 11) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (this.totalGerais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (this.totalGerais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (this.totalGerais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (this.totalGerais[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (this.totalGerais[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        } else if (this.mes == 12) {
            this.totalGerais[0].jan = (this.totalGerais[0].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].fev = (this.totalGerais[0].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mar = (this.totalGerais[0].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].abr = (this.totalGerais[0].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].mai = (this.totalGerais[0].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jun = (this.totalGerais[0].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].jul = (this.totalGerais[0].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].ago = (this.totalGerais[0].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].set = (this.totalGerais[0].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].out = (this.totalGerais[0].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].nov = (this.totalGerais[0].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.totalGerais[0].dez = (parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

        this.calculaProjecao();
    }

    buscarValores(ciclo) {

        this.iniciarQuantidadeAlunos(ciclo);

        this.ciclo = ciclo;

        if (ciclo == 0) {
            this.nomeCiclo = "Educação Infantil";
            this.getInfantil();
            this.getTotalInfantil();
        } else if (ciclo == 1) {
            this.getFundI();
            this.getTotalFundI();
            this.nomeCiclo = "Ensino Fundamental I";
        } else if (ciclo == 2) {
            this.getFundII();
            this.getTotalFundII();
            this.nomeCiclo = "Ensino Fundamental II";
        } else if (ciclo == 3) {
            this.getMedio();
            this.getTotalMedio();
            this.nomeCiclo = "Ensino Médio";
        }

        this.calcularMediaGrafico(ciclo);
        this.calculaReajuste(ciclo);
        this.calculaProjecao();
        this.calcularReajusteMercado();
        this.incluirMoeda();
    }

    calculaReajusteSemMoeda(ciclo) {
        this.reajuste = (this.indice * 0.01) + 1;
        this.reajustePessoal = (this.indicePessoal * 0.01) + 1;

        for (var i = 0; i < this.pessoal.length; i++) {
            if (this.mesPessoal == 1) {
                this.pessoal[i].jan = parseFloat((this.pessoal[i].jan * this.reajustePessoal).toFixed(2));
                this.pessoal[i].fev = parseFloat((this.pessoal[i].fev * this.reajustePessoal).toFixed(2));
                this.pessoal[i].mar = parseFloat((this.pessoal[i].mar * this.reajustePessoal).toFixed(2));
                this.pessoal[i].abr = parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2));
                this.pessoal[i].mai = parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jun = parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 2) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = parseFloat((this.pessoal[i].fev * this.reajustePessoal).toFixed(2));
                this.pessoal[i].mar = parseFloat((this.pessoal[i].mar * this.reajustePessoal).toFixed(2));
                this.pessoal[i].abr = parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2));
                this.pessoal[i].mai = parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jun = parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 3) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = parseFloat((this.pessoal[i].mar * this.reajustePessoal).toFixed(2));
                this.pessoal[i].abr = parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2));
                this.pessoal[i].mai = parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jun = parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 4) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = parseFloat((this.pessoal[i].abr * this.reajustePessoal).toFixed(2));
                this.pessoal[i].mai = parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jun = parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 5) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = parseFloat((this.pessoal[i].mai * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jun = parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 6) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = parseFloat((this.pessoal[i].jun * this.reajustePessoal).toFixed(2));
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 7) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = this.pessoal[i].jun;
                this.pessoal[i].jul = parseFloat((this.pessoal[i].jul * this.reajustePessoal).toFixed(2));
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 8) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = this.pessoal[i].jun;
                this.pessoal[i].jul = this.pessoal[i].jul;
                this.pessoal[i].ago = parseFloat((this.pessoal[i].ago * this.reajustePessoal).toFixed(2));
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 9) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = this.pessoal[i].jun;
                this.pessoal[i].jul = this.pessoal[i].jul;
                this.pessoal[i].ago = this.pessoal[i].ago;
                this.pessoal[i].set = parseFloat((this.pessoal[i].set * this.reajustePessoal).toFixed(2));
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 10) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = this.pessoal[i].jun;
                this.pessoal[i].jul = this.pessoal[i].jul;
                this.pessoal[i].ago = this.pessoal[i].ago;
                this.pessoal[i].set = this.pessoal[i].set;
                this.pessoal[i].out = parseFloat((this.pessoal[i].out * this.reajustePessoal).toFixed(2));
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 11) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = this.pessoal[i].jun;
                this.pessoal[i].jul = this.pessoal[i].jul;
                this.pessoal[i].ago = this.pessoal[i].ago;
                this.pessoal[i].set = this.pessoal[i].set;
                this.pessoal[i].out = this.pessoal[i].out;
                this.pessoal[i].nov = parseFloat((this.pessoal[i].nov * this.reajustePessoal).toFixed(2));
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));

            } else if (this.mesPessoal == 12) {
                this.pessoal[i].jan = this.pessoal[i].jan;
                this.pessoal[i].fev = this.pessoal[i].fev;
                this.pessoal[i].mar = this.pessoal[i].mar;
                this.pessoal[i].abr = this.pessoal[i].abr;
                this.pessoal[i].mai = this.pessoal[i].mai;
                this.pessoal[i].jun = this.pessoal[i].jun;
                this.pessoal[i].jul = this.pessoal[i].jul;
                this.pessoal[i].ago = this.pessoal[i].ago;
                this.pessoal[i].set = this.pessoal[i].set;
                this.pessoal[i].out = this.pessoal[i].out;
                this.pessoal[i].nov = this.pessoal[i].nov;
                this.pessoal[i].dez = parseFloat((this.pessoal[i].dez * this.reajustePessoal).toFixed(2));
            }
        }

        for (var i = 0; i < this.materiais.length; i++) {
            if (this.mes == 1) {

                this.materiais[i].jan = parseFloat((this.materiais[i].jan * this.reajuste).toFixed(2));
                this.materiais[i].fev = parseFloat((this.materiais[i].fev * this.reajuste).toFixed(2));
                this.materiais[i].mar = parseFloat((this.materiais[i].mar * this.reajuste).toFixed(2));
                this.materiais[i].abr = parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2));
                this.materiais[i].mai = parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2));
                this.materiais[i].jun = parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2));
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 2) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = parseFloat((this.materiais[i].fev * this.reajuste).toFixed(2));
                this.materiais[i].mar = parseFloat((this.materiais[i].mar * this.reajuste).toFixed(2));
                this.materiais[i].abr = parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2));
                this.materiais[i].mai = parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2));
                this.materiais[i].jun = parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2));
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 3) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = parseFloat((this.materiais[i].mar * this.reajuste).toFixed(2));
                this.materiais[i].abr = parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2));
                this.materiais[i].mai = parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2));
                this.materiais[i].jun = parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2));
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 4) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = parseFloat((this.materiais[i].abr * this.reajuste).toFixed(2));
                this.materiais[i].mai = parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2));
                this.materiais[i].jun = parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2));
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 5) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = parseFloat((this.materiais[i].mai * this.reajuste).toFixed(2));
                this.materiais[i].jun = parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2));
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 6) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = parseFloat((this.materiais[i].jun * this.reajuste).toFixed(2));
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 7) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = this.materiais[i].jun;
                this.materiais[i].jul = parseFloat((this.materiais[i].jul * this.reajuste).toFixed(2));
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 8) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = this.materiais[i].jun;
                this.materiais[i].jul = this.materiais[i].jul;
                this.materiais[i].ago = parseFloat((this.materiais[i].ago * this.reajuste).toFixed(2));
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 9) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = this.materiais[i].jun;
                this.materiais[i].jul = this.materiais[i].jul;
                this.materiais[i].ago = this.materiais[i].ago;
                this.materiais[i].set = parseFloat((this.materiais[i].set * this.reajuste).toFixed(2));
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 10) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = this.materiais[i].jun;
                this.materiais[i].jul = this.materiais[i].jul;
                this.materiais[i].ago = this.materiais[i].ago;
                this.materiais[i].set = this.materiais[i].set;
                this.materiais[i].out = parseFloat((this.materiais[i].out * this.reajuste).toFixed(2));
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 11) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = this.materiais[i].jun;
                this.materiais[i].jul = this.materiais[i].jul;
                this.materiais[i].ago = this.materiais[i].ago;
                this.materiais[i].set = this.materiais[i].set;
                this.materiais[i].out = this.materiais[i].out;
                this.materiais[i].nov = parseFloat((this.materiais[i].nov * this.reajuste).toFixed(2));
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 12) {
                this.materiais[i].jan = this.materiais[i].jan;
                this.materiais[i].fev = this.materiais[i].fev;
                this.materiais[i].mar = this.materiais[i].mar;
                this.materiais[i].abr = this.materiais[i].abr;
                this.materiais[i].mai = this.materiais[i].mai;
                this.materiais[i].jun = this.materiais[i].jun;
                this.materiais[i].jul = this.materiais[i].jul;
                this.materiais[i].ago = this.materiais[i].ago;
                this.materiais[i].set = this.materiais[i].set;
                this.materiais[i].out = this.materiais[i].out;
                this.materiais[i].nov = this.materiais[i].nov;
                this.materiais[i].dez = parseFloat((this.materiais[i].dez * this.reajuste).toFixed(2));
            }
        }

        for (var i = 0; i < this.indiretos.length; i++) {
            if (this.mes == 1) {
                this.indiretos[i].jan = parseFloat((this.indiretos[i].jan * this.reajuste).toFixed(2));
                this.indiretos[i].fev = parseFloat((this.indiretos[i].fev * this.reajuste).toFixed(2));
                this.indiretos[i].mar = parseFloat((this.indiretos[i].mar * this.reajuste).toFixed(2));
                this.indiretos[i].abr = parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2));
                this.indiretos[i].mai = parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2));
                this.indiretos[i].jun = parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2));
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 2) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = parseFloat((this.indiretos[i].fev * this.reajuste).toFixed(2));
                this.indiretos[i].mar = parseFloat((this.indiretos[i].mar * this.reajuste).toFixed(2));
                this.indiretos[i].abr = parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2));
                this.indiretos[i].mai = parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2));
                this.indiretos[i].jun = parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2));
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 3) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = parseFloat((this.indiretos[i].mar * this.reajuste).toFixed(2));
                this.indiretos[i].abr = parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2));
                this.indiretos[i].mai = parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2));
                this.indiretos[i].jun = parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2));
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 4) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = parseFloat((this.indiretos[i].abr * this.reajuste).toFixed(2));
                this.indiretos[i].mai = parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2));
                this.indiretos[i].jun = parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2));
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 5) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = parseFloat((this.indiretos[i].mai * this.reajuste).toFixed(2));
                this.indiretos[i].jun = parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2));
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 6) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = parseFloat((this.indiretos[i].jun * this.reajuste).toFixed(2));
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 7) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = this.indiretos[i].jun;
                this.indiretos[i].jul = parseFloat((this.indiretos[i].jul * this.reajuste).toFixed(2));
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 8) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = this.indiretos[i].jun;
                this.indiretos[i].jul = this.indiretos[i].jul;
                this.indiretos[i].ago = parseFloat((this.indiretos[i].ago * this.reajuste).toFixed(2));
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 9) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = this.indiretos[i].jun;
                this.indiretos[i].jul = this.indiretos[i].jul;
                this.indiretos[i].ago = this.indiretos[i].ago;
                this.indiretos[i].set = parseFloat((this.indiretos[i].set * this.reajuste).toFixed(2));
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 10) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = this.indiretos[i].jun;
                this.indiretos[i].jul = this.indiretos[i].jul;
                this.indiretos[i].ago = this.indiretos[i].ago;
                this.indiretos[i].set = this.indiretos[i].set;
                this.indiretos[i].out = parseFloat((this.indiretos[i].out * this.reajuste).toFixed(2));
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 11) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = this.indiretos[i].jun;
                this.indiretos[i].jul = this.indiretos[i].jul;
                this.indiretos[i].ago = this.indiretos[i].ago;
                this.indiretos[i].set = this.indiretos[i].set;
                this.indiretos[i].out = this.indiretos[i].out;
                this.indiretos[i].nov = parseFloat((this.indiretos[i].nov * this.reajuste).toFixed(2));
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 12) {
                this.indiretos[i].jan = this.indiretos[i].jan;
                this.indiretos[i].fev = this.indiretos[i].fev;
                this.indiretos[i].mar = this.indiretos[i].mar;
                this.indiretos[i].abr = this.indiretos[i].abr;
                this.indiretos[i].mai = this.indiretos[i].mai;
                this.indiretos[i].jun = this.indiretos[i].jun;
                this.indiretos[i].jul = this.indiretos[i].jul;
                this.indiretos[i].ago = this.indiretos[i].ago;
                this.indiretos[i].set = this.indiretos[i].set;
                this.indiretos[i].out = this.indiretos[i].out;
                this.indiretos[i].nov = this.indiretos[i].nov;
                this.indiretos[i].dez = parseFloat((this.indiretos[i].dez * this.reajuste).toFixed(2));
            }
        }

        for (var i = 0; i < this.rateioDepartamento.length; i++) {
            if (this.mes == 1) {
                this.rateioDepartamento[i].jan = parseFloat((this.rateioDepartamento[i].jan * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].fev = parseFloat((this.rateioDepartamento[i].fev * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].mar = parseFloat((this.rateioDepartamento[i].mar * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].abr = parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].mai = parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jun = parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 2) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = parseFloat((this.rateioDepartamento[i].fev * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].mar = parseFloat((this.rateioDepartamento[i].mar * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].abr = parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].mai = parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jun = parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 3) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = parseFloat((this.rateioDepartamento[i].mar * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].abr = parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].mai = parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jun = parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 4) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = parseFloat((this.rateioDepartamento[i].abr * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].mai = parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jun = parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 5) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = parseFloat((this.rateioDepartamento[i].mai * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jun = parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 6) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = parseFloat((this.rateioDepartamento[i].jun * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 7) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = this.rateioDepartamento[i].jun;
                this.rateioDepartamento[i].jul = parseFloat((this.rateioDepartamento[i].jul * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 8) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = this.rateioDepartamento[i].jun;
                this.rateioDepartamento[i].jul = this.rateioDepartamento[i].jul;
                this.rateioDepartamento[i].ago = parseFloat((this.rateioDepartamento[i].ago * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 9) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = this.rateioDepartamento[i].jun;
                this.rateioDepartamento[i].jul = this.rateioDepartamento[i].jul;
                this.rateioDepartamento[i].ago = this.rateioDepartamento[i].ago;
                this.rateioDepartamento[i].set = parseFloat((this.rateioDepartamento[i].set * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 10) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = this.rateioDepartamento[i].jun;
                this.rateioDepartamento[i].jul = this.rateioDepartamento[i].jul;
                this.rateioDepartamento[i].ago = this.rateioDepartamento[i].ago;
                this.rateioDepartamento[i].set = this.rateioDepartamento[i].set;
                this.rateioDepartamento[i].out = parseFloat((this.rateioDepartamento[i].out * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 11) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = this.rateioDepartamento[i].jun;
                this.rateioDepartamento[i].jul = this.rateioDepartamento[i].jul;
                this.rateioDepartamento[i].ago = this.rateioDepartamento[i].ago;
                this.rateioDepartamento[i].set = this.rateioDepartamento[i].set;
                this.rateioDepartamento[i].out = this.rateioDepartamento[i].out;
                this.rateioDepartamento[i].nov = parseFloat((this.rateioDepartamento[i].nov * this.reajuste).toFixed(2));
                this.rateioDepartamento[i].dez = parseFloat((this.rateioDepartamento[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 12) {
                this.rateioDepartamento[i].jan = this.rateioDepartamento[i].jan;
                this.rateioDepartamento[i].fev = this.rateioDepartamento[i].fev;
                this.rateioDepartamento[i].mar = this.rateioDepartamento[i].mar;
                this.rateioDepartamento[i].abr = this.rateioDepartamento[i].abr;
                this.rateioDepartamento[i].mai = this.rateioDepartamento[i].mai;
                this.rateioDepartamento[i].jun = this.rateioDepartamento[i].jun;
                this.rateioDepartamento[i].jul = this.rateioDepartamento[i].jul;
                this.rateioDepartamento[i].ago = this.rateioDepartamento[i].ago;
                this.rateioDepartamento[i].set = this.rateioDepartamento[i].set;
                this.rateioDepartamento[i].out = this.rateioDepartamento[i].out;
                this.rateioDepartamento[i].nov = this.rateioDepartamento[i].nov;
                this.rateioDepartamento[i].dez = parseFloat((this.pessoal[i].dez * this.reajuste).toFixed(2));
            }
        }

        for (var i = 0; i < this.gerais.length; i++) {
            if (this.mes == 1) {
                this.gerais[i].jan = parseFloat((this.gerais[i].jan * this.reajuste).toFixed(2));
                this.gerais[i].fev = parseFloat((this.gerais[i].fev * this.reajuste).toFixed(2));
                this.gerais[i].mar = parseFloat((this.gerais[i].mar * this.reajuste).toFixed(2));
                this.gerais[i].abr = parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2));
                this.gerais[i].mai = parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2));
                this.gerais[i].jun = parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2));
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 2) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = parseFloat((this.gerais[i].fev * this.reajuste).toFixed(2));
                this.gerais[i].mar = parseFloat((this.gerais[i].mar * this.reajuste).toFixed(2));
                this.gerais[i].abr = parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2));
                this.gerais[i].mai = parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2));
                this.gerais[i].jun = parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2));
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 3) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = parseFloat((this.gerais[i].mar * this.reajuste).toFixed(2));
                this.gerais[i].abr = parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2));
                this.gerais[i].mai = parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2));
                this.gerais[i].jun = parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2));
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));


            } else if (this.mes == 4) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = parseFloat((this.gerais[i].abr * this.reajuste).toFixed(2));
                this.gerais[i].mai = parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2));
                this.gerais[i].jun = parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2));
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 5) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = parseFloat((this.gerais[i].mai * this.reajuste).toFixed(2));
                this.gerais[i].jun = parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2));
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 6) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = parseFloat((this.gerais[i].jun * this.reajuste).toFixed(2));
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 7) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = this.gerais[i].jun;
                this.gerais[i].jul = parseFloat((this.gerais[i].jul * this.reajuste).toFixed(2));
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 8) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = this.gerais[i].jun;
                this.gerais[i].jul = this.gerais[i].jul;
                this.gerais[i].ago = parseFloat((this.gerais[i].ago * this.reajuste).toFixed(2));
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 9) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = this.gerais[i].jun;
                this.gerais[i].jul = this.gerais[i].jul;
                this.gerais[i].ago = this.gerais[i].ago;
                this.gerais[i].set = parseFloat((this.gerais[i].set * this.reajuste).toFixed(2));
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 10) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = this.gerais[i].jun;
                this.gerais[i].jul = this.gerais[i].jul;
                this.gerais[i].ago = this.gerais[i].ago;
                this.gerais[i].set = this.gerais[i].set;
                this.gerais[i].out = parseFloat((this.gerais[i].out * this.reajuste).toFixed(2));
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 11) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = this.gerais[i].jun;
                this.gerais[i].jul = this.gerais[i].jul;
                this.gerais[i].ago = this.gerais[i].ago;
                this.gerais[i].set = this.gerais[i].set;
                this.gerais[i].out = this.gerais[i].out;
                this.gerais[i].nov = parseFloat((this.gerais[i].nov * this.reajuste).toFixed(2));
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            } else if (this.mes == 12) {
                this.gerais[i].jan = this.gerais[i].jan;
                this.gerais[i].fev = this.gerais[i].fev;
                this.gerais[i].mar = this.gerais[i].mar;
                this.gerais[i].abr = this.gerais[i].abr;
                this.gerais[i].mai = this.gerais[i].mai;
                this.gerais[i].jun = this.gerais[i].jun;
                this.gerais[i].jul = this.gerais[i].jul;
                this.gerais[i].ago = this.gerais[i].ago;
                this.gerais[i].set = this.gerais[i].set;
                this.gerais[i].out = this.gerais[i].out;
                this.gerais[i].nov = this.gerais[i].nov;
                this.gerais[i].dez = parseFloat((this.gerais[i].dez * this.reajuste).toFixed(2));

            }
        }

        //Receitas
        //converter para moeda
        this.receitas[0].jan = this.receitas[0].jan;
        this.receitas[0].fev = this.receitas[0].fev;
        this.receitas[0].mar = this.receitas[0].mar;
        this.receitas[0].abr = this.receitas[0].abr;
        this.receitas[0].mai = this.receitas[0].mai;
        this.receitas[0].jun = this.receitas[0].jun;
        this.receitas[0].jul = this.receitas[0].jul;
        this.receitas[0].ago = this.receitas[0].ago;
        this.receitas[0].set = this.receitas[0].set;
        this.receitas[0].out = this.receitas[0].out;
        this.receitas[0].nov = this.receitas[0].nov;
        this.receitas[0].dez = this.receitas[0].dez;
        this.receitas[1].jan = this.receitas[0].jan;
        this.receitas[1].fev = this.receitas[1].fev;
        this.receitas[1].mar = this.receitas[1].mar;
        this.receitas[1].abr = this.receitas[1].abr;
        this.receitas[1].mai = this.receitas[1].mai;
        this.receitas[1].jun = this.receitas[1].jun;
        this.receitas[1].jul = this.receitas[1].jul;
        this.receitas[1].ago = this.receitas[1].ago;
        this.receitas[1].set = this.receitas[1].set;
        this.receitas[1].out = this.receitas[1].out;
        this.receitas[1].nov = this.receitas[1].nov;
        this.receitas[1].dez = this.receitas[1].dez;
        this.resultsTotalReceitas[0].jan = this.resultsTotalReceitas[0].jan;
        this.resultsTotalReceitas[0].fev = this.resultsTotalReceitas[0].fev;
        this.resultsTotalReceitas[0].mar = this.resultsTotalReceitas[0].mar;
        this.resultsTotalReceitas[0].abr = this.resultsTotalReceitas[0].abr;
        this.resultsTotalReceitas[0].mai = this.resultsTotalReceitas[0].mai;
        this.resultsTotalReceitas[0].jun = this.resultsTotalReceitas[0].jun;
        this.resultsTotalReceitas[0].jul = this.resultsTotalReceitas[0].jul;
        this.resultsTotalReceitas[0].ago = this.resultsTotalReceitas[0].ago;
        this.resultsTotalReceitas[0].set = this.resultsTotalReceitas[0].set;
        this.resultsTotalReceitas[0].out = this.resultsTotalReceitas[0].out;
        this.resultsTotalReceitas[0].nov = this.resultsTotalReceitas[0].nov;
        this.resultsTotalReceitas[0].dez = this.resultsTotalReceitas[0].dez;


        //Total Pessoal
        if (this.mesPessoal == 1) {
            this.totalPessoal[0].jan = parseFloat((this.totalPessoal[0].jan * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].fev = parseFloat((this.totalPessoal[0].fev * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].mar = parseFloat((this.totalPessoal[0].mar * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].abr = parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].mai = parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jun = parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));

        } else if (this.mesPessoal == 2) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = parseFloat((this.totalPessoal[0].fev * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].mar = parseFloat((this.totalPessoal[0].mar * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].abr = parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].mai = parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jun = parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));


        } else if (this.mesPessoal == 3) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = parseFloat((this.totalPessoal[0].mar * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].abr = parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].mai = parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jun = parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));

        } else if (this.mesPessoal == 4) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = parseFloat((this.totalPessoal[0].abr * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].mai = parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jun = parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 5) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = parseFloat((this.totalPessoal[0].mai * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jun = parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 6) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = parseFloat((this.totalPessoal[0].jun * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 7) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = this.totalPessoal[0].jun;
            this.totalPessoal[0].jul = parseFloat((this.totalPessoal[0].jul * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 8) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = this.totalPessoal[0].jun;
            this.totalPessoal[0].jul = this.totalPessoal[0].jul;
            this.totalPessoal[0].ago = parseFloat((this.totalPessoal[0].ago * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 9) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = this.totalPessoal[0].jun;
            this.totalPessoal[0].jul = this.totalPessoal[0].jul;
            this.totalPessoal[0].ago = this.totalPessoal[0].ago;
            this.totalPessoal[0].set = parseFloat((this.totalPessoal[0].set * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 10) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = this.totalPessoal[0].jun;
            this.totalPessoal[0].jul = this.totalPessoal[0].jul;
            this.totalPessoal[0].ago = this.totalPessoal[0].ago;
            this.totalPessoal[0].set = this.totalPessoal[0].set;
            this.totalPessoal[0].out = parseFloat((this.totalPessoal[0].out * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 11) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = this.totalPessoal[0].jun;
            this.totalPessoal[0].jul = this.totalPessoal[0].jul;
            this.totalPessoal[0].ago = this.totalPessoal[0].ago;
            this.totalPessoal[0].set = this.totalPessoal[0].set;
            this.totalPessoal[0].out = this.totalPessoal[0].out;
            this.totalPessoal[0].nov = parseFloat((this.totalPessoal[0].nov * this.reajustePessoal).toFixed(2));
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        } else if (this.mesPessoal == 12) {
            this.totalPessoal[0].jan = this.totalPessoal[0].jan;
            this.totalPessoal[0].fev = this.totalPessoal[0].fev;
            this.totalPessoal[0].mar = this.totalPessoal[0].mar;
            this.totalPessoal[0].abr = this.totalPessoal[0].abr;
            this.totalPessoal[0].mai = this.totalPessoal[0].mai;
            this.totalPessoal[0].jun = this.totalPessoal[0].jun;
            this.totalPessoal[0].jul = this.totalPessoal[0].jul;
            this.totalPessoal[0].ago = this.totalPessoal[0].ago;
            this.totalPessoal[0].set = this.totalPessoal[0].set;
            this.totalPessoal[0].out = this.totalPessoal[0].out;
            this.totalPessoal[0].nov = this.totalPessoal[0].nov;
            this.totalPessoal[0].dez = parseFloat((this.totalPessoal[0].dez * this.reajustePessoal).toFixed(2));
        }

        //Total Materiais
        if (this.mes == 1) {
            this.totalMateriais[0].jan = parseFloat((this.totalMateriais[0].jan * this.reajuste).toFixed(2));
            this.totalMateriais[0].fev = parseFloat((this.totalMateriais[0].fev * this.reajuste).toFixed(2));
            this.totalMateriais[0].mar = parseFloat((this.totalMateriais[0].mar * this.reajuste).toFixed(2));
            this.totalMateriais[0].abr = parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2));
            this.totalMateriais[0].mai = parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2));
            this.totalMateriais[0].jun = parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2));
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 2) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = parseFloat((this.totalMateriais[0].fev * this.reajuste).toFixed(2));
            this.totalMateriais[0].mar = parseFloat((this.totalMateriais[0].mar * this.reajuste).toFixed(2));
            this.totalMateriais[0].abr = parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2));
            this.totalMateriais[0].mai = parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2));
            this.totalMateriais[0].jun = parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2));
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 3) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = parseFloat((this.totalMateriais[0].mar * this.reajuste).toFixed(2));
            this.totalMateriais[0].abr = parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2));
            this.totalMateriais[0].mai = parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2));
            this.totalMateriais[0].jun = parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2));
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 4) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = parseFloat((this.totalMateriais[0].abr * this.reajuste).toFixed(2));
            this.totalMateriais[0].mai = parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2));
            this.totalMateriais[0].jun = parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2));
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 5) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = parseFloat((this.totalMateriais[0].mai * this.reajuste).toFixed(2));
            this.totalMateriais[0].jun = parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2));
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 6) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = parseFloat((this.totalMateriais[0].jun * this.reajuste).toFixed(2));
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 7) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = this.totalMateriais[0].jun;
            this.totalMateriais[0].jul = parseFloat((this.totalMateriais[0].jul * this.reajuste).toFixed(2));
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 8) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = this.totalMateriais[0].jun;
            this.totalMateriais[0].jul = this.totalMateriais[0].jul;
            this.totalMateriais[0].ago = parseFloat((this.totalMateriais[0].ago * this.reajuste).toFixed(2));
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 9) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = this.totalMateriais[0].jun;
            this.totalMateriais[0].jul = this.totalMateriais[0].jul;
            this.totalMateriais[0].ago = this.totalMateriais[0].ago;
            this.totalMateriais[0].set = parseFloat((this.totalMateriais[0].set * this.reajuste).toFixed(2));
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 10) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = this.totalMateriais[0].jun;
            this.totalMateriais[0].jul = this.totalMateriais[0].jul;
            this.totalMateriais[0].ago = this.totalMateriais[0].ago;
            this.totalMateriais[0].set = this.totalMateriais[0].set;
            this.totalMateriais[0].out = parseFloat((this.totalMateriais[0].out * this.reajuste).toFixed(2));
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 11) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = this.totalMateriais[0].jun;
            this.totalMateriais[0].jul = this.totalMateriais[0].jul;
            this.totalMateriais[0].ago = this.totalMateriais[0].ago;
            this.totalMateriais[0].set = this.totalMateriais[0].set;
            this.totalMateriais[0].out = this.totalMateriais[0].out;
            this.totalMateriais[0].nov = parseFloat((this.totalMateriais[0].nov * this.reajuste).toFixed(2));
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 12) {
            this.totalMateriais[0].jan = this.totalMateriais[0].jan;
            this.totalMateriais[0].fev = this.totalMateriais[0].fev;
            this.totalMateriais[0].mar = this.totalMateriais[0].mar;
            this.totalMateriais[0].abr = this.totalMateriais[0].abr;
            this.totalMateriais[0].mai = this.totalMateriais[0].mai;
            this.totalMateriais[0].jun = this.totalMateriais[0].jun;
            this.totalMateriais[0].jul = this.totalMateriais[0].jul;
            this.totalMateriais[0].ago = this.totalMateriais[0].ago;
            this.totalMateriais[0].set = this.totalMateriais[0].set;
            this.totalMateriais[0].out = this.totalMateriais[0].out;
            this.totalMateriais[0].nov = this.totalMateriais[0].nov;
            this.totalMateriais[0].dez = parseFloat((this.totalMateriais[0].dez * this.reajuste).toFixed(2));
        }

        //Total Indiretos
        if (this.mes == 1) {
            this.totalIndiretos[0].jan = parseFloat((this.totalIndiretos[0].jan * this.reajuste).toFixed(2));
            this.totalIndiretos[0].fev = parseFloat((this.totalIndiretos[0].fev * this.reajuste).toFixed(2));
            this.totalIndiretos[0].mar = parseFloat((this.totalIndiretos[0].mar * this.reajuste).toFixed(2));
            this.totalIndiretos[0].abr = parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2));
            this.totalIndiretos[0].mai = parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jun = parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 2) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = parseFloat((this.totalIndiretos[0].fev * this.reajuste).toFixed(2));
            this.totalIndiretos[0].mar = parseFloat((this.totalIndiretos[0].mar * this.reajuste).toFixed(2));
            this.totalIndiretos[0].abr = parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2));
            this.totalIndiretos[0].mai = parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jun = parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 3) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = parseFloat((this.totalIndiretos[0].mar * this.reajuste).toFixed(2));
            this.totalIndiretos[0].abr = parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2));
            this.totalIndiretos[0].mai = parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jun = parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 4) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = parseFloat((this.totalIndiretos[0].abr * this.reajuste).toFixed(2));
            this.totalIndiretos[0].mai = parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jun = parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 5) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = parseFloat((this.totalIndiretos[0].mai * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jun = parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 6) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = parseFloat((this.totalIndiretos[0].jun * this.reajuste).toFixed(2));
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 7) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = this.totalIndiretos[0].jun;
            this.totalIndiretos[0].jul = parseFloat((this.totalIndiretos[0].jul * this.reajuste).toFixed(2));
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 8) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = this.totalIndiretos[0].jun;
            this.totalIndiretos[0].jul = this.totalIndiretos[0].jul;
            this.totalIndiretos[0].ago = parseFloat((this.totalIndiretos[0].ago * this.reajuste).toFixed(2));
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 9) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = this.totalIndiretos[0].jun;
            this.totalIndiretos[0].jul = this.totalIndiretos[0].jul;
            this.totalIndiretos[0].ago = this.totalIndiretos[0].ago;
            this.totalIndiretos[0].set = parseFloat((this.totalIndiretos[0].set * this.reajuste).toFixed(2));
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 10) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = this.totalIndiretos[0].jun;
            this.totalIndiretos[0].jul = this.totalIndiretos[0].jul;
            this.totalIndiretos[0].ago = this.totalIndiretos[0].ago;
            this.totalIndiretos[0].set = this.totalIndiretos[0].set;
            this.totalIndiretos[0].out = parseFloat((this.totalIndiretos[0].out * this.reajuste).toFixed(2));
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 11) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = this.totalIndiretos[0].jun;
            this.totalIndiretos[0].jul = this.totalIndiretos[0].jul;
            this.totalIndiretos[0].ago = this.totalIndiretos[0].ago;
            this.totalIndiretos[0].set = this.totalIndiretos[0].set;
            this.totalIndiretos[0].out = this.totalIndiretos[0].out;
            this.totalIndiretos[0].nov = parseFloat((this.totalIndiretos[0].nov * this.reajuste).toFixed(2));
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 12) {
            this.totalIndiretos[0].jan = this.totalIndiretos[0].jan;
            this.totalIndiretos[0].fev = this.totalIndiretos[0].fev;
            this.totalIndiretos[0].mar = this.totalIndiretos[0].mar;
            this.totalIndiretos[0].abr = this.totalIndiretos[0].abr;
            this.totalIndiretos[0].mai = this.totalIndiretos[0].mai;
            this.totalIndiretos[0].jun = this.totalIndiretos[0].jun;
            this.totalIndiretos[0].jul = this.totalIndiretos[0].jul;
            this.totalIndiretos[0].ago = this.totalIndiretos[0].ago;
            this.totalIndiretos[0].set = this.totalIndiretos[0].set;
            this.totalIndiretos[0].out = this.totalIndiretos[0].out;
            this.totalIndiretos[0].nov = this.totalIndiretos[0].nov;
            this.totalIndiretos[0].dez = parseFloat((this.totalIndiretos[0].dez * this.reajuste).toFixed(2));
        }

        //Total Rateio Departamento
        if (this.mes == 1) {
            this.totalRateioDepartamento[0].jan = parseFloat((this.totalRateioDepartamento[0].jan * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].fev = parseFloat((this.totalRateioDepartamento[0].fev * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].mar = parseFloat((this.totalRateioDepartamento[0].mar * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].abr = parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].mai = parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jun = parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 2) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = parseFloat((this.totalRateioDepartamento[0].fev * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].mar = parseFloat((this.totalRateioDepartamento[0].mar * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].abr = parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].mai = parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jun = parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 3) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = parseFloat((this.totalRateioDepartamento[0].mar * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].abr = parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].mai = parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jun = parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 4) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = parseFloat((this.totalRateioDepartamento[0].abr * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].mai = parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jun = parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 5) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = parseFloat((this.totalRateioDepartamento[0].mai * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jun = parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 6) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = parseFloat((this.totalRateioDepartamento[0].jun * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 7) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = this.totalRateioDepartamento[0].jun;
            this.totalRateioDepartamento[0].jul = parseFloat((this.totalRateioDepartamento[0].jul * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 8) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = this.totalRateioDepartamento[0].jun;
            this.totalRateioDepartamento[0].jul = this.totalRateioDepartamento[0].jul;
            this.totalRateioDepartamento[0].ago = parseFloat((this.totalRateioDepartamento[0].ago * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 9) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = this.totalRateioDepartamento[0].jun;
            this.totalRateioDepartamento[0].jul = this.totalRateioDepartamento[0].jul;
            this.totalRateioDepartamento[0].ago = this.totalRateioDepartamento[0].ago;
            this.totalRateioDepartamento[0].set = parseFloat((this.totalRateioDepartamento[0].set * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 10) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = this.totalRateioDepartamento[0].jun;
            this.totalRateioDepartamento[0].jul = this.totalRateioDepartamento[0].jul;
            this.totalRateioDepartamento[0].ago = this.totalRateioDepartamento[0].ago;
            this.totalRateioDepartamento[0].set = this.totalRateioDepartamento[0].set;
            this.totalRateioDepartamento[0].out = parseFloat((this.totalRateioDepartamento[0].out * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 11) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = this.totalRateioDepartamento[0].jun;
            this.totalRateioDepartamento[0].jul = this.totalRateioDepartamento[0].jul;
            this.totalRateioDepartamento[0].ago = this.totalRateioDepartamento[0].ago;
            this.totalRateioDepartamento[0].set = this.totalRateioDepartamento[0].set;
            this.totalRateioDepartamento[0].out = this.totalRateioDepartamento[0].out;
            this.totalRateioDepartamento[0].nov = parseFloat((this.totalRateioDepartamento[0].nov * this.reajuste).toFixed(2));
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 12) {
            this.totalRateioDepartamento[0].jan = this.totalRateioDepartamento[0].jan;
            this.totalRateioDepartamento[0].fev = this.totalRateioDepartamento[0].fev;
            this.totalRateioDepartamento[0].mar = this.totalRateioDepartamento[0].mar;
            this.totalRateioDepartamento[0].abr = this.totalRateioDepartamento[0].abr;
            this.totalRateioDepartamento[0].mai = this.totalRateioDepartamento[0].mai;
            this.totalRateioDepartamento[0].jun = this.totalRateioDepartamento[0].jun;
            this.totalRateioDepartamento[0].jul = this.totalRateioDepartamento[0].jul;
            this.totalRateioDepartamento[0].ago = this.totalRateioDepartamento[0].ago;
            this.totalRateioDepartamento[0].set = this.totalRateioDepartamento[0].set;
            this.totalRateioDepartamento[0].out = this.totalRateioDepartamento[0].out;
            this.totalRateioDepartamento[0].nov = this.totalRateioDepartamento[0].nov;
            this.totalRateioDepartamento[0].dez = parseFloat((this.totalRateioDepartamento[0].dez * this.reajuste).toFixed(2));
        }

        //Total Gerais
        if (this.mes == 1) {
            this.totalGerais[0].jan = parseFloat((this.totalGerais[0].jan * this.reajuste).toFixed(2));
            this.totalGerais[0].fev = parseFloat((this.totalGerais[0].fev * this.reajuste).toFixed(2));
            this.totalGerais[0].mar = parseFloat((this.totalGerais[0].mar * this.reajuste).toFixed(2));
            this.totalGerais[0].abr = parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2));
            this.totalGerais[0].mai = parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2));
            this.totalGerais[0].jun = parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2));
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 2) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = parseFloat((this.totalGerais[0].fev * this.reajuste).toFixed(2));
            this.totalGerais[0].mar = parseFloat((this.totalGerais[0].mar * this.reajuste).toFixed(2));
            this.totalGerais[0].abr = parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2));
            this.totalGerais[0].mai = parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2));
            this.totalGerais[0].jun = parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2));
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));


        } else if (this.mes == 3) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = parseFloat((this.totalGerais[0].mar * this.reajuste).toFixed(2));
            this.totalGerais[0].abr = parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2));
            this.totalGerais[0].mai = parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2));
            this.totalGerais[0].jun = parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2));
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));

        } else if (this.mes == 4) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = parseFloat((this.totalGerais[0].abr * this.reajuste).toFixed(2));
            this.totalGerais[0].mai = parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2));
            this.totalGerais[0].jun = parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2));
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 5) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = parseFloat((this.totalGerais[0].mai * this.reajuste).toFixed(2));
            this.totalGerais[0].jun = parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2));
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 6) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = parseFloat((this.totalGerais[0].jun * this.reajuste).toFixed(2));
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 7) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = this.totalGerais[0].jun;
            this.totalGerais[0].jul = parseFloat((this.totalGerais[0].jul * this.reajuste).toFixed(2));
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 8) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = this.totalGerais[0].jun;
            this.totalGerais[0].jul = this.totalGerais[0].jul;
            this.totalGerais[0].ago = parseFloat((this.totalGerais[0].ago * this.reajuste).toFixed(2));
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 9) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = this.totalGerais[0].jun;
            this.totalGerais[0].jul = this.totalGerais[0].jul;
            this.totalGerais[0].ago = this.totalGerais[0].ago;
            this.totalGerais[0].set = parseFloat((this.totalGerais[0].set * this.reajuste).toFixed(2));
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 10) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = this.totalGerais[0].jun;
            this.totalGerais[0].jul = this.totalGerais[0].jul;
            this.totalGerais[0].ago = this.totalGerais[0].ago;
            this.totalGerais[0].set = this.totalGerais[0].set;
            this.totalGerais[0].out = parseFloat((this.totalGerais[0].out * this.reajuste).toFixed(2));
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 11) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = this.totalGerais[0].jun;
            this.totalGerais[0].jul = this.totalGerais[0].jul;
            this.totalGerais[0].ago = this.totalGerais[0].ago;
            this.totalGerais[0].set = this.totalGerais[0].set;
            this.totalGerais[0].out = this.totalGerais[0].out;
            this.totalGerais[0].nov = parseFloat((this.totalGerais[0].nov * this.reajuste).toFixed(2));
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        } else if (this.mes == 12) {
            this.totalGerais[0].jan = this.totalGerais[0].jan;
            this.totalGerais[0].fev = this.totalGerais[0].fev;
            this.totalGerais[0].mar = this.totalGerais[0].mar;
            this.totalGerais[0].abr = this.totalGerais[0].abr;
            this.totalGerais[0].mai = this.totalGerais[0].mai;
            this.totalGerais[0].jun = this.totalGerais[0].jun;
            this.totalGerais[0].jul = this.totalGerais[0].jul;
            this.totalGerais[0].ago = this.totalGerais[0].ago;
            this.totalGerais[0].set = this.totalGerais[0].set;
            this.totalGerais[0].out = this.totalGerais[0].out;
            this.totalGerais[0].nov = this.totalGerais[0].nov;
            this.totalGerais[0].dez = parseFloat((this.totalGerais[0].dez * this.reajuste).toFixed(2));
        }

        this.calculaProjecao();
    }

    incluirMoeda() {
        for (var i = 0; i < this.receitas.length; i++) {
            this.receitas[i].jan = (this.receitas[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].fev = (this.receitas[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].mar = (this.receitas[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].abr = (this.receitas[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].mai = (this.receitas[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].jun = (this.receitas[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].jul = (this.receitas[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].ago = (this.receitas[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].set = (this.receitas[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].out = (this.receitas[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].nov = (this.receitas[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.receitas[i].dez = (this.receitas[i].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }
        for (var i = 0; i < this.pessoal.length; i++) {
            this.pessoal[i].jan = (this.pessoal[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].fev = (this.pessoal[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].mar = (this.pessoal[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].abr = (this.pessoal[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].mai = (this.pessoal[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].jun = (this.pessoal[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].jul = (this.pessoal[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].ago = (this.pessoal[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].set = (this.pessoal[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].out = (this.pessoal[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].nov = (this.pessoal[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.pessoal[i].dez = (this.pessoal[i].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }
        for (var i = 0; i < this.materiais.length; i++) {
            this.materiais[i].jan = (this.materiais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].fev = (this.materiais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].mar = (this.materiais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].abr = (this.materiais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].mai = (this.materiais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].jun = (this.materiais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].jul = (this.materiais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].ago = (this.materiais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].set = (this.materiais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].out = (this.materiais[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].nov = (this.materiais[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.materiais[i].dez = (this.materiais[i].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }
        for (var i = 0; i < this.indiretos.length; i++) {
            this.indiretos[i].jan = (this.indiretos[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].fev = (this.indiretos[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].mar = (this.indiretos[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].abr = (this.indiretos[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].mai = (this.indiretos[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].jun = (this.indiretos[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].jul = (this.indiretos[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].ago = (this.indiretos[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].set = (this.indiretos[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].out = (this.indiretos[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].nov = (this.indiretos[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.indiretos[i].dez = (this.indiretos[i].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }
        for (var i = 0; i < this.rateioDepartamento.length; i++) {
            this.rateioDepartamento[i].jan = (this.rateioDepartamento[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].fev = (this.rateioDepartamento[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].mar = (this.rateioDepartamento[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].abr = (this.rateioDepartamento[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].mai = (this.rateioDepartamento[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].jun = (this.rateioDepartamento[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].jul = (this.rateioDepartamento[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].ago = (this.rateioDepartamento[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].set = (this.rateioDepartamento[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].out = (this.rateioDepartamento[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].nov = (this.rateioDepartamento[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.rateioDepartamento[i].dez = (this.rateioDepartamento[i].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

        for (var i = 0; i < this.gerais.length; i++) {
            this.gerais[i].jan = (this.gerais[i].jan).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].fev = (this.gerais[i].fev).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].mar = (this.gerais[i].mar).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].abr = (this.gerais[i].abr).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].mai = (this.gerais[i].mai).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].jun = (this.gerais[i].jun).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].jul = (this.gerais[i].jul).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].ago = (this.gerais[i].ago).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].set = (this.gerais[i].set).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].out = (this.gerais[i].out).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].nov = (this.gerais[i].nov).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
            this.gerais[i].dez = (this.gerais[i].dez).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }

    }

    iniciarQuantidadeAlunos(ciclo) {
        if (ciclo == 0) {
            this.vagas = 31;
            this.bolsistas = 0;
            this.pagantes = 31;

            this.imposto = 0;
            this.margemLucro = 0;
            this.parcelas = 12;
            //this.percentualMercado = 0;

            this.valorMensalidadeAtual = 1761.50;

        } else if (ciclo == 1) {
            this.vagas = 229;
            this.bolsistas = 50;
            this.pagantes = 179;

            this.imposto = 0;
            this.margemLucro = 0;
            this.parcelas = 12;
            //this.percentualMercado = 0;

            this.valorMensalidadeAtual = 1112.75;

        } else if (ciclo == 2) {
            this.vagas = 140;
            this.bolsistas = 0;
            this.pagantes = 140;

            this.imposto = 0;
            this.margemLucro = 0;
            this.parcelas = 12;
            //this.percentualMercado = 0;

            this.valorMensalidadeAtual = 1210.05;
        } else if (ciclo == 3) {
            this.vagas = 125;
            this.bolsistas = 0;
            this.pagantes = 125;

            this.imposto = 0;
            this.margemLucro = 0;
            this.parcelas = 12;
            //this.percentualMercado = 0;
            this.valorMensalidadeAtual = 1280.05;
        }

    }

    //Valores dos campos
    getInfantil() {
        this.resultsReceitasInfantil = [
            {
                "centro": 'Receita Liquida',
                "jan": 70521.96,
                "fev": 70521.96,
                "mar": 70521.96,
                "abr": 70521.96,
                "mai": 70521.96,
                "jun": 70521.96,
                "jul": 70521.96,
                "ago": 70521.96,
                "set": 70521.96,
                "out": 70521.96,
                "nov": 70521.96,
                "dez": 70521.96
            },
            {
                "centro": 'Imposto',
                "jan": 11988.73,
                "fev": 11988.73,
                "mar": 11988.73,
                "abr": 11988.73,
                "mai": 11988.73,
                "jun": 11988.73,
                "jul": 11988.73,
                "ago": 11988.73,
                "set": 11988.73,
                "out": 11988.73,
                "nov": 11988.73,
                "dez": 11988.73
            }];
        this.receitas = this.resultsReceitasInfantil;


        this.resultsPessoalInfantil = [
            {
                "centro": 'Salarios',
                "jan": 26677.56,
                "fev": 26677.56,
                "mar": 26677.56,
                "abr": 26677.56,
                "mai": 26677.56,
                "jun": 26677.56,
                "jul": 26677.56,
                "ago": 26677.56,
                "set": 26677.56,
                "out": 26677.56,
                "nov": 26677.56,
                "dez": 26677.56
            },
            {
                "centro": "Decimo Terceiro",
                "jan": 2223.13,
                "fev": 2223.13,
                "mar": 2223.13,
                "abr": 2223.13,
                "mai": 2223.13,
                "jun": 2223.13,
                "jul": 2223.13,
                "ago": 2223.13,
                "set": 2223.13,
                "out": 2223.13,
                "nov": 2223.13,
                "dez": 2223.13
            },
            {
                "centro": "1/3 Ferias",
                "jan": 741.64,
                "fev": 741.64,
                "mar": 741.64,
                "abr": 741.64,
                "mai": 741.64,
                "jun": 741.64,
                "jul": 741.64,
                "ago": 741.64,
                "set": 741.64,
                "out": 741.64,
                "nov": 741.64,
                "dez": 741.64
            },
            {
                "centro": "FGTS (8%)",
                "jan": 2134.21,
                "fev": 2134.21,
                "mar": 2134.21,
                "abr": 2134.21,
                "mai": 2134.21,
                "jun": 2134.21,
                "jul": 2134.21,
                "ago": 2134.21,
                "set": 2134.21,
                "out": 2134.21,
                "nov": 2134.21,
                "dez": 2134.21
            },
            {
                "centro": "PIS",
                "jan": 0.00,
                "fev": 0.00,
                "mar": 0.00,
                "abr": 0.00,
                "mai": 0.00,
                "jun": 0.00,
                "jul": 0.00,
                "ago": 0.00,
                "set": 0.00,
                "out": 0.00,
                "nov": 0.00,
                "dez": 0.00
            },
            {
                "centro": "Indenizacoes (2%)",
                "jan": 533.55,
                "fev": 533.55,
                "mar": 533.55,
                "abr": 533.55,
                "mai": 533.55,
                "jun": 533.55,
                "jul": 533.55,
                "ago": 533.55,
                "set": 533.55,
                "out": 533.55,
                "nov": 533.55,
                "dez": 533.55
            },
            {
                "centro": "Beneficios",
                "jan": 0.00,
                "fev": 0.00,
                "mar": 0.00,
                "abr": 0.00,
                "mai": 0.00,
                "jun": 0.00,
                "jul": 0.00,
                "ago": 0.00,
                "set": 0.00,
                "out": 0.00,
                "nov": 0.00,
                "dez": 0.00
            }];
        this.pessoal = this.resultsPessoalInfantil;

        this.resultsMateriaisInfantil = [
            {
                "centro": 'Brindes',
                "jan": 70.64,
                "fev": 70.64,
                "mar": 70.64,
                "abr": 70.64,
                "mai": 70.64,
                "jun": 70.64,
                "jul": 70.64,
                "ago": 70.64,
                "set": 70.64,
                "out": 70.64,
                "nov": 70.64,
                "dez": 70.64
            },
            {
                "centro": "Combustivel",
                "jan": 141.97,
                "fev": 141.97,
                "mar": 141.97,
                "abr": 141.97,
                "mai": 141.97,
                "jun": 141.97,
                "jul": 141.97,
                "ago": 141.97,
                "set": 141.97,
                "out": 141.97,
                "nov": 141.97,
                "dez": 141.97
            },
            {
                "centro": "Copa/Cozinha",
                "jan": 100.11,
                "fev": 100.11,
                "mar": 100.11,
                "abr": 100.11,
                "mai": 100.11,
                "jun": 100.11,
                "jul": 100.11,
                "ago": 100.11,
                "set": 100.11,
                "out": 100.11,
                "nov": 100.11,
                "dez": 100.11
            },
            {
                "centro": "Medicamentos",
                "jan": 2.17,
                "fev": 2.17,
                "mar": 2.17,
                "abr": 2.17,
                "mai": 2.17,
                "jun": 2.17,
                "jul": 2.17,
                "ago": 2.17,
                "set": 2.17,
                "out": 2.17,
                "nov": 2.17,
                "dez": 2.17
            },
            {
                "centro": "Graficas",
                "jan": 268.77,
                "fev": 268.77,
                "mar": 268.77,
                "abr": 268.77,
                "mai": 268.77,
                "jun": 268.77,
                "jul": 268.77,
                "ago": 268.77,
                "set": 268.77,
                "out": 268.77,
                "nov": 268.77,
                "dez": 268.77
            },
            {
                "centro": "Lanches/Refeicoes",
                "jan": 319.64,
                "fev": 319.64,
                "mar": 319.64,
                "abr": 319.64,
                "mai": 319.64,
                "jun": 319.64,
                "jul": 319.64,
                "ago": 319.64,
                "set": 319.64,
                "out": 319.64,
                "nov": 319.64,
                "dez": 319.64
            },
            {
                "centro": "Materiais Diversos",
                "jan": 67.99,
                "fev": 67.99,
                "mar": 67.99,
                "abr": 67.99,
                "mai": 67.99,
                "jun": 67.99,
                "jul": 67.99,
                "ago": 67.99,
                "set": 67.99,
                "out": 67.99,
                "nov": 67.99,
                "dez": 67.99
            },
            {
                "centro": "Materiais Expediente",
                "jan": 85.32,
                "fev": 85.32,
                "mar": 85.32,
                "abr": 85.32,
                "mai": 85.32,
                "jun": 85.32,
                "jul": 85.32,
                "ago": 85.32,
                "set": 85.32,
                "out": 85.32,
                "nov": 85.32,
                "dez": 85.32
            },
            {
                "centro": "Materiais Informatica",
                "jan": 96.64,
                "fev": 96.64,
                "mar": 96.64,
                "abr": 96.64,
                "mai": 96.64,
                "jun": 96.64,
                "jul": 96.64,
                "ago": 96.64,
                "set": 96.64,
                "out": 96.64,
                "nov": 96.64,
                "dez": 96.64
            },
            {
                "centro": "Materiais Pedagogico",
                "jan": 425.24,
                "fev": 425.24,
                "mar": 425.24,
                "abr": 425.24,
                "mai": 425.24,
                "jun": 425.24,
                "jul": 425.24,
                "ago": 425.24,
                "set": 425.24,
                "out": 425.24,
                "nov": 425.24,
                "dez": 425.24
            }];
        this.materiais = this.resultsMateriaisInfantil;

        this.resultsIndiretosInfantil = [
            {
                "centro": 'Arrendamento',
                "jan": 8667.28,
                "fev": 8667.28,
                "mar": 8667.28,
                "abr": 8667.28,
                "mai": 8667.28,
                "jun": 8667.28,
                "jul": 8667.28,
                "ago": 8667.28,
                "set": 8667.28,
                "out": 8667.28,
                "nov": 8667.28,
                "dez": 8667.28
            },
            {
                "centro": 'Energia Eletrica',
                "jan": 1560.11,
                "fev": 1560.11,
                "mar": 1560.11,
                "abr": 1560.11,
                "mai": 1560.11,
                "jun": 1560.11,
                "jul": 1560.11,
                "ago": 1560.11,
                "set": 1560.11,
                "out": 1560.11,
                "nov": 1560.11,
                "dez": 1560.11
            },
            {
                "centro": 'Telefone/Internet',
                "jan": 303.35,
                "fev": 303.35,
                "mar": 303.35,
                "abr": 303.35,
                "mai": 303.35,
                "jun": 303.35,
                "jul": 303.35,
                "ago": 303.35,
                "set": 303.35,
                "out": 303.35,
                "nov": 303.35,
                "dez": 303.35
            }];
        this.indiretos = this.resultsIndiretosInfantil;

        this.resultsRateioDepartamentoInfantil = [
            {
                "centro": 'Diretoria',
                "jan": 210.39,
                "fev": 210.39,
                "mar": 210.39,
                "abr": 210.39,
                "mai": 210.39,
                "jun": 210.39,
                "jul": 210.39,
                "ago": 210.39,
                "set": 210.39,
                "out": 210.39,
                "nov": 210.39,
                "dez": 210.39
            },
            {
                "centro": 'Financeiro',
                "jan": 389.21,
                "fev": 389.21,
                "mar": 389.21,
                "abr": 389.21,
                "mai": 389.21,
                "jun": 389.21,
                "jul": 389.21,
                "ago": 389.21,
                "set": 389.21,
                "out": 389.21,
                "nov": 389.21,
                "dez": 389.21
            },
            {
                "centro": 'Marketing',
                "jan": 109.44,
                "fev": 109.44,
                "mar": 109.44,
                "abr": 109.44,
                "mai": 109.44,
                "jun": 109.44,
                "jul": 109.44,
                "ago": 109.44,
                "set": 109.44,
                "out": 109.44,
                "nov": 109.44,
                "dez": 109.44
            },
            {
                "centro": 'Administracao',
                "jan": 122.35,
                "fev": 122.35,
                "mar": 122.35,
                "abr": 122.35,
                "mai": 122.35,
                "jun": 122.35,
                "jul": 122.35,
                "ago": 122.35,
                "set": 122.35,
                "out": 122.35,
                "nov": 122.35,
                "dez": 122.35
            }];
        this.rateioDepartamento = this.resultsRateioDepartamentoInfantil;

        this.resultsGeraisInfantil = [
            {
                "centro": 'Alugueis',
                "jan": 5590.40,
                "fev": 5590.40,
                "mar": 5590.40,
                "abr": 5590.40,
                "mai": 5590.40,
                "jun": 5590.40,
                "jul": 5590.40,
                "ago": 5590.40,
                "set": 5590.40,
                "out": 5590.40,
                "nov": 5590.40,
                "dez": 5590.40
            },
            {
                "centro": 'Consultoria Contab.',
                "jan": 546.04,
                "fev": 546.04,
                "mar": 546.04,
                "abr": 546.04,
                "mai": 546.04,
                "jun": 546.04,
                "jul": 546.04,
                "ago": 546.04,
                "set": 546.04,
                "out": 546.04,
                "nov": 546.04,
                "dez": 546.04
            },
            {
                "centro": 'Depreciacao',
                "jan": 384.51,
                "fev": 384.51,
                "mar": 384.51,
                "abr": 384.51,
                "mai": 384.51,
                "jun": 384.51,
                "jul": 384.51,
                "ago": 384.51,
                "set": 384.51,
                "out": 384.51,
                "nov": 384.51,
                "dez": 384.51
            },
            {
                "centro": 'Despesa Bancaria',
                "jan": 918.16,
                "fev": 918.16,
                "mar": 918.16,
                "abr": 918.16,
                "mai": 918.16,
                "jun": 918.16,
                "jul": 918.16,
                "ago": 918.16,
                "set": 918.16,
                "out": 918.16,
                "nov": 918.16,
                "dez": 918.16
            },
            {
                "centro": 'Despesa Postais',
                "jan": 11.27,
                "fev": 11.27,
                "mar": 11.27,
                "abr": 11.27,
                "mai": 11.27,
                "jun": 11.27,
                "jul": 11.27,
                "ago": 11.27,
                "set": 11.27,
                "out": 11.27,
                "nov": 11.27,
                "dez": 11.27
            },
            {
                "centro": 'Sindicato',
                "jan": 102.10,
                "fev": 102.10,
                "mar": 102.10,
                "abr": 102.10,
                "mai": 102.10,
                "jun": 102.10,
                "jul": 102.10,
                "ago": 102.10,
                "set": 102.10,
                "out": 102.10,
                "nov": 102.10,
                "dez": 102.10
            },
            {
                "centro": 'Juros e Multa',
                "jan": 166.21,
                "fev": 166.21,
                "mar": 166.21,
                "abr": 166.21,
                "mai": 166.21,
                "jun": 166.21,
                "jul": 166.21,
                "ago": 166.21,
                "set": 166.21,
                "out": 166.21,
                "nov": 166.21,
                "dez": 166.21
            },
            {
                "centro": 'Licenca de Software',
                "jan": 261.06,
                "fev": 261.06,
                "mar": 261.06,
                "abr": 261.06,
                "mai": 261.06,
                "jun": 261.06,
                "jul": 261.06,
                "ago": 261.06,
                "set": 261.06,
                "out": 261.06,
                "nov": 261.06,
                "dez": 261.06
            },
            {
                "centro": 'Manutencao Maq.',
                "jan": 214.95,
                "fev": 214.95,
                "mar": 214.95,
                "abr": 214.95,
                "mai": 214.95,
                "jun": 214.95,
                "jul": 214.95,
                "ago": 214.95,
                "set": 214.95,
                "out": 214.95,
                "nov": 214.95,
                "dez": 214.95
            },
            {
                "centro": 'Manutencao Veiculos',
                "jan": 142.23,
                "fev": 142.23,
                "mar": 142.23,
                "abr": 142.23,
                "mai": 142.23,
                "jun": 142.23,
                "jul": 142.23,
                "ago": 142.23,
                "set": 142.23,
                "out": 142.23,
                "nov": 142.23,
                "dez": 142.23
            },
            {
                "centro": 'Manutencao Predial',
                "jan": 649.58,
                "fev": 649.58,
                "mar": 649.58,
                "abr": 649.58,
                "mai": 649.58,
                "jun": 649.58,
                "jul": 649.58,
                "ago": 649.58,
                "set": 649.58,
                "out": 649.58,
                "nov": 649.58,
                "dez": 649.58
            },
            {
                "centro": 'Patrocinios',
                "jan": 44.03,
                "fev": 44.03,
                "mar": 44.03,
                "abr": 44.03,
                "mai": 44.03,
                "jun": 44.03,
                "jul": 44.03,
                "ago": 44.03,
                "set": 44.03,
                "out": 44.03,
                "nov": 44.03,
                "dez": 44.03
            },
            {
                "centro": 'Propaganda',
                "jan": 104.43,
                "fev": 104.43,
                "mar": 104.43,
                "abr": 104.43,
                "mai": 104.43,
                "jun": 104.43,
                "jul": 104.43,
                "ago": 104.43,
                "set": 104.43,
                "out": 104.43,
                "nov": 104.43,
                "dez": 104.43
            },
            {
                "centro": 'Servicos PJ',
                "jan": 548.12,
                "fev": 548.12,
                "mar": 548.12,
                "abr": 548.12,
                "mai": 548.12,
                "jun": 548.12,
                "jul": 548.12,
                "ago": 548.12,
                "set": 548.12,
                "out": 548.12,
                "nov": 548.12,
                "dez": 548.12
            },
            {
                "centro": 'Taxas',
                "jan": 225.35,
                "fev": 225.35,
                "mar": 225.35,
                "abr": 225.35,
                "mai": 225.35,
                "jun": 225.35,
                "jul": 225.35,
                "ago": 225.35,
                "set": 225.35,
                "out": 225.35,
                "nov": 225.35,
                "dez": 225.35
            },
            {
                "centro": 'Comissoes',
                "jan": 240.14,
                "fev": 240.14,
                "mar": 240.14,
                "abr": 240.14,
                "mai": 240.14,
                "jun": 240.14,
                "jul": 240.14,
                "ago": 240.14,
                "set": 240.14,
                "out": 240.14,
                "nov": 240.14,
                "dez": 240.14
            },
            {
                "centro": 'Taxi',
                "jan": 3.47,
                "fev": 3.47,
                "mar": 3.47,
                "abr": 3.47,
                "mai": 3.47,
                "jun": 3.47,
                "jul": 3.47,
                "ago": 3.47,
                "set": 3.47,
                "out": 3.47,
                "nov": 3.47,
                "dez": 3.47
            },
            {
                "centro": 'Depreciacao Equi.',
                "jan": 1292.78,
                "fev": 1292.78,
                "mar": 1292.78,
                "abr": 1292.78,
                "mai": 1292.78,
                "jun": 1292.78,
                "jul": 1292.78,
                "ago": 1292.78,
                "set": 1292.78,
                "out": 1292.78,
                "nov": 1292.78,
                "dez": 1292.78
            }];
        this.gerais = this.resultsGeraisInfantil;

        this.resultsTotalCustoDespesaInfantil = [
            {
                "centro": 'Total',
                "jan": 56695.52,
                "fev": 56695.52,
                "mar": 56695.52,
                "abr": 56695.52,
                "mai": 56695.52,
                "jun": 56695.52,
                "jul": 56695.52,
                "ago": 56695.52,
                "set": 56695.52,
                "out": 56695.52,
                "nov": 56695.52,
                "dez": 56695.52
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaInfantil;
    }
    //Total de cada Custo
    getTotalInfantil() {
        this.resultsTotalReceitas =
            [{
                "jan": 58533.23,
                "fev": 58533.23,
                "mar": 58533.23,
                "abr": 58533.23,
                "mai": 58533.23,
                "jun": 58533.23,
                "jul": 58533.23,
                "ago": 58533.23,
                "set": 58533.23,
                "out": 58533.23,
                "nov": 58533.23,
                "dez": 58533.23
            }];
        this.totalReceitas = this.resultsTotalReceitas;

        this.resultsTotalPessoal =
            [{
                "jan": 32310.09,
                "fev": 32310.09,
                "mar": 32310.09,
                "abr": 32310.09,
                "mai": 32310.09,
                "jun": 32310.09,
                "jul": 32310.09,
                "ago": 32310.09,
                "set": 32310.09,
                "out": 32310.09,
                "nov": 32310.09,
                "dez": 32310.09
            }];
        this.totalPessoal = this.resultsTotalPessoal;

        this.resultsTotalMateriais =
            [{
                "jan": 1578.48,
                "fev": 1578.48,
                "mar": 1578.48,
                "abr": 1578.48,
                "mai": 1578.48,
                "jun": 1578.48,
                "jul": 1578.48,
                "ago": 1578.48,
                "set": 1578.48,
                "out": 1578.48,
                "nov": 1578.48,
                "dez": 1578.48
            }];
        this.totalMateriais = this.resultsTotalMateriais;

        this.resultsTotalIndiretos =
            [{
                "jan": 10530.74,
                "fev": 10530.74,
                "mar": 10530.74,
                "abr": 10530.74,
                "mai": 10530.74,
                "jun": 10530.74,
                "jul": 10530.74,
                "ago": 10530.74,
                "set": 10530.74,
                "out": 10530.74,
                "nov": 10530.74,
                "dez": 10530.74
            }];
        this.totalIndiretos = this.resultsTotalIndiretos;

        this.resultsTotalGerais =
            [{
                "jan": 11444.81,
                "fev": 11444.81,
                "mar": 11444.81,
                "abr": 11444.81,
                "mai": 11444.81,
                "jun": 11444.81,
                "jul": 11444.81,
                "ago": 11444.81,
                "set": 11444.81,
                "out": 11444.81,
                "nov": 11444.81,
                "dez": 11444.81
            }];
        this.totalGerais = this.resultsTotalGerais;

        this.resultsTotalRateioDespesas =
            [{
                "jan": 831.39,
                "fev": 831.39,
                "mar": 831.39,
                "abr": 831.39,
                "mai": 831.39,
                "jun": 831.39,
                "jul": 831.39,
                "ago": 831.39,
                "set": 831.39,
                "out": 831.39,
                "nov": 831.39,
                "dez": 831.39
            }];
        this.totalRateioDepartamento = this.resultsTotalRateioDespesas;
    }
    //Total de Todos os Custo
    getTotalCustosDespesasInfantil() {
        this.resultsTotalCustoDespesaInfantil = [
            {
                "centro": 'Total',
                "jan": 56695.52,
                "fev": 56695.52,
                "mar": 56695.52,
                "abr": 56695.52,
                "mai": 56695.52,
                "jun": 56695.52,
                "jul": 56695.52,
                "ago": 56695.52,
                "set": 56695.52,
                "out": 56695.52,
                "nov": 56695.52,
                "dez": 56695.52
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaInfantil;
    }


    //Valores dos campos
    getFundI() {

        this.resultsReceitasFundI = [
            {
                "centro": 'Receita Liquida',
                "jan": 235000.40,
                "fev": 235000.40,
                "mar": 235000.40,
                "abr": 235000.40,
                "mai": 235000.40,
                "jun": 235000.40,
                "jul": 235000.40,
                "ago": 235000.40,
                "set": 235000.40,
                "out": 235000.40,
                "nov": 235000.40,
                "dez": 235000.40
            },
            {
                "centro": 'Imposto',
                "jan": 11750.02,
                "fev": 11750.02,
                "mar": 11750.02,
                "abr": 11750.02,
                "mai": 11750.02,
                "jun": 11750.02,
                "jul": 11750.02,
                "ago": 11750.02,
                "set": 11750.02,
                "out": 11750.02,
                "nov": 11750.02,
                "dez": 11750.02
            }];
        this.receitas = this.resultsReceitasFundI;

        this.resultsPessoalFundI = [
            {
                "centro": 'Salarios',
                "jan": 87207.11,
                "fev": 87207.11,
                "mar": 87207.11,
                "abr": 87207.11,
                "mai": 87207.11,
                "jun": 87207.11,
                "jul": 87207.11,
                "ago": 87207.11,
                "set": 87207.11,
                "out": 87207.11,
                "nov": 87207.11,
                "dez": 87207.11
            },
            {
                "centro": "Decimo Terceiro",
                "jan": 7267.26,
                "fev": 7267.26,
                "mar": 7267.26,
                "abr": 7267.26,
                "mai": 7267.26,
                "jun": 7267.26,
                "jul": 7267.26,
                "ago": 7267.26,
                "set": 7267.26,
                "out": 7267.26,
                "nov": 7267.26,
                "dez": 7267.26
            },
            {
                "centro": "1/3 Ferias",
                "jan": 2424.36,
                "fev": 2424.36,
                "mar": 2424.36,
                "abr": 2424.36,
                "mai": 2424.36,
                "jun": 2424.36,
                "jul": 2424.36,
                "ago": 2424.36,
                "set": 2424.36,
                "out": 2424.36,
                "nov": 2424.36,
                "dez": 2424.36
            },
            {
                "centro": "FGTS (8%)",
                "jan": 6976.57,
                "fev": 6976.57,
                "mar": 6976.57,
                "abr": 6976.57,
                "mai": 6976.57,
                "jun": 6976.57,
                "jul": 6976.57,
                "ago": 6976.57,
                "set": 6976.57,
                "out": 6976.57,
                "nov": 6976.57,
                "dez": 6976.57
            },
            {
                "centro": "PIS",
                "jan": 0.00,
                "fev": 0.00,
                "mar": 0.00,
                "abr": 0.00,
                "mai": 0.00,
                "jun": 0.00,
                "jul": 0.00,
                "ago": 0.00,
                "set": 0.00,
                "out": 0.00,
                "nov": 0.00,
                "dez": 0.00
            },
            {
                "centro": "Indenizacoes (2%)",
                "jan": 1744.14,
                "fev": 1744.14,
                "mar": 1744.14,
                "abr": 1744.14,
                "mai": 1744.14,
                "jun": 1744.14,
                "jul": 1744.14,
                "ago": 1744.14,
                "set": 1744.14,
                "out": 1744.14,
                "nov": 1744.14,
                "dez": 1744.14
            },
            {
                "centro": "Beneficios",
                "jan": 0.00,
                "fev": 0.00,
                "mar": 0.00,
                "abr": 0.00,
                "mai": 0.00,
                "jun": 0.00,
                "jul": 0.00,
                "ago": 0.00,
                "set": 0.00,
                "out": 0.00,
                "nov": 0.00,
                "dez": 0.00
            }];
        this.pessoal = this.resultsPessoalFundI;

        this.resultsMateriaisFundI = [
            {
                "centro": 'Brindes',
                "jan": 323.52,
                "fev": 323.52,
                "mar": 323.52,
                "abr": 323.52,
                "mai": 323.52,
                "jun": 323.52,
                "jul": 323.52,
                "ago": 323.52,
                "set": 323.52,
                "out": 323.52,
                "nov": 323.52,
                "dez": 323.52
            },
            {
                "centro": "Combustivel",
                "jan": 650.22,
                "fev": 650.22,
                "mar": 650.22,
                "abr": 650.22,
                "mai": 650.22,
                "jun": 650.22,
                "jul": 650.22,
                "ago": 650.22,
                "set": 650.22,
                "out": 650.22,
                "nov": 650.22,
                "dez": 650.22
            },
            {
                "centro": "Copa/Cozinha",
                "jan": 458.49,
                "fev": 458.49,
                "mar": 458.49,
                "abr": 458.49,
                "mai": 458.49,
                "jun": 458.49,
                "jul": 458.49,
                "ago": 458.49,
                "set": 458.49,
                "out": 458.49,
                "nov": 458.49,
                "dez": 458.49
            },
            {
                "centro": "Medicamentos",
                "jan": 9.92,
                "fev": 9.92,
                "mar": 9.92,
                "abr": 9.92,
                "mai": 9.92,
                "jun": 9.92,
                "jul": 9.92,
                "ago": 9.92,
                "set": 9.92,
                "out": 9.92,
                "nov": 9.92,
                "dez": 9.92
            },
            {
                "centro": "Graficas",
                "jan": 1230.98,
                "fev": 1230.98,
                "mar": 1230.98,
                "abr": 1230.98,
                "mai": 1230.98,
                "jun": 1230.98,
                "jul": 1230.98,
                "ago": 1230.98,
                "set": 1230.98,
                "out": 1230.98,
                "nov": 1230.98,
                "dez": 1230.98
            },
            {
                "centro": "Lanches/Refeicoes",
                "jan": 1463.95,
                "fev": 1463.95,
                "mar": 1463.95,
                "abr": 1463.95,
                "mai": 1463.95,
                "jun": 1463.95,
                "jul": 1463.95,
                "ago": 1463.95,
                "set": 1463.95,
                "out": 1463.95,
                "nov": 1463.95,
                "dez": 1463.95
            },
            {
                "centro": "Materiais Diversos",
                "jan": 311.39,
                "fev": 311.39,
                "mar": 311.39,
                "abr": 311.39,
                "mai": 311.39,
                "jun": 311.39,
                "jul": 311.39,
                "ago": 311.39,
                "set": 311.39,
                "out": 311.39,
                "nov": 311.39,
                "dez": 311.39
            },
            {
                "centro": "Materiais Expediente",
                "jan": 390.74,
                "fev": 390.74,
                "mar": 390.74,
                "abr": 390.74,
                "mai": 390.74,
                "jun": 390.74,
                "jul": 390.74,
                "ago": 390.74,
                "set": 390.74,
                "out": 390.74,
                "nov": 390.74,
                "dez": 390.74
            },
            {
                "centro": "Materiais Informatica",
                "jan": 442.61,
                "fev": 442.61,
                "mar": 442.61,
                "abr": 442.61,
                "mai": 442.61,
                "jun": 442.61,
                "jul": 442.61,
                "ago": 442.61,
                "set": 442.61,
                "out": 442.61,
                "nov": 442.61,
                "dez": 442.61
            },
            {
                "centro": "Materiais Pedagogico",
                "jan": 1947.61,
                "fev": 1947.61,
                "mar": 1947.61,
                "abr": 1947.61,
                "mai": 1947.61,
                "jun": 1947.61,
                "jul": 1947.61,
                "ago": 1947.61,
                "set": 1947.61,
                "out": 1947.61,
                "nov": 1947.61,
                "dez": 1947.61
            }];
        this.materiais = this.resultsMateriaisFundI;

        this.resultsIndiretosFundI = [
            {
                "centro": 'Arrendamento',
                "jan": 39696.14,
                "fev": 39696.14,
                "mar": 39696.14,
                "abr": 39696.14,
                "mai": 39696.14,
                "jun": 39696.14,
                "jul": 39696.14,
                "ago": 39696.14,
                "set": 39696.14,
                "out": 39696.14,
                "nov": 39696.14,
                "dez": 39696.14
            },
            {
                "centro": 'Energia Eletrica',
                "jan": 7145.31,
                "fev": 7145.31,
                "mar": 7145.31,
                "abr": 7145.31,
                "mai": 7145.31,
                "jun": 7145.31,
                "jul": 7145.31,
                "ago": 7145.31,
                "set": 7145.31,
                "out": 7145.31,
                "nov": 7145.31,
                "dez": 7145.31
            },
            {
                "centro": 'Telefone/Internet',
                "jan": 1389.36,
                "fev": 1389.36,
                "mar": 1389.36,
                "abr": 1389.36,
                "mai": 1389.36,
                "jun": 1389.36,
                "jul": 1389.36,
                "ago": 1389.36,
                "set": 1389.36,
                "out": 1389.36,
                "nov": 1389.36,
                "dez": 1389.36
            }];
        this.indiretos = this.resultsIndiretosFundI;

        this.resultsGeraisFundI = [
            {
                "centro": 'Alugueis',
                "jan": 26604.01,
                "fev": 26604.01,
                "mar": 26604.01,
                "abr": 26604.01,
                "mai": 26604.01,
                "jun": 26604.01,
                "jul": 26604.01,
                "ago": 26604.01,
                "set": 26604.01,
                "out": 26604.01,
                "nov": 26604.01,
                "dez": 26604.01
            },
            {
                "centro": 'Consultoria Contab.',
                "jan": 2500.86,
                "fev": 2500.86,
                "mar": 2500.86,
                "abr": 2500.86,
                "mai": 2500.86,
                "jun": 2500.86,
                "jul": 2500.86,
                "ago": 2500.86,
                "set": 2500.86,
                "out": 2500.86,
                "nov": 2500.86,
                "dez": 2500.86
            },
            {
                "centro": 'Depreciacao',
                "jan": 1761.07,
                "fev": 1761.07,
                "mar": 1761.07,
                "abr": 1761.07,
                "mai": 1761.07,
                "jun": 1761.07,
                "jul": 1761.07,
                "ago": 1761.07,
                "set": 1761.07,
                "out": 1761.07,
                "nov": 1761.07,
                "dez": 1761.07
            },
            {
                "centro": 'Despesa Bancaria',
                "jan": 4205.17,
                "fev": 4205.17,
                "mar": 4205.17,
                "abr": 4205.17,
                "mai": 4205.17,
                "jun": 4205.17,
                "jul": 4205.17,
                "ago": 4205.17,
                "set": 4205.17,
                "out": 4205.17,
                "nov": 4205.17,
                "dez": 4205.17
            },
            {
                "centro": 'Despesa Postais',
                "jan": 51.60,
                "fev": 51.60,
                "mar": 51.60,
                "abr": 51.60,
                "mai": 51.60,
                "jun": 51.60,
                "jul": 51.60,
                "ago": 51.60,
                "set": 51.60,
                "out": 51.60,
                "nov": 51.60,
                "dez": 51.60
            },
            {
                "centro": 'Sindicato',
                "jan": 467.62,
                "fev": 467.62,
                "mar": 467.62,
                "abr": 467.62,
                "mai": 467.62,
                "jun": 467.62,
                "jul": 467.62,
                "ago": 467.62,
                "set": 467.62,
                "out": 467.62,
                "nov": 467.62,
                "dez": 467.62
            },
            {
                "centro": 'Juros e Multa',
                "jan": 761.26,
                "fev": 761.26,
                "mar": 761.26,
                "abr": 761.26,
                "mai": 761.26,
                "jun": 761.26,
                "jul": 761.26,
                "ago": 761.26,
                "set": 761.26,
                "out": 761.26,
                "nov": 761.26,
                "dez": 761.26
            },
            {
                "centro": 'Licenca de Software',
                "jan": 1195.65,
                "fev": 1195.65,
                "mar": 1195.65,
                "abr": 1195.65,
                "mai": 1195.65,
                "jun": 1195.65,
                "jul": 1195.65,
                "ago": 1195.65,
                "set": 1195.65,
                "out": 1195.65,
                "nov": 1195.65,
                "dez": 1195.65
            },
            {
                "centro": 'Manutencao Maq.',
                "jan": 984.46,
                "fev": 984.46,
                "mar": 984.46,
                "abr": 984.46,
                "mai": 984.46,
                "jun": 984.46,
                "jul": 984.46,
                "ago": 984.46,
                "set": 984.46,
                "out": 984.46,
                "nov": 984.46,
                "dez": 984.46
            },
            {
                "centro": 'Manutencao Veiculos',
                "jan": 651.41,
                "fev": 651.41,
                "mar": 651.41,
                "abr": 651.41,
                "mai": 651.41,
                "jun": 651.41,
                "jul": 651.41,
                "ago": 651.41,
                "set": 651.41,
                "out": 651.41,
                "nov": 651.41,
                "dez": 651.41
            },
            {
                "centro": 'Manutencao Predial',
                "jan": 2975.05,
                "fev": 2975.05,
                "mar": 2975.05,
                "abr": 2975.05,
                "mai": 2975.05,
                "jun": 2975.05,
                "jul": 2975.05,
                "ago": 2975.05,
                "set": 2975.05,
                "out": 2975.05,
                "nov": 2975.05,
                "dez": 2975.05
            },
            {
                "centro": 'Patrocinios',
                "jan": 201.66,
                "fev": 201.66,
                "mar": 201.66,
                "abr": 201.66,
                "mai": 201.66,
                "jun": 201.66,
                "jul": 201.66,
                "ago": 201.66,
                "set": 201.66,
                "out": 201.66,
                "nov": 201.66,
                "dez": 201.66
            },
            {
                "centro": 'Propaganda',
                "jan": 478.28,
                "fev": 478.28,
                "mar": 478.28,
                "abr": 478.28,
                "mai": 478.28,
                "jun": 478.28,
                "jul": 478.28,
                "ago": 478.28,
                "set": 478.28,
                "out": 478.28,
                "nov": 478.28,
                "dez": 478.28
            },
            {
                "centro": 'Servicos PJ',
                "jan": 2510.38,
                "fev": 2510.38,
                "mar": 2510.38,
                "abr": 2510.38,
                "mai": 2510.38,
                "jun": 2510.38,
                "jul": 2510.38,
                "ago": 2510.38,
                "set": 2510.38,
                "out": 2510.38,
                "nov": 2510.38,
                "dez": 2510.38
            },
            {
                "centro": 'Taxas',
                "jan": 1032.10,
                "fev": 1032.10,
                "mar": 1032.10,
                "abr": 1032.10,
                "mai": 1032.10,
                "jun": 1032.10,
                "jul": 1032.10,
                "ago": 1032.10,
                "set": 1032.10,
                "out": 1032.10,
                "nov": 1032.10,
                "dez": 1032.10
            },
            {
                "centro": 'Comissoes',
                "jan": 1099.85,
                "fev": 1099.85,
                "mar": 1099.85,
                "abr": 1099.85,
                "mai": 1099.85,
                "jun": 1099.85,
                "jul": 1099.85,
                "ago": 1099.85,
                "set": 1099.85,
                "out": 1099.85,
                "nov": 1099.85,
                "dez": 1099.85
            },
            {
                "centro": 'Taxi',
                "jan": 15.88,
                "fev": 15.88,
                "mar": 15.88,
                "abr": 15.88,
                "mai": 15.88,
                "jun": 15.88,
                "jul": 15.88,
                "ago": 15.88,
                "set": 15.88,
                "out": 15.88,
                "nov": 15.88,
                "dez": 15.88
            },
            {
                "centro": 'Depreciacao Equi.',
                "jan": 5920.93,
                "fev": 5920.93,
                "mar": 5920.93,
                "abr": 5920.93,
                "mai": 5920.93,
                "jun": 5920.93,
                "jul": 5920.93,
                "ago": 5920.93,
                "set": 5920.93,
                "out": 5920.93,
                "nov": 5920.93,
                "dez": 5920.93
            }];
        this.gerais = this.resultsGeraisFundI;

        this.resultsRateioDepartamentoFundI = [
            {
                "centro": 'Diretoria',
                "jan": 457.01,
                "fev": 457.01,
                "mar": 457.01,
                "abr": 457.01,
                "mai": 457.01,
                "jun": 457.01,
                "jul": 457.01,
                "ago": 457.01,
                "set": 457.01,
                "out": 457.01,
                "nov": 457.01,
                "dez": 457.01
            },
            {
                "centro": 'Financeiro',
                "jan": 355.12,
                "fev": 355.12,
                "mar": 355.12,
                "abr": 355.12,
                "mai": 355.12,
                "jun": 355.12,
                "jul": 355.12,
                "ago": 355.12,
                "set": 355.12,
                "out": 355.12,
                "nov": 355.12,
                "dez": 355.12
            },
            {
                "centro": 'Marketing',
                "jan": 209.97,
                "fev": 209.97,
                "mar": 209.97,
                "abr": 209.97,
                "mai": 209.97,
                "jun": 209.97,
                "jul": 209.97,
                "ago": 209.97,
                "set": 209.97,
                "out": 209.97,
                "nov": 209.97,
                "dez": 209.97
            },
            {
                "centro": 'Administracao',
                "jan": 521.75,
                "fev": 521.75,
                "mar": 521.75,
                "abr": 521.75,
                "mai": 521.75,
                "jun": 521.75,
                "jul": 521.75,
                "ago": 521.75,
                "set": 521.75,
                "out": 521.75,
                "nov": 521.75,
                "dez": 521.75
            }];
        this.rateioDepartamento = this.resultsRateioDepartamentoFundI;

        this.resultsTotalCustoDespesaFundI = [
            {
                "centro": 'Total',
                "jan": 215020.78,
                "fev": 215020.78,
                "mar": 215020.78,
                "abr": 215020.78,
                "mai": 215020.78,
                "jun": 215020.78,
                "jul": 215020.78,
                "ago": 215020.78,
                "set": 215020.78,
                "out": 215020.78,
                "nov": 215020.78,
                "dez": 215020.78
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaFundI;
    }
    //Total de cada Custo
    getTotalFundI() {
        this.resultsTotalReceitas =
            [{
                "jan": 233250.38,
                "fev": 233250.38,
                "mar": 233250.38,
                "abr": 233250.38,
                "mai": 233250.38,
                "jun": 233250.38,
                "jul": 233250.38,
                "ago": 233250.38,
                "set": 233250.38,
                "out": 233250.38,
                "nov": 233250.38,
                "dez": 233250.38
            }];
        this.totalReceitas = this.resultsTotalReceitas;

        this.resultsTotalPessoal =
            [{
                "jan": 105619.43,
                "fev": 105619.43,
                "mar": 105619.43,
                "abr": 105619.43,
                "mai": 105619.43,
                "jun": 105619.43,
                "jul": 105619.43,
                "ago": 105619.43,
                "set": 105619.43,
                "out": 105619.43,
                "nov": 105619.43,
                "dez": 105619.43
            }];
        this.totalPessoal = this.resultsTotalPessoal;

        this.resultsTotalMateriais =
            [{
                "jan": 7229.44,
                "fev": 7229.44,
                "mar": 7229.44,
                "abr": 7229.44,
                "mai": 7229.44,
                "jun": 7229.44,
                "jul": 7229.44,
                "ago": 7229.44,
                "set": 7229.44,
                "out": 7229.44,
                "nov": 7229.44,
                "dez": 7229.44
            }];
        this.totalMateriais = this.resultsTotalMateriais;

        this.resultsTotalIndiretos =
            [{
                "jan": 48230.81,
                "fev": 48230.81,
                "mar": 48230.81,
                "abr": 48230.81,
                "mai": 48230.81,
                "jun": 48230.81,
                "jul": 48230.81,
                "ago": 48230.81,
                "set": 48230.81,
                "out": 48230.81,
                "nov": 48230.81,
                "dez": 48230.81
            }];
        this.totalIndiretos = this.resultsTotalIndiretos;

        this.resultsTotalGerais =
            [{
                "jan": 52417.25,
                "fev": 52417.25,
                "mar": 52417.25,
                "abr": 52417.25,
                "mai": 52417.25,
                "jun": 52417.25,
                "jul": 52417.25,
                "ago": 52417.25,
                "set": 52417.25,
                "out": 52417.25,
                "nov": 52417.25,
                "dez": 52417.25
            }];
        this.totalGerais = this.resultsTotalGerais;

        this.resultsTotalRateioDespesas =
            [{
                "jan": 1523.85,
                "fev": 1523.85,
                "mar": 1523.85,
                "abr": 1523.85,
                "mai": 1523.85,
                "jun": 1523.85,
                "jul": 1523.85,
                "ago": 1523.85,
                "set": 1523.85,
                "out": 1523.85,
                "nov": 1523.85,
                "dez": 1523.85
            }];
        this.totalRateioDepartamento = this.resultsTotalRateioDespesas;
    }
    //Total de Todos os Custo
    getTotalCustoDespesasFundI() {
        this.resultsTotalCustoDespesaFundI = [
            {
                "centro": 'Total',
                "jan": 215020.78,
                "fev": 215020.78,
                "mar": 215020.78,
                "abr": 215020.78,
                "mai": 215020.78,
                "jun": 215020.78,
                "jul": 215020.78,
                "ago": 215020.78,
                "set": 215020.78,
                "out": 215020.78,
                "nov": 215020.78,
                "dez": 215020.78
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaFundI;
    }


    //Valores dos campos
    getFundII() {

        this.resultsReceitasFundII = [
            {
                "centro": 'Receita Liquida',
                "jan": 182318.17,
                "fev": 182318.17,
                "mar": 182318.17,
                "abr": 182318.17,
                "mai": 182318.17,
                "jun": 182318.17,
                "jul": 182318.17,
                "ago": 182318.17,
                "set": 182318.17,
                "out": 182318.17,
                "nov": 182318.17,
                "dez": 182318.17
            },
            {
                "centro": 'Imposto',
                "jan": 30994.09,
                "fev": 30994.09,
                "mar": 30994.09,
                "abr": 30994.09,
                "mai": 30994.09,
                "jun": 30994.09,
                "jul": 30994.09,
                "ago": 30994.09,
                "set": 30994.09,
                "out": 30994.09,
                "nov": 30994.09,
                "dez": 30994.09
            }];
        this.receitas = this.resultsReceitasFundII;

        this.resultsPessoalFundII = [
            {
                "centro": 'Salarios',
                "jan": 63894.37,
                "fev": 63894.37,
                "mar": 63894.37,
                "abr": 63894.37,
                "mai": 63894.37,
                "jun": 63894.37,
                "jul": 63894.37,
                "ago": 63894.37,
                "set": 63894.37,
                "out": 63894.37,
                "nov": 63894.37,
                "dez": 63894.37
            },
            {
                "centro": "Decimo Terceiro",
                "jan": 5324.53,
                "fev": 5324.53,
                "mar": 5324.53,
                "abr": 5324.53,
                "mai": 5324.53,
                "jun": 5324.53,
                "jul": 5324.53,
                "ago": 5324.53,
                "set": 5324.53,
                "out": 5324.53,
                "nov": 5324.53,
                "dez": 5324.53
            },
            {
                "centro": "1/3 Ferias",
                "jan": 1776.26,
                "fev": 1776.26,
                "mar": 1776.26,
                "abr": 1776.26,
                "mai": 1776.26,
                "jun": 1776.26,
                "jul": 1776.26,
                "ago": 1776.26,
                "set": 1776.26,
                "out": 1776.26,
                "nov": 1776.26,
                "dez": 1776.26
            },
            {
                "centro": "FGTS (8%)",
                "jan": 5111.55,
                "fev": 5111.55,
                "mar": 5111.55,
                "abr": 5111.55,
                "mai": 5111.55,
                "jun": 5111.55,
                "jul": 5111.55,
                "ago": 5111.55,
                "set": 5111.55,
                "out": 5111.55,
                "nov": 5111.55,
                "dez": 5111.55
            },
            {
                "centro": "PIS",
                "jan": 1277.89,
                "fev": 1277.89,
                "mar": 1277.89,
                "abr": 1277.89,
                "mai": 1277.89,
                "jun": 1277.89,
                "jul": 1277.89,
                "ago": 1277.89,
                "set": 1277.89,
                "out": 1277.89,
                "nov": 1277.89,
                "dez": 1277.89
            },
            {
                "centro": "Indenizacoes (2%)",
                "jan": 1277.89,
                "fev": 1277.89,
                "mar": 1277.89,
                "abr": 1277.89,
                "mai": 1277.89,
                "jun": 1277.89,
                "jul": 1277.89,
                "ago": 1277.89,
                "set": 1277.89,
                "out": 1277.89,
                "nov": 1277.89,
                "dez": 1277.89
            },
            {
                "centro": "Beneficios",
                "jan": 0.00,
                "fev": 0.00,
                "mar": 0.00,
                "abr": 0.00,
                "mai": 0.00,
                "jun": 0.00,
                "jul": 0.00,
                "ago": 0.00,
                "set": 0.00,
                "out": 0.00,
                "nov": 0.00,
                "dez": 0.00
            }];
        this.pessoal = this.resultsPessoalFundII;

        this.resultsMateriaisFundII = [
            {
                "centro": 'Brindes',
                "jan": 197.79,
                "fev": 197.79,
                "mar": 197.79,
                "abr": 197.79,
                "mai": 197.79,
                "jun": 197.79,
                "jul": 197.79,
                "ago": 197.79,
                "set": 197.79,
                "out": 197.79,
                "nov": 197.79,
                "dez": 197.79
            },
            {
                "centro": "Combustivel",
                "jan": 397.52,
                "fev": 397.52,
                "mar": 397.52,
                "abr": 397.52,
                "mai": 397.52,
                "jun": 397.52,
                "jul": 397.52,
                "ago": 397.52,
                "set": 397.52,
                "out": 397.52,
                "nov": 397.52,
                "dez": 397.52
            },
            {
                "centro": "Copa/Cozinha",
                "jan": 280.30,
                "fev": 280.30,
                "mar": 280.30,
                "abr": 280.30,
                "mai": 280.30,
                "jun": 280.30,
                "jul": 280.30,
                "ago": 280.30,
                "set": 280.30,
                "out": 280.30,
                "nov": 280.30,
                "dez": 280.30
            },
            {
                "centro": "Medicamentos",
                "jan": 6.07,
                "fev": 6.07,
                "mar": 6.07,
                "abr": 6.07,
                "mai": 6.07,
                "jun": 6.07,
                "jul": 6.07,
                "ago": 6.07,
                "set": 6.07,
                "out": 6.07,
                "nov": 6.07,
                "dez": 6.07
            },
            {
                "centro": "Graficas",
                "jan": 752.56,
                "fev": 752.56,
                "mar": 752.56,
                "abr": 752.56,
                "mai": 752.56,
                "jun": 752.56,
                "jul": 752.56,
                "ago": 752.56,
                "set": 752.56,
                "out": 752.56,
                "nov": 752.56,
                "dez": 752.56
            },
            {
                "centro": "Lanches/Refeicoes",
                "jan": 894.99,
                "fev": 894.99,
                "mar": 894.99,
                "abr": 894.99,
                "mai": 894.99,
                "jun": 894.99,
                "jul": 894.99,
                "ago": 894.99,
                "set": 894.99,
                "out": 894.99,
                "nov": 894.99,
                "dez": 894.99
            },
            {
                "centro": "Materiais Diversos",
                "jan": 190.37,
                "fev": 190.37,
                "mar": 190.37,
                "abr": 190.37,
                "mai": 190.37,
                "jun": 190.37,
                "jul": 190.37,
                "ago": 190.37,
                "set": 190.37,
                "out": 190.37,
                "nov": 190.37,
                "dez": 190.37
            },
            {
                "centro": "Materiais Expediente",
                "jan": 238.88,
                "fev": 238.88,
                "mar": 238.88,
                "abr": 238.88,
                "mai": 238.88,
                "jun": 238.88,
                "jul": 238.88,
                "ago": 238.88,
                "set": 238.88,
                "out": 238.88,
                "nov": 238.88,
                "dez": 238.88
            },
            {
                "centro": "Materiais Informatica",
                "jan": 270.59,
                "fev": 270.59,
                "mar": 270.59,
                "abr": 270.59,
                "mai": 270.59,
                "jun": 270.59,
                "jul": 270.59,
                "ago": 270.59,
                "set": 270.59,
                "out": 270.59,
                "nov": 270.59,
                "dez": 270.59
            },
            {
                "centro": "Materiais Pedagogico",
                "jan": 1190.68,
                "fev": 1190.68,
                "mar": 1190.68,
                "abr": 1190.68,
                "mai": 1190.68,
                "jun": 1190.68,
                "jul": 1190.68,
                "ago": 1190.68,
                "set": 1190.68,
                "out": 1190.68,
                "nov": 1190.68,
                "dez": 1190.68
            }];
        this.materiais = this.resultsMateriaisFundII;

        this.resultsGeraisFundII = [
            {
                "centro": 'Alugueis',
                "jan": 15653.11,
                "fev": 15653.11,
                "mar": 15653.11,
                "abr": 15653.11,
                "mai": 15653.11,
                "jun": 15653.11,
                "jul": 15653.11,
                "ago": 15653.11,
                "set": 15653.11,
                "out": 15653.11,
                "nov": 15653.11,
                "dez": 15653.11
            },
            {
                "centro": 'Consultoria Contab.',
                "jan": 1528.91,
                "fev": 1528.91,
                "mar": 1528.91,
                "abr": 1528.91,
                "mai": 1528.91,
                "jun": 1528.91,
                "jul": 1528.91,
                "ago": 1528.91,
                "set": 1528.91,
                "out": 1528.91,
                "nov": 1528.91,
                "dez": 1528.91
            },
            {
                "centro": 'Depreciacao',
                "jan": 1076.64,
                "fev": 1076.64,
                "mar": 1076.64,
                "abr": 1076.64,
                "mai": 1076.64,
                "jun": 1076.64,
                "jul": 1076.64,
                "ago": 1076.64,
                "set": 1076.64,
                "out": 1076.64,
                "nov": 1076.64,
                "dez": 1076.64
            },
            {
                "centro": 'Despesa Bancaria',
                "jan": 2570.85,
                "fev": 2570.85,
                "mar": 2570.85,
                "abr": 2570.85,
                "mai": 2570.85,
                "jun": 2570.85,
                "jul": 2570.85,
                "ago": 2570.85,
                "set": 2570.85,
                "out": 2570.85,
                "nov": 2570.85,
                "dez": 2570.85
            },
            {
                "centro": 'Despesa Postais',
                "jan": 31.55,
                "fev": 31.55,
                "mar": 31.55,
                "abr": 31.55,
                "mai": 31.55,
                "jun": 31.55,
                "jul": 31.55,
                "ago": 31.55,
                "set": 31.55,
                "out": 31.55,
                "nov": 31.55,
                "dez": 31.55
            },
            {
                "centro": 'Sindicato',
                "jan": 285.88,
                "fev": 285.88,
                "mar": 285.88,
                "abr": 285.88,
                "mai": 285.88,
                "jun": 285.88,
                "jul": 285.88,
                "ago": 285.88,
                "set": 285.88,
                "out": 285.88,
                "nov": 285.88,
                "dez": 285.88
            },
            {
                "centro": 'Juros e Multa',
                "jan": 465.40,
                "fev": 465.40,
                "mar": 465.40,
                "abr": 465.40,
                "mai": 465.40,
                "jun": 465.40,
                "jul": 465.40,
                "ago": 465.40,
                "set": 465.40,
                "out": 465.40,
                "nov": 465.40,
                "dez": 465.40
            },
            {
                "centro": 'Licenca de Software',
                "jan": 730.96,
                "fev": 730.96,
                "mar": 730.96,
                "abr": 730.96,
                "mai": 730.96,
                "jun": 730.96,
                "jul": 730.96,
                "ago": 730.96,
                "set": 730.96,
                "out": 730.96,
                "nov": 730.96,
                "dez": 730.96
            },
            {
                "centro": 'Manutencao Maq.',
                "jan": 601.86,
                "fev": 601.86,
                "mar": 601.86,
                "abr": 601.86,
                "mai": 601.86,
                "jun": 601.86,
                "jul": 601.86,
                "ago": 601.86,
                "set": 601.86,
                "out": 601.86,
                "nov": 601.86,
                "dez": 601.86
            },
            {
                "centro": 'Manutencao Veiculos',
                "jan": 398.24,
                "fev": 398.24,
                "mar": 398.24,
                "abr": 398.24,
                "mai": 398.24,
                "jun": 398.24,
                "jul": 398.24,
                "ago": 398.24,
                "set": 398.24,
                "out": 398.24,
                "nov": 398.24,
                "dez": 398.24
            },
            {
                "centro": 'Manutencao Predial',
                "jan": 1818.81,
                "fev": 1818.81,
                "mar": 1818.81,
                "abr": 1818.81,
                "mai": 1818.81,
                "jun": 1818.81,
                "jul": 1818.81,
                "ago": 1818.81,
                "set": 1818.81,
                "out": 1818.81,
                "nov": 1818.81,
                "dez": 1818.81
            },
            {
                "centro": 'Patrocinios',
                "jan": 123.28,
                "fev": 123.28,
                "mar": 123.28,
                "abr": 123.28,
                "mai": 123.28,
                "jun": 123.28,
                "jul": 123.28,
                "ago": 123.28,
                "set": 123.28,
                "out": 123.28,
                "nov": 123.28,
                "dez": 123.28
            },
            {
                "centro": 'Propaganda',
                "jan": 292.40,
                "fev": 292.40,
                "mar": 292.40,
                "abr": 292.40,
                "mai": 292.40,
                "jun": 292.40,
                "jul": 292.40,
                "ago": 292.40,
                "set": 292.40,
                "out": 292.40,
                "nov": 292.40,
                "dez": 292.40
            },
            {
                "centro": 'Servicos PJ',
                "jan": 1537.73,
                "fev": 1537.73,
                "mar": 1537.73,
                "abr": 1537.73,
                "mai": 1537.73,
                "jun": 1537.73,
                "jul": 1537.73,
                "ago": 1537.73,
                "set": 1537.73,
                "out": 1537.73,
                "nov": 1537.73,
                "dez": 1537.73
            },
            {
                "centro": 'Taxas',
                "jan": 630.98,
                "fev": 630.98,
                "mar": 630.98,
                "abr": 630.98,
                "mai": 630.98,
                "jun": 630.98,
                "jul": 630.98,
                "ago": 630.98,
                "set": 630.98,
                "out": 630.98,
                "nov": 630.98,
                "dez": 630.98
            },
            {
                "centro": 'Comissoes',
                "jan": 672.40,
                "fev": 672.40,
                "mar": 672.40,
                "abr": 672.40,
                "mai": 672.40,
                "jun": 672.40,
                "jul": 672.40,
                "ago": 672.40,
                "set": 672.40,
                "out": 672.40,
                "nov": 672.40,
                "dez": 672.40
            },
            {
                "centro": 'Taxi',
                "jan": 9.71,
                "fev": 9.71,
                "mar": 9.71,
                "abr": 9.71,
                "mai": 9.71,
                "jun": 9.71,
                "jul": 9.71,
                "ago": 9.71,
                "set": 9.71,
                "out": 9.71,
                "nov": 9.71,
                "dez": 9.71
            },
            {
                "centro": 'Depreciacao Equi.',
                "jan": 3619.78,
                "fev": 3619.78,
                "mar": 3619.78,
                "abr": 3619.78,
                "mai": 3619.78,
                "jun": 3619.78,
                "jul": 3619.78,
                "ago": 3619.78,
                "set": 3619.78,
                "out": 3619.78,
                "nov": 3619.78,
                "dez": 3619.78
            }];
        this.gerais = this.resultsGeraisFundII;

        this.resultsIndiretosFundII = [
            {
                "centro": 'Arrendamento',
                "jan": 24268.38,
                "fev": 24268.38,
                "mar": 24268.38,
                "abr": 24268.38,
                "mai": 24268.38,
                "jun": 24268.38,
                "jul": 24268.38,
                "ago": 24268.38,
                "set": 24268.38,
                "out": 24268.38,
                "nov": 24268.38,
                "dez": 24268.38
            },
            {
                "centro": 'Energia Eletrica',
                "jan": 4368.31,
                "fev": 4368.31,
                "mar": 4368.31,
                "abr": 4368.31,
                "mai": 4368.31,
                "jun": 4368.31,
                "jul": 4368.31,
                "ago": 4368.31,
                "set": 4368.31,
                "out": 4368.31,
                "nov": 4368.31,
                "dez": 4368.31
            },
            {
                "centro": 'Telefone/Internet',
                "jan": 849.39,
                "fev": 849.39,
                "mar": 849.39,
                "abr": 849.39,
                "mai": 849.39,
                "jun": 849.39,
                "jul": 849.39,
                "ago": 849.39,
                "set": 849.39,
                "out": 849.39,
                "nov": 849.39,
                "dez": 849.39
            }];
        this.indiretos = this.resultsIndiretosFundII;

        this.resultsRateioDepartamentoFundII = [
            {
                "centro": 'Diretoria',
                "jan": 357.67,
                "fev": 357.67,
                "mar": 357.67,
                "abr": 357.67,
                "mai": 357.67,
                "jun": 357.67,
                "jul": 357.67,
                "ago": 357.67,
                "set": 357.67,
                "out": 357.67,
                "nov": 357.67,
                "dez": 357.67
            },
            {
                "centro": 'Financeiro',
                "jan": 378.55,
                "fev": 378.55,
                "mar": 378.55,
                "abr": 378.55,
                "mai": 378.55,
                "jun": 378.55,
                "jul": 378.55,
                "ago": 378.55,
                "set": 378.55,
                "out": 378.55,
                "nov": 378.55,
                "dez": 378.55
            },
            {
                "centro": 'Marketing',
                "jan": 200.14,
                "fev": 200.14,
                "mar": 200.14,
                "abr": 200.14,
                "mai": 200.14,
                "jun": 200.14,
                "jul": 200.14,
                "ago": 200.14,
                "set": 200.14,
                "out": 200.14,
                "nov": 200.14,
                "dez": 200.14
            },
            {
                "centro": 'Administracao',
                "jan": 501.11,
                "fev": 501.11,
                "mar": 501.11,
                "abr": 501.11,
                "mai": 501.11,
                "jun": 501.11,
                "jul": 501.11,
                "ago": 501.11,
                "set": 501.11,
                "out": 501.11,
                "nov": 501.11,
                "dez": 501.11
            }];
        this.rateioDepartamento = this.resultsRateioDepartamentoFundII;

        this.resultsTotalCustoDespesaFundII = [
            {
                "centro": 'Total',
                "jan": 146051.27,
                "fev": 146051.27,
                "mar": 146051.27,
                "abr": 146051.27,
                "mai": 146051.27,
                "jun": 146051.27,
                "jul": 146051.27,
                "ago": 146051.27,
                "set": 146051.27,
                "out": 146051.27,
                "nov": 146051.27,
                "dez": 146051.27
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaFundII;
    }
    //Total de Cada Custo
    getTotalFundII() {
        this.resultsTotalReceitas =
            [{
                "jan": 151324.08,
                "fev": 151324.08,
                "mar": 151324.08,
                "abr": 151324.08,
                "mai": 151324.08,
                "jun": 151324.08,
                "jul": 151324.08,
                "ago": 151324.08,
                "set": 151324.08,
                "out": 151324.08,
                "nov": 151324.08,
                "dez": 151324.08
            }];
        this.totalReceitas = this.resultsTotalReceitas;

        this.resultsTotalPessoal =
            [{
                "jan": 78662.49,
                "fev": 78662.49,
                "mar": 78662.49,
                "abr": 78662.49,
                "mai": 78662.49,
                "jun": 78662.49,
                "jul": 78662.49,
                "ago": 78662.49,
                "set": 78662.49,
                "out": 78662.49,
                "nov": 78662.49,
                "dez": 78662.49
            }];
        this.totalPessoal = this.resultsTotalPessoal;

        this.resultsTotalMateriais =
            [{
                "jan": 4419.74,
                "fev": 4419.74,
                "mar": 4419.74,
                "abr": 4419.74,
                "mai": 4419.74,
                "jun": 4419.74,
                "jul": 4419.74,
                "ago": 4419.74,
                "set": 4419.74,
                "out": 4419.74,
                "nov": 4419.74,
                "dez": 4419.74
            }];
        this.totalMateriais = this.resultsTotalMateriais;

        this.resultsTotalIndiretos =
            [{
                "jan": 29486.08,
                "fev": 29486.08,
                "mar": 29486.08,
                "abr": 29486.08,
                "mai": 29486.08,
                "jun": 29486.08,
                "jul": 29486.08,
                "ago": 29486.08,
                "set": 29486.08,
                "out": 29486.08,
                "nov": 29486.08,
                "dez": 29486.08
            }];
        this.totalIndiretos = this.resultsTotalIndiretos;

        this.resultsTotalGerais =
            [{
                "jan": 32045.48,
                "fev": 32045.48,
                "mar": 32045.48,
                "abr": 32045.48,
                "mai": 32045.48,
                "jun": 32045.48,
                "jul": 32045.48,
                "ago": 32045.48,
                "set": 32045.48,
                "out": 32045.48,
                "nov": 32045.48,
                "dez": 32045.48
            }];
        this.totalGerais = this.resultsTotalGerais;

        this.resultsTotalRateioDespesas =
            [{
                "jan": 1437.47,
                "fev": 1437.47,
                "mar": 1437.47,
                "abr": 1437.47,
                "mai": 1437.47,
                "jun": 1437.47,
                "jul": 1437.47,
                "ago": 1437.47,
                "set": 1437.47,
                "out": 1437.47,
                "nov": 1437.47,
                "dez": 1437.47
            }];
        this.totalRateioDepartamento = this.resultsTotalRateioDespesas;
    }
    //Total de Todos os Custo
    getTotalCustoDespesasFundII() {
        this.resultsTotalCustoDespesaFundII = [
            {
                "centro": 'Total',
                "jan": 146051.27,
                "fev": 146051.27,
                "mar": 146051.27,
                "abr": 146051.27,
                "mai": 146051.27,
                "jun": 146051.27,
                "jul": 146051.27,
                "ago": 146051.27,
                "set": 146051.27,
                "out": 146051.27,
                "nov": 146051.27,
                "dez": 146051.27
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaFundII;
    }


    //Valores dos campos
    getMedio() {
        this.resultsReceitasMedio = [
            {
                "centro": 'Receita Liquida',
                "jan": 139993.35,
                "fev": 139993.35,
                "mar": 139993.35,
                "abr": 139993.35,
                "mai": 139993.35,
                "jun": 139993.35,
                "jul": 139993.35,
                "ago": 139993.35,
                "set": 139993.35,
                "out": 139993.35,
                "nov": 139993.35,
                "dez": 139993.35
            },
            {
                "centro": 'Imposto',
                "jan": 23798.87,
                "fev": 23798.87,
                "mar": 23798.87,
                "abr": 23798.87,
                "mai": 23798.87,
                "jun": 23798.87,
                "jul": 23798.87,
                "ago": 23798.87,
                "set": 23798.87,
                "out": 23798.87,
                "nov": 23798.87,
                "dez": 23798.87
            }];
        this.receitas = this.resultsReceitasMedio;

        this.resultsPessoalMedio = [
            {
                "centro": 'Salarios',
                "jan": 43180.88,
                "fev": 43180.88,
                "mar": 43180.88,
                "abr": 43180.88,
                "mai": 43180.88,
                "jun": 43180.88,
                "jul": 43180.88,
                "ago": 43180.88,
                "set": 43180.88,
                "out": 43180.88,
                "nov": 43180.88,
                "dez": 43180.88
            },
            {
                "centro": "Decimo Terceiro",
                "jan": 3598.41,
                "fev": 3598.41,
                "mar": 3598.41,
                "abr": 3598.41,
                "mai": 3598.41,
                "jun": 3598.41,
                "jul": 3598.41,
                "ago": 3598.41,
                "set": 3598.41,
                "out": 3598.41,
                "nov": 3598.41,
                "dez": 3598.41
            },
            {
                "centro": "1/3 Ferias",
                "jan": 1200.41,
                "fev": 1200.41,
                "mar": 1200.41,
                "abr": 1200.41,
                "mai": 1200.41,
                "jun": 1200.41,
                "jul": 1200.41,
                "ago": 1200.41,
                "set": 1200.41,
                "out": 1200.41,
                "nov": 1200.41
            },
            {
                "centro": "FGTS (8%)",
                "jan": 3454.47,
                "fev": 3454.47,
                "mar": 3454.47,
                "abr": 3454.47,
                "mai": 3454.47,
                "jun": 3454.47,
                "jul": 3454.47,
                "ago": 3454.47,
                "set": 3454.47,
                "out": 3454.47,
                "nov": 3454.47,
                "dez": 3454.47
            },
            {
                "centro": "PIS",
                "jan": 0,
                "fev": 0,
                "mar": 0,
                "abr": 0,
                "mai": 0,
                "jun": 0,
                "jul": 0,
                "ago": 0,
                "set": 0,
                "out": 0,
                "nov": 0,
                "dez": 0
            },
            {
                "centro": "Indenizacoes (2%)",
                "jan": 863.62,
                "fev": 863.62,
                "mar": 863.62,
                "abr": 863.62,
                "mai": 863.62,
                "jun": 863.62,
                "jul": 863.62,
                "ago": 863.62,
                "set": 863.62,
                "out": 863.62,
                "nov": 863.62,
                "dez": 863.62
            },
            {
                "centro": "Beneficios",
                "jan": 0.00,
                "fev": 0.00,
                "mar": 0.00,
                "abr": 0.00,
                "mai": 0.00,
                "jun": 0.00,
                "jul": 0.00,
                "ago": 0.00,
                "set": 0.00,
                "out": 0.00,
                "nov": 0.00,
                "dez": 0.00
            }];
        this.pessoal = this.resultsPessoalMedio;

        this.resultsMateriaisMedio = [
            {
                "centro": 'Brindes',
                "jan": 176.60,
                "fev": 176.60,
                "mar": 176.60,
                "abr": 176.60,
                "mai": 176.60,
                "jun": 176.60,
                "jul": 176.60,
                "ago": 176.60,
                "set": 176.60,
                "out": 176.60,
                "nov": 176.60,
                "dez": 176.60
            },
            {
                "centro": "Combustivel",
                "jan": 354.93,
                "fev": 354.93,
                "mar": 354.93,
                "abr": 354.93,
                "mai": 354.93,
                "jun": 354.93,
                "jul": 354.93,
                "ago": 354.93,
                "set": 354.93,
                "out": 354.93,
                "nov": 354.93,
                "dez": 354.93
            },
            {
                "centro": "Copa/Cozinha",
                "jan": 250.27,
                "fev": 250.27,
                "mar": 250.27,
                "abr": 250.27,
                "mai": 250.27,
                "jun": 250.27,
                "jul": 250.27,
                "ago": 250.27,
                "set": 250.27,
                "out": 250.27,
                "nov": 250.27,
                "dez": 250.27
            },
            {
                "centro": "Medicamentos",
                "jan": 5.42,
                "fev": 5.42,
                "mar": 5.42,
                "abr": 5.42,
                "mai": 5.42,
                "jun": 5.42,
                "jul": 5.42,
                "ago": 5.42,
                "set": 5.42,
                "out": 5.42,
                "nov": 5.42,
                "dez": 5.42
            },
            {
                "centro": "Graficas",
                "jan": 671.93,
                "fev": 671.93,
                "mar": 671.93,
                "abr": 671.93,
                "mai": 671.93,
                "jun": 671.93,
                "jul": 671.93,
                "ago": 671.93,
                "set": 671.93,
                "out": 671.93,
                "nov": 671.93,
                "dez": 671.93
            },
            {
                "centro": "Lanches/Refeicoes",
                "jan": 799.10,
                "fev": 799.10,
                "mar": 799.10,
                "abr": 799.10,
                "mai": 799.10,
                "jun": 799.10,
                "jul": 799.10,
                "ago": 799.10,
                "set": 799.10,
                "out": 799.10,
                "nov": 799.10,
                "dez": 799.10
            },
            {
                "centro": "Materiais Diversos",
                "jan": 169.97,
                "fev": 169.97,
                "mar": 169.97,
                "abr": 169.97,
                "mai": 169.97,
                "jun": 169.97,
                "jul": 169.97,
                "ago": 169.97,
                "set": 169.97,
                "out": 169.97,
                "nov": 169.97,
                "dez": 169.97
            },
            {
                "centro": "Materiais Expediente",
                "jan": 213.29,
                "fev": 213.29,
                "mar": 213.29,
                "abr": 213.29,
                "mai": 213.29,
                "jun": 213.29,
                "jul": 213.29,
                "ago": 213.29,
                "set": 213.29,
                "out": 213.29,
                "nov": 213.29,
                "dez": 213.29
            },
            {
                "centro": "Materiais Informatica",
                "jan": 241.29,
                "fev": 241.29,
                "mar": 241.29,
                "abr": 241.29,
                "mai": 241.29,
                "jun": 241.29,
                "jul": 241.29,
                "ago": 241.29,
                "set": 241.29,
                "out": 241.29,
                "nov": 241.29,
                "dez": 241.29
            },
            {
                "centro": "Materiais Pedagogico",
                "jan": 1063.11,
                "fev": 1063.11,
                "mar": 1063.11,
                "abr": 1063.11,
                "mai": 1063.11,
                "jun": 1063.11,
                "jul": 1063.11,
                "ago": 1063.11,
                "set": 1063.11,
                "out": 1063.11,
                "nov": 1063.11,
                "dez": 1063.11
            }];
        this.materiais = this.resultsMateriaisMedio;

        this.resultsIndiretosMedio = [
            {
                "centro": 'Arrendamento',
                "jan": 21668.20,
                "fev": 21668.20,
                "mar": 21668.20,
                "abr": 21668.20,
                "mai": 21668.20,
                "jun": 21668.20,
                "jul": 21668.20,
                "ago": 21668.20,
                "set": 21668.20,
                "out": 21668.20,
                "nov": 21668.20,
                "dez": 21668.20
            },
            {
                "centro": 'Energia Eletrica',
                "jan": 3900.28,
                "fev": 3900.28,
                "mar": 3900.28,
                "abr": 3900.28,
                "mai": 3900.28,
                "jun": 3900.28,
                "jul": 3900.28,
                "ago": 3900.28,
                "set": 3900.28,
                "out": 3900.28,
                "nov": 3900.28,
                "dez": 3900.28
            },
            {
                "centro": 'Telefone/Internet',
                "jan": 758.39,
                "fev": 758.39,
                "mar": 758.39,
                "abr": 758.39,
                "mai": 758.39,
                "jun": 758.39,
                "jul": 758.39,
                "ago": 758.39,
                "set": 758.39,
                "out": 758.39,
                "nov": 758.39,
                "dez": 758.39
            }];
        this.indiretos = this.resultsIndiretosMedio;

        this.resultsGeraisMedio = [
            {
                "centro": 'Alugueis',
                "jan": 13975.99,
                "fev": 13975.99,
                "mar": 13975.99,
                "abr": 13975.99,
                "mai": 13975.99,
                "jun": 13975.99,
                "jul": 13975.99,
                "ago": 13975.99,
                "set": 13975.99,
                "out": 13975.99,
                "nov": 13975.99,
                "dez": 13975.99
            },
            {
                "centro": 'Consultoria Contab.',
                "jan": 1365.10,
                "fev": 1365.10,
                "mar": 1365.10,
                "abr": 1365.10,
                "mai": 1365.10,
                "jun": 1365.10,
                "jul": 1365.10,
                "ago": 1365.10,
                "set": 1365.10,
                "out": 1365.10,
                "nov": 1365.10,
                "dez": 1365.10
            },
            {
                "centro": 'Depreciacao',
                "jan": 961.28,
                "fev": 961.28,
                "mar": 961.28,
                "abr": 961.28,
                "mai": 961.28,
                "jun": 961.28,
                "jul": 961.28,
                "ago": 961.28,
                "set": 961.28,
                "out": 961.28,
                "nov": 961.28,
                "dez": 961.28
            },
            {
                "centro": 'Despesa Bancaria',
                "jan": 2295.40,
                "fev": 2295.40,
                "mar": 2295.40,
                "abr": 2295.40,
                "mai": 2295.40,
                "jun": 2295.40,
                "jul": 2295.40,
                "ago": 2295.40,
                "set": 2295.40,
                "out": 2295.40,
                "nov": 2295.40,
                "dez": 2295.40
            },
            {
                "centro": 'Despesa Postais',
                "jan": 28.17,
                "fev": 28.17,
                "mar": 28.17,
                "abr": 28.17,
                "mai": 28.17,
                "jun": 28.17,
                "jul": 28.17,
                "ago": 28.17,
                "set": 28.17,
                "out": 28.17,
                "nov": 28.17,
                "dez": 28.17
            },
            {
                "centro": 'Sindicato',
                "jan": 255.25,
                "fev": 255.25,
                "mar": 255.25,
                "abr": 255.25,
                "mai": 255.25,
                "jun": 255.25,
                "jul": 255.25,
                "ago": 255.25,
                "set": 255.25,
                "out": 255.25,
                "nov": 255.25,
                "dez": 255.25
            },
            {
                "centro": 'Juros e Multa',
                "jan": 415.53,
                "fev": 415.53,
                "mar": 415.53,
                "abr": 415.53,
                "mai": 415.53,
                "jun": 415.53,
                "jul": 415.53,
                "ago": 415.53,
                "set": 415.53,
                "out": 415.53,
                "nov": 415.53,
                "dez": 415.53
            },
            {
                "centro": 'Licenca de Software',
                "jan": 652.65,
                "fev": 652.65,
                "mar": 652.65,
                "abr": 652.65,
                "mai": 652.65,
                "jun": 652.65,
                "jul": 652.65,
                "ago": 652.65,
                "set": 652.65,
                "out": 652.65,
                "nov": 652.65,
                "dez": 652.65
            },
            {
                "centro": 'Manutencao Maq.',
                "jan": 537.37,
                "fev": 537.37,
                "mar": 537.37,
                "abr": 537.37,
                "mai": 537.37,
                "jun": 537.37,
                "jul": 537.37,
                "ago": 537.37,
                "set": 537.37,
                "out": 537.37,
                "nov": 537.37,
                "dez": 537.37
            },
            {
                "centro": 'Manutencao Veiculos',
                "jan": 355.58,
                "fev": 355.58,
                "mar": 355.58,
                "abr": 355.58,
                "mai": 355.58,
                "jun": 355.58,
                "jul": 355.58,
                "ago": 355.58,
                "set": 355.58,
                "out": 355.58,
                "nov": 355.58,
                "dez": 355.58
            },
            {
                "centro": 'Manutencao Predial',
                "jan": 1623.94,
                "fev": 1623.94,
                "mar": 1623.94,
                "abr": 1623.94,
                "mai": 1623.94,
                "jun": 1623.94,
                "jul": 1623.94,
                "ago": 1623.94,
                "set": 1623.94,
                "out": 1623.94,
                "nov": 1623.94,
                "dez": 1623.94
            },
            {
                "centro": 'Patrocinios',
                "jan": 110.07,
                "fev": 110.07,
                "mar": 110.07,
                "abr": 110.07,
                "mai": 110.07,
                "jun": 110.07,
                "jul": 110.07,
                "ago": 110.07,
                "set": 110.07,
                "out": 110.07,
                "nov": 110.07,
                "dez": 110.07
            },
            {
                "centro": 'Propaganda',
                "jan": 261.07,
                "fev": 261.07,
                "mar": 261.07,
                "abr": 261.07,
                "mai": 261.07,
                "jun": 261.07,
                "jul": 261.07,
                "ago": 261.07,
                "set": 261.07,
                "out": 261.07,
                "nov": 261.07,
                "dez": 261.07
            },
            {
                "centro": 'Servicos PJ',
                "jan": 1370.30,
                "fev": 1370.30,
                "mar": 1370.30,
                "abr": 1370.30,
                "mai": 1370.30,
                "jun": 1370.30,
                "jul": 1370.30,
                "ago": 1370.30,
                "set": 1370.30,
                "out": 1370.30,
                "nov": 1370.30,
                "dez": 1370.30
            },
            {
                "centro": 'Taxas',
                "jan": 563.37,
                "fev": 563.37,
                "mar": 563.37,
                "abr": 563.37,
                "mai": 563.37,
                "jun": 563.37,
                "jul": 563.37,
                "ago": 563.37,
                "set": 563.37,
                "out": 563.37,
                "nov": 563.37,
                "dez": 563.37
            },
            {
                "centro": 'Comissoes',
                "jan": 600.36,
                "fev": 600.36,
                "mar": 600.36,
                "abr": 600.36,
                "mai": 600.36,
                "jun": 600.36,
                "jul": 600.36,
                "ago": 600.36,
                "set": 600.36,
                "out": 600.36,
                "nov": 600.36,
                "dez": 600.36
            },
            {
                "centro": 'Taxi',
                "jan": 8.67,
                "fev": 8.67,
                "mar": 8.67,
                "abr": 8.67,
                "mai": 8.67,
                "jun": 8.67,
                "jul": 8.67,
                "ago": 8.67,
                "set": 8.67,
                "out": 8.67,
                "nov": 8.67,
                "dez": 8.67
            },
            {
                "centro": 'Depreciacao Equi.',
                "jan": 3231.95,
                "fev": 3231.95,
                "mar": 3231.95,
                "abr": 3231.95,
                "mai": 3231.95,
                "jun": 3231.95,
                "jul": 3231.95,
                "ago": 3231.95,
                "set": 3231.95,
                "out": 3231.95,
                "nov": 3231.95,
                "dez": 3231.95
            }];
        this.gerais = this.resultsGeraisMedio;

        this.resultsRateioDepartamentoMedio = [
            {
                "centro": 'Diretoria',
                "jan": 222.25,
                "fev": 222.25,
                "mar": 222.25,
                "abr": 222.25,
                "mai": 222.25,
                "jun": 222.25,
                "jul": 222.25,
                "ago": 222.25,
                "set": 222.25,
                "out": 222.25,
                "nov": 222.25,
                "dez": 222.25
            },
            {
                "centro": 'Financeiro',
                "jan": 178.55,
                "fev": 178.55,
                "mar": 178.55,
                "abr": 178.55,
                "mai": 178.55,
                "jun": 178.55,
                "jul": 178.55,
                "ago": 178.55,
                "set": 178.55,
                "out": 178.55,
                "nov": 178.55,
                "dez": 178.55
            },
            {
                "centro": 'Marketing',
                "jan": 149.49,
                "fev": 149.49,
                "mar": 149.49,
                "abr": 149.49,
                "mai": 149.49,
                "jun": 149.49,
                "jul": 149.49,
                "ago": 149.49,
                "set": 149.49,
                "out": 149.49,
                "nov": 149.49,
                "dez": 149.49
            },
            {
                "centro": 'Administracao',
                "jan": 358.40,
                "fev": 358.40,
                "mar": 358.40,
                "abr": 358.40,
                "mai": 358.40,
                "jun": 358.40,
                "jul": 358.40,
                "ago": 358.40,
                "set": 358.40,
                "out": 358.40,
                "nov": 358.40,
                "dez": 358.40
            }];
        this.rateioDepartamento = this.resultsRateioDepartamentoMedio;

        this.resultsTotalCustoDespesaMedio = [
            {
                "centro": 'Total',
                "jan": 112091.59,
                "fev": 112091.59,
                "mar": 112091.59,
                "abr": 112091.59,
                "mai": 112091.59,
                "jun": 112091.59,
                "jul": 112091.59,
                "ago": 112091.59,
                "set": 112091.59,
                "out": 112091.59,
                "nov": 112091.59,
                "dez": 112091.59
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaMedio;
    }
    //Total de Cada Custo
    getTotalMedio() {
        this.resultsTotalReceitas =
            [{
                "jan": 116194.48,
                "fev": 116194.48,
                "mar": 116194.48,
                "abr": 116194.48,
                "mai": 116194.48,
                "jun": 116194.48,
                "jul": 116194.48,
                "ago": 116194.48,
                "set": 116194.48,
                "out": 116194.48,
                "nov": 116194.48,
                "dez": 116194.48
            }];
        this.totalReceitas = this.resultsTotalReceitas;

        this.resultsTotalPessoal =
            [{
                "jan": 52297.80,
                "fev": 52297.80,
                "mar": 52297.80,
                "abr": 52297.80,
                "mai": 52297.80,
                "jun": 52297.80,
                "jul": 52297.80,
                "ago": 52297.80,
                "set": 52297.80,
                "out": 52297.80,
                "nov": 52297.80,
                "dez": 52297.80
            }];
        this.totalPessoal = this.resultsTotalPessoal;

        this.resultsTotalMateriais =
            [{
                "jan": 3946.20,
                "fev": 3946.20,
                "mar": 3946.20,
                "abr": 3946.20,
                "mai": 3946.20,
                "jun": 3946.20,
                "jul": 3946.20,
                "ago": 3946.20,
                "set": 3946.20,
                "out": 3946.20,
                "nov": 3946.20,
                "dez": 3946.20
            }];
        this.totalMateriais = this.resultsTotalMateriais;

        this.resultsTotalIndiretos =
            [{
                "jan": 26326.86,
                "fev": 26326.86,
                "mar": 26326.86,
                "abr": 26326.86,
                "mai": 26326.86,
                "jun": 26326.86,
                "jul": 26326.86,
                "ago": 26326.86,
                "set": 26326.86,
                "out": 26326.86,
                "nov": 26326.86,
                "dez": 26326.86
            }];
        this.totalIndiretos = this.resultsTotalIndiretos;

        this.resultsTotalGerais =
            [{
                "jan": 28612.04,
                "fev": 28612.04,
                "mar": 28612.04,
                "abr": 28612.04,
                "mai": 28612.04,
                "jun": 28612.04,
                "jul": 28612.04,
                "ago": 28612.04,
                "set": 28612.04,
                "out": 28612.04,
                "nov": 28612.04,
                "dez": 28612.04
            }];
        this.totalGerais = this.resultsTotalGerais;

        this.resultsTotalRateioDespesas =
            [{
                "jan": 908.69,
                "fev": 908.69,
                "mar": 908.69,
                "abr": 908.69,
                "mai": 908.69,
                "jun": 908.69,
                "jul": 908.69,
                "ago": 908.69,
                "set": 908.69,
                "out": 908.69,
                "nov": 908.69,
                "dez": 908.69
            }];
        this.totalRateioDepartamento = this.resultsTotalRateioDespesas;
    }
    //Total de Todos os Custo
    getTotalCustosDespesasMedio() {
        this.resultsTotalCustoDespesaMedio =
            [{
                "centro": 'Total',
                "jan": 112091.59,
                "fev": 112091.59,
                "mar": 112091.59,
                "abr": 112091.59,
                "mai": 112091.59,
                "jun": 112091.59,
                "jul": 112091.59,
                "ago": 112091.59,
                "set": 112091.59,
                "out": 112091.59,
                "nov": 112091.59,
                "dez": 112091.59
            }];
        this.totalCustosDespesas = this.resultsTotalCustoDespesaMedio;
    }
}

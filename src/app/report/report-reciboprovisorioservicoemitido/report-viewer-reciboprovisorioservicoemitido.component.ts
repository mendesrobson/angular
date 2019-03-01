import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report } from '../models/report';

@Component({
    selector: 'report-viewer-reciboprovisorioservicoemitido',
    templateUrl: './report-viewer-reciboprovisorioservicoemitido.component.html',
    styleUrls: ['./report-viewer-reciboprovisorioservicoemitido.component.css']
})

export class ReportViewerReciboProvisorioServicoEmitidoComponent implements OnInit {
    public filtroRelatorioReciboProvisorioServicoEmitidoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordens: string[];
    opcoes: string[];
    situacaos = [
        { id: 'ABR', value: 'Aberto' },
        { id: 'GER', value: 'Gerado' },
        { id: 'CAN', value: 'Cancelado' },
        { id: 'ATV', value: 'Ativo' },
        { id: 'TOD', value: 'Todos' }
    ];
    ordemPeriodicidade: string[];
    selecao: string = 'Competência';
    minDataMes: Date;
    minData: Date;

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    @ViewChild('scripts')
    scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control")
    control: ElementRef

    constructor(private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService
    ) {
        this.ordens = [
            "Código do Cliente",
            "Nome do Cliente",
            "Número do RPS"
        ];
        this.opcoes = [
            "Destacar linhas"
        ];
        this.ordemPeriodicidade = [
            "Competência",
            "Emissão"
        ];
    }

    ngOnInit() {

        this.filtroRelatorioReciboProvisorioServicoEmitidoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            situacaoRps: '',
            competencia: 'N',
            emissao: 'N',
            destacarLinha: 'N',
            dataCompetenciaInicial: '',
            dataCompetenciaFinal: '',
            dataEmissaoInicial: '',
            dataEmissaoFinal: '',
            ordernar:'Código do Cliente'
        });

        this.reportService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            },
                () => this.errors);

    }

    ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.reportService.obterTodosEmpresa(idGrupo)
            .subscribe(resultado => {
                this.empresas = resultado;
            },
                () => this.errors);
    }

    gerarRelatorioReciboProvisorioServicoEmitido() {

        this.filtroRelatorioReciboProvisorioServicoEmitidoForm.get('competencia').disable();
        this.filtroRelatorioReciboProvisorioServicoEmitidoForm.get('emissao').disable();
        this.filtroRelatorioReciboProvisorioServicoEmitidoForm.get('destacarLinha').disable();

        let p = Object.assign({}, this.report, this.filtroRelatorioReciboProvisorioServicoEmitidoForm.value);

        //#region Tratamento Datas

        if(this.selecao === 'Competência')
        {
            if(p.dataCompetenciaInicial === undefined || p.dataCompetenciaInicial === '' || p.dataCompetenciaInicial === null)
                p.dataCompetenciaInicial = new Date(1899, 1, 1);

            if(p.dataCompetenciaFinal === undefined || p.dataCompetenciaFinal === '' || p.dataCompetenciaFinal === null)
                p.dataCompetenciaFinal = new Date(2999, 12, 0);
        }
        else if(this.selecao === 'Emissão')
        {
            if(p.dataEmissaoInicial === undefined || p.dataEmissaoInicial === '' || p.dataEmissaoInicial === null)
                p.dataEmissaoInicial = new Date(1899, 1, 1);

            if(p.dataEmissaoFinal === undefined || p.dataEmissaoFinal === '' || p.dataEmissaoFinal === null)
                p.dataEmissaoFinal = new Date(2999, 12, 0);
        }

        //#endregion

        switch (p.ordernar) {
            default:
            case "Código do Cliente": p.ordernar = "codigo"; break;
            case "Nome do Cliente": p.ordernar = "nome"; break;
            case "Número do RPS": p.ordernar = "numero"; break;
        }

        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('ReciboProvisorioServicoEmitidos?', p);

        this.renderer.destroy;
        ko.cleanNode(this.control.nativeElement);

        const reportUrl = param,
            host = `${environment.url_reportView}`,
            container = this.renderer.createElement("div");

        container.innerHTML = Html;
        this.renderer.appendChild(this.scripts.nativeElement, container);
        ko.applyBindings({
            reportUrl, // The URL of a report that is opened in the Document Viewer when the application starts.  
            requestOptions: { // Options for processing requests from the Web Document Viewer.  
                host, // URI of your backend project.  
                invokeAction: "/WebDocumentViewer/Invoke" // The URI path of the controller action that processes requests.  
            }
        }, this.control.nativeElement);

        this.filtroRelatorioReciboProvisorioServicoEmitidoForm.get('competencia').enable();
        this.filtroRelatorioReciboProvisorioServicoEmitidoForm.get('emissao').enable();
        this.filtroRelatorioReciboProvisorioServicoEmitidoForm.get('destacarLinha').enable();
    }

    ConsultaSelectEmpresa(idEmpresa) {

        this.reportService.obterTodosClientePorEmpresa(idEmpresa)
            .subscribe(f => {
                this.clientes = f;
                this.clientes.forEach(el => {
                    this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, cliente: el.pessoa.nome });
                });

                this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

            }, () => { });
    }

    selectRadioButton(event) {
        this.selecao = event.value;
        if (this.selecao == 'Competência') {
            this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['emissao'].patchValue('N');
            this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['competencia'].patchValue('S');
            if (this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataEmissaoInicial'].value != '') {
                this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataEmissaoInicial'].patchValue('');
            }
            if (this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataEmissaoFinal'].value != '') {
                this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataEmissaoFinal'].patchValue('');
            }
        }
        if (this.selecao == 'Emissão') {
            this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['competencia'].patchValue('N');
            this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['emissao'].patchValue('S');            
            if (this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataCompetenciaInicial'].value != '') {
                this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataCompetenciaInicial'].patchValue('');
            }
            if (this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataCompetenciaFinal'].value != '') {
                this.filtroRelatorioReciboProvisorioServicoEmitidoForm.controls['dataCompetenciaFinal'].patchValue('');
            }        
        }
    }

    definirDataMes(event) {
        this.minDataMes = event.value;
    }

    definirData(event) {
        this.minData = event.value;
    }

    makeAsyncDataSource(clientes) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: function () {
                return clientes;
            }
        });
    }

    get gridBoxValue(): string[] {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: string[]) {
        this._gridBoxValue = value || [];
    }

}
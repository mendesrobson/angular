import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { ReportService } from '../report.service';
import CustomStore from 'devextreme/data/custom_store';
import { Empresa, GrupoEmpresa, Cliente, Status, Report } from '../models/report';
import { environment } from '../../../environments/environment';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'report-viewer-documentocobrancaemitido',
    templateUrl: './report-viewer-documentocobrancaemitido.component.html',
    styleUrls: ['./report-viewer-documentocobrancaemitido.component.css']
})

export class ReportViewerDocumentoCobrancaEmitidoComponent implements OnInit {
    public filtroRelatorioDocumentoCobrancaEmitidoForm: FormGroup;
    public report: Report;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordens: string[];
    opcoes: string[];
    ordemPeriodicidade: string[];
    selecao: string = 'Competência';
    minDataMes: Date;
    minDataEmi: Date;
    minDataVenc: Date;

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
        private reportService: ReportService,
        private utilService: UtilService) {

        this.ordens = [
            "Código do Cliente",
            "Nome do Cliente",
            "Número"
        ];
        this.opcoes = [
            "Destacar linhas"
        ];
        this.ordemPeriodicidade = [
            "Competência",
            "Emissão",
            "Vencimento"
        ];
    }

    ngOnInit() {

        this.filtroRelatorioDocumentoCobrancaEmitidoForm = this.fb.group({
            empresaId: null,
            grupoEmpresaId: null,
            clienteId: [],
            competencia: new FormControl('N'),
            emissao: new FormControl('N'),
            vencimento: new FormControl('N'),
            destacarLinha: new FormControl('N'),
            dataCompetenciaInicial: '',
            dataCompetenciaFinal: '',
            dataEmissaoInicial: '',
            dataEmissaoFinal: '',
            dataVencimentoInicial: '',
            dataVencimentoFinal: '',
            ordem: 'Código do Cliente'
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

    gerarRelatorioDocumentoCobrancaEmitido() {

        //################################################################################
        //#########   Disable para nao mandar eles para para o Back ######################
        //################################################################################

        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('competencia').disable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('emissao').disable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('vencimento').disable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('destacarLinha').disable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('ordem').disable();

        let p = Object.assign({}, this.report, this.filtroRelatorioDocumentoCobrancaEmitidoForm.getRawValue());

        switch(p.ordem){
            default:
            case "Código do Cliente" : p.ordem = "codigo"; break;
            case "Nome do Cliente" : p.ordem = "nome"; break;
            case "Número" : p.ordem = "numero"; break;
        }

        let itens = [];
        if (this._gridBoxValue.length > 0) {
            for (var i = 0; i < this._gridBoxValue.length; i++) {
                itens.push(this._gridBoxValue[i]);
            }
        }

        p.clienteId = itens;

        //#region Tratamento Datas
        
        if(this.selecao === 'Competência')
        {
            if(p.dataCompetenciaInicial === undefined || p.dataCompetenciaInicial === '')
                p.dataCompetenciaInicial = new Date(1899, 1, 1);
            
            if(p.dataCompetenciaFinal === undefined || p.dataCompetenciaFinal === '')
                p.dataCompetenciaFinal = new Date(2999, 12, 0);
        }
        else if(this.selecao === 'Emissão')
        {
            if(p.dataEmissaoInicial === undefined || p.dataEmissaoInicial === '')
                p.dataEmissaoInicial = new Date(1899, 1, 1);
            
            if(p.dataEmissaoFinal === undefined || p.dataEmissaoFinal === '')
                p.dataEmissaoFinal = new Date(2999, 12, 0);
        }
        else if(this.selecao === 'Vencimento')
        {
            if(p.dataVencimentoInicial === undefined || p.dataVencimentoInicial === '')
                p.dataVencimentoInicial = new Date(1899, 1, 1); 
            
            if(p.dataVencimentoFinal === undefined || p.dataVencimentoFinal === '')
                p.dataVencimentoFinal = new Date(2999, 12, 0);
        }

        //#endregion

        //#######################################################################################
        //#########   Mentodo para montar a estrutura e paramentros para o back #################
        //#######################################################################################
        
        let param = null;
        param = this.reportService.EstruturarParamentrosDoRelatorio('CobrancaEmitidos?', p);

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

        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('competencia').enable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('emissao').enable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('vencimento').enable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('destacarLinha').enable();
        this.filtroRelatorioDocumentoCobrancaEmitidoForm.get('ordem').enable();
    }

    ConsultaSelectEmpresa(idEmpresa) {

        this.reportService.obterTodosClientePorEmpresa(idEmpresa)
            .subscribe(f => {
                this.clientes = f;
                this.clientes.forEach(el => {
                    this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, cliente: el.pessoa.nome });
                });

                console.log(this.clientes);

                this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

            }, () => { });
    }

    selectRadioButton(event) {
        this.selecao = event.value;
        if (this.selecao == 'Competência') {
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['competencia'].patchValue('S');
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['emissao'].patchValue('N');
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['vencimento'].patchValue('N');
            if (this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataEmissaoInicial'].value != '') {
                this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataEmissaoInicial'].patchValue('');
            }
            if (this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataEmissaoFinal'].value != '') {
                this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataEmissaoFinal'].patchValue('');
            }
        }
        if (this.selecao == 'Emissão') {
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['competencia'].patchValue('N');
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['emissao'].patchValue('S');
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['vencimento'].patchValue('N');
            if (this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataCompetenciaInicial'].value != '') {
                this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataCompetenciaInicial'].patchValue('');
            }
            if (this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataCompetenciaFinal'].value != '') {
                this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataCompetenciaFinal'].patchValue('');
            }
        }
        if (this.selecao == 'Vencimento') {
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['competencia'].patchValue('N');
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['emissao'].patchValue('N');
            this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['vencimento'].patchValue('S');
            if (this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataVencimentoInicial'].value != '') {
                this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataVencimentoInicial'].patchValue('');
            }
            if (this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataVencimentoFinal'].value != '') {
                this.filtroRelatorioDocumentoCobrancaEmitidoForm.controls['dataVencimentoFinal'].patchValue('');
            }
        }

    }

    definirDataMes(event) {
        this.minDataMes = event.value;
    }

    definirDataEmi(event) {
        this.minDataEmi = event.value;
    }

    definirDataVenc(event) {
        this.minDataVenc = event.value;
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
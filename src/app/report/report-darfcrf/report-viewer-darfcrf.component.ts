import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewChildren, AfterViewInit } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report, ParametroFaturamento, ImpostoFaturamentoModel } from '../models/report';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
import { SweetAlertAdviceService } from '../../services/sweetalert.advice.service';
import { GenericValidator } from '../../validation/generic-form-validator';
import { Observable } from 'rxjs';

@Component({
    selector: 'report-viewer-darfcrf',
    templateUrl: './report-viewer-darfcrf.component.html',
    styleUrls: ['./report-viewer-darfcrf.component.css']
})

export class ReportViewerDarfcrfComponent implements OnInit, AfterViewInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public filtroDarfcrfForm: FormGroup;
    public report: Report;
    public sValorFiliais: boolean = false;
    public pTotalGeral: boolean = false;
    public startSemana: Date;
    public startDecendial: Date;
    public limitSemana: Date;
    public limitDecendial: Date;
    public parametroFaturamento: ParametroFaturamento[];
    impostoFaturamento: ImpostoFaturamentoModel;
    public swal: SweetAlertAdviceService;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    tipoImposto: string[];
    public displayMessage: { [key: string]: string } = {};
    public validationMessages: { [key: string]: { [key: string]: string } };
    public genericValidator: GenericValidator;
    opcoes: string[];
    hoje = Date.now();


    koReportUrl = ko.observable(null);

    @ViewChild('scripts') scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control") control: ElementRef

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService) {
        this.tipoImposto = [
            "CRF",
            "PIS",
            "COFINS",
            "CSLL"
        ];
        this.opcoes = [
            "Soma valor das filiais",
            "Preencher total geral"
        ];

        //this.selecao = this.tipoImposto[0];
        this.impostoFaturamento = new ImpostoFaturamentoModel();
        this.swal = new SweetAlertAdviceService();
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(this.filtroDarfcrfForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.filtroDarfcrfForm);
        });
    }

    ngOnInit() {

        this.filtroDarfcrfForm = this.fb.group({
            grupoEmpresaId: [null, [Validators.required]],
            empresaId: [null, [Validators.required]],
            clienteId: null,
            codRecolhimento: [],
            tipoGuia: null,
            tributoId: null,
            mes: '',
            vencimento: '',
            multa: '',
            juros: '',
            codCRF: '',
            codPIS: '',
            codCOFINS: '',
            codCSLL: '',
            checkCRF: false,
            checkPIS: false,
            checkCOFINS: false,
            checkCSLL: false,
            somaValorFiliais: false,
            preencherTotalGeral: false
        });

        this.validationMessages = {
            grupoEmpresaId: {
                required: 'Informe o Grupo'
            },
            empresaId: {
                required: 'Informe a Empresa'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);

        this.filtroDarfcrfForm.get("codCRF").disable();
        this.filtroDarfcrfForm.get("codPIS").disable();
        this.filtroDarfcrfForm.get("codCOFINS").disable();
        this.filtroDarfcrfForm.get("codCSLL").disable();
        this.filtroDarfcrfForm.get("checkCRF").disable();
        this.filtroDarfcrfForm.get("checkPIS").disable();
        this.filtroDarfcrfForm.get("checkCOFINS").disable();
        this.filtroDarfcrfForm.get("checkCSLL").disable();

        this.reportService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            },
                () => this.errors);

        this.reportService.obterTodosParametroFaturamento()
            .subscribe(paramentro => {
                this.parametroFaturamento = paramentro;
            });
    }

    ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.reportService.obterTodosEmpresa(idGrupo)
            .subscribe(resultado => {
                this.empresas = resultado;
            },
                () => this.errors);
    }

    desabilitar() {
        this.filtroDarfcrfForm.get("mes").disable();
        this.filtroDarfcrfForm.get("checkCRF").disable();
        this.filtroDarfcrfForm.get("checkPIS").disable();
        this.filtroDarfcrfForm.get("checkCOFINS").disable();
        this.filtroDarfcrfForm.get("checkCSLL").disable();
        this.filtroDarfcrfForm.get("somaValorFiliais").disable();
        this.filtroDarfcrfForm.get("preencherTotalGeral").disable();
    }

    habilitar() {
        this.filtroDarfcrfForm.get("mes").enable();
        this.filtroDarfcrfForm.get("checkCRF").enable();
        this.filtroDarfcrfForm.get("checkPIS").enable();
        this.filtroDarfcrfForm.get("checkCOFINS").enable();
        this.filtroDarfcrfForm.get("checkCSLL").enable();
        this.filtroDarfcrfForm.get("somaValorFiliais").enable();
        this.filtroDarfcrfForm.get("preencherTotalGeral").enable();
    }

    async gerarRelatorioDarfcrf(): Promise<void> {
       // if (this.filtroDarfcrfForm.dirty && this.filtroDarfcrfForm.valid) {
            this.desabilitar();

            let p = Object.assign({}, this.report, this.filtroDarfcrfForm.value);

            this.impostoFaturamento.empresaId = p.empresaId;
            this.impostoFaturamento.grupoEmpresaId = p.grupoEmpresaId;
            this.impostoFaturamento.clienteId = p.clienteId == null ? [] : p.clienteId;
            //this.impostoFaturamento.mes
            let dateVencimento: Date = p.vencimento;
            if (dateVencimento.toString() == "")
                dateVencimento = new Date(1970, 1, 1);

            this.impostoFaturamento.dataVencimento = dateVencimento.toISOString();

            this.impostoFaturamento.multa = p.multa;
            this.impostoFaturamento.juros = p.juros;

            // ARRUMAR ESSE METODO FEIO - CADEIA DE IF`s *-*
            if (p.codCRF !== undefined)
                if (p.codCRF !== '')
                    this.impostoFaturamento.codRecolhimento.push(p.codCRF);

            if (p.codPIS !== undefined)
                if (p.codPIS !== '')
                    this.impostoFaturamento.codRecolhimento.push(p.codPIS);

            if (p.codCOFINS !== undefined)
                if (p.codCOFINS !== '')
                    this.impostoFaturamento.codRecolhimento.push(p.codCOFINS);

            if (p.codCSLL !== undefined)
                if (p.codCSLL !== '')
                    this.impostoFaturamento.codRecolhimento.push(p.codCSLL);

            p.codRecolhimento = this.impostoFaturamento.codRecolhimento;
            // #########   VALOR PADRÃO POR GUIA

            this.impostoFaturamento.tipoImposto = 5;   // Para CRF - tabela tributos
            this.impostoFaturamento.tipoGuia = 2;      // para DARF - tabela tipo de guias
            p.tributoId = 5;
            p.tipoGuia = 2;

            // #########################################

            let guiaGerada = await this.reportService.gerarGuias(this.impostoFaturamento).toPromise();

            if (guiaGerada) {
                let param = null;
                param = this.reportService.EstruturarParamentrosDoRelatorio('DarfCrf?', p);

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
            } else {
                this.swal.showSwalErro("Erro ao gerar a Guia.");
            }

            this.habilitar();
       // }
    }

    ConsultaSelectEmpresa(idEmpresa) {

        this.clientes = [];
        this.reportService.obterTodosClientePorEmpresa(idEmpresa)
            .subscribe(clientes => {
                this.clientes = clientes
            },
                () => this.errors);

        for (var x = 0; x < this.parametroFaturamento.length; x++) {
            if (this.parametroFaturamento[x].empresaId == idEmpresa) {
                if (this.parametroFaturamento[x].crf != null && this.parametroFaturamento[x].crf == 'S') {
                    this.filtroDarfcrfForm.get("codCRF").enable();
                    this.filtroDarfcrfForm.get("checkCRF").setValue(true);
                } else {
                    this.filtroDarfcrfForm.get("codCRF").disable();
                    this.filtroDarfcrfForm.get("codCRF").setValue("");
                    this.filtroDarfcrfForm.get("checkCRF").setValue(false);
                }

                if (this.parametroFaturamento[x].csll != null && this.parametroFaturamento[x].csll == 'S') {
                    this.filtroDarfcrfForm.get("codCSLL").enable();
                    this.filtroDarfcrfForm.get("checkCSLL").setValue(true);
                } else {
                    this.filtroDarfcrfForm.get("codCSLL").disable();
                    this.filtroDarfcrfForm.get("codCSLL").setValue("");
                    this.filtroDarfcrfForm.get("checkCSLL").setValue(false);
                }

                if (this.parametroFaturamento[x].cofins != null && this.parametroFaturamento[x].cofins == 'S') {
                    this.filtroDarfcrfForm.get("codCOFINS").enable();
                    this.filtroDarfcrfForm.get("checkCOFINS").setValue(true);
                } else {
                    this.filtroDarfcrfForm.get("codCOFINS").setValue("");
                    this.filtroDarfcrfForm.get("codCOFINS").disable();
                    this.filtroDarfcrfForm.get("checkCOFINS").setValue(false);
                }

                if (this.parametroFaturamento[x].pis != null && this.parametroFaturamento[x].pis == 'S') {
                    this.filtroDarfcrfForm.get("codPIS").enable();
                    this.filtroDarfcrfForm.get("checkPIS").setValue(true);
                } else {
                    this.filtroDarfcrfForm.get("codPIS").disable();
                    this.filtroDarfcrfForm.get("codPIS").setValue("");
                    this.filtroDarfcrfForm.get("checkPIS").setValue(false);
                }

                break;
            } else {
                this.filtroDarfcrfForm.get("codCRF").disable();
                this.filtroDarfcrfForm.get("codCRF").setValue("");
                this.filtroDarfcrfForm.get("checkCRF").setValue(false);
                this.filtroDarfcrfForm.get("codCSLL").disable();
                this.filtroDarfcrfForm.get("codCSLL").setValue("");
                this.filtroDarfcrfForm.get("checkCSLL").setValue(false);
                this.filtroDarfcrfForm.get("codCOFINS").setValue("");
                this.filtroDarfcrfForm.get("codCOFINS").disable();
                this.filtroDarfcrfForm.get("checkCOFINS").setValue(false);
                this.filtroDarfcrfForm.get("codPIS").disable();
                this.filtroDarfcrfForm.get("codPIS").setValue("");
                this.filtroDarfcrfForm.get("checkPIS").setValue(false);
            }
        }
    }

    selectRadioButton(event) {
        // this.selecao = event.value;
    }

    startDateSemanal(event) {
        this.startSemana = new Date(event.value);
        this.limitSemana = new Date(this.startSemana.getFullYear(), this.startSemana.getMonth(), this.startSemana.getDate() + (11 - this.startSemana.getDay()));
    }

    startDateDecendial(event) {
        this.startDecendial = new Date(event.value);
        this.limitDecendial = new Date(this.startDecendial.getFullYear(), this.startDecendial.getMonth(), this.startDecendial.getDate() + (14 - this.startDecendial.getDay()));
    }
}
import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewChildren, AfterViewInit } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report, ImpostoFaturamentoModel } from '../models/report';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
import { SweetAlertAdviceService } from '../../services/sweetalert.advice.service';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../validation/generic-form-validator';

@Component({
    selector: 'report-viewer-darfirrf',
    templateUrl: './report-viewer-darfirrf.component.html',
    styleUrls: ['./report-viewer-darfirrf.component.css']
})

export class ReportViewerDarfirrfComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public filtroDarfirrfForm: FormGroup;
    public impostoFaturamento: ImpostoFaturamentoModel;
    public report: Report;
    public sValorFiliais: boolean = false;
    public pTotalGeral: boolean = false;
    public startSemana: Date;
    public startDecendial: Date;
    public limitSemana: Date;
    public limitDecendial: Date;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    clientes: Cliente[];
    ordemPeriodicidade: string[];
    opcoes: string[];
    public selecao: string;
    swal: SweetAlertAdviceService;
    public displayMessage: { [key: string]: string } = {};
    public validationMessages: { [key: string]: { [key: string]: string } };
    public genericValidator: GenericValidator;
    hoje = Date.now();

    @ViewChild('scripts') scripts: ElementRef;

    public errors: any[] = [];

    @ViewChild("control") control: ElementRef

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private reportService: ReportService) {

        this.ordemPeriodicidade = [
            "Mensal",
            "Semanal",
            "Decendial"
        ];
        this.opcoes = [
            "Soma valor das filiais",
            "Preencher total geral"
        ];

        // this.selecao = this.ordemPeriodicidade[0];
        this.selecao = "Mensal";

        this.impostoFaturamento = new ImpostoFaturamentoModel();
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit() {

        this.filtroDarfirrfForm = this.fb.group({
            grupoEmpresaId: [null, [Validators.required]],
            empresaId: [null, [Validators.required]],
            clienteId: null,
            mes: '',
            tipoGuia:null,
            tributoId:null,
            vencimento: '',
            multa: '',
            juros: '',
            codRecolhimento: [],
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

        this.reportService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            },
                () => this.errors);


    }
    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(this.filtroDarfirrfForm.valueChanges,...controlBlurs).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.filtroDarfirrfForm);
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
    async gerarRelatorioDarfIrrf(): Promise<void> {
        console.log(this.filtroDarfirrfForm.valid);
        // if (this.filtroDarfirrfForm.valid) {

        let p = Object.assign({}, this.report, this.filtroDarfirrfForm.value);

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
        this.impostoFaturamento.codRecolhimento = p.codRecolhimento == null ? [] : p.codRecolhimento;

        // #########   VALOR PADRÃO POR GUIA

        this.impostoFaturamento.tipoImposto = 1;   // Para IRRF - tabela tributos
        this.impostoFaturamento.tipoGuia = 2;      // para DARF - tabela tipo de guias
        p.tributoId = 1;
        p.tipoGuia = 2;

        // #########################################

        let guiaGerada = await this.reportService.gerarGuias(this.impostoFaturamento).toPromise();

        if (guiaGerada) {
            let param = null;
            param = this.reportService.EstruturarParamentrosDoRelatorio('IRRF?', p);

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

        // }else{
        //     this.swal.showSwalErro("Preencha os campos obrigatórios, Grupo e Empresa");
        // }
    }

    ConsultaSelectEmpresa(idEmpresa) {

        this.clientes = [];
        this.reportService.obterTodosClientePorEmpresa(idEmpresa)
            .subscribe(clientes => {
                this.clientes = clientes
            },
                () => this.errors);
    }
    selectRadioButton(event) {
        this.selecao = event.value;
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
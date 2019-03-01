import { Component, OnInit, ViewContainerRef, ElementRef, ViewChildren, ViewChild } from "@angular/core";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { FormGroup, FormBuilder, Validators, FormControlName } from "@angular/forms";
import { FiltroRemessaPagamento, ContaCorrente, Fornecedor, VwCamposLeiauteArqBancario, LeiauteArquivoBancarioParcelas } from "../models/remessapagamento";
import { DxDropDownBoxModule, DxTreeViewModule, DxDataGridModule, DxTreeViewComponent } from 'devextreme-angular';
import { Subscription } from "rxjs/Subscription";
import { Empresa, GrupoEmpresa } from "../../../cadastros/empresa/models/empresa";
import { SweetAlertAdviceService } from "../../../services/sweetalert.advice.service";
import { DateUtils } from '../../../utils/date.utils';
import { GenericValidator } from "../../../validation/generic-form-validator";
import { GerarRemessaPagamentoService } from "../gerarremessapagamento.service";
import { ToastsManager, Toast } from "ng2-toastr";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { LeiauteArquivoBancario } from "../../../cadastros/leiautearquivobancario/models/leiautearquivobancario";
import { UtilService } from "../../../services/util.service";
import { ReportService } from "../../../utils/report.service";
import { id } from '@swimlane/ngx-datatable/release/utils';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from "../../../../../node_modules/@angular/common/http";

@Component({
    selector: 'app-gerararquivopagamento',
    templateUrl: './gerar-arquivopagamento.component.html',
    styleUrls: ['./gerar-arquivopagamento.component.css'],
    providers: [DateUtils]

})

export class GerarArquivoPagamentoComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @ViewChild(DxTreeViewComponent) treeView;
    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

    public filtroRemessaPagamentoForm: FormGroup;
    public filtroRemessaPagamento: FiltroRemessaPagamento;

    busy: Subscription;

    carregarTable: boolean = false;

    vwCamposLeiaute: VwCamposLeiauteArqBancario[];
    leiauteArquivoBancario: LeiauteArquivoBancario;
    leiauteArquivoBancarioParcelas: LeiauteArquivoBancarioParcelas;


    dataPagamento: any;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    public contaCorrentes: ContaCorrente[];
    //  parcelas: Parcela[];
    fornecedores: Fornecedor[];

    swal: SweetAlertAdviceService;

    public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

    displayMessage: { [key: string]: string } = {};

    public data: any[];
    public minDate: Date;
    public date : Date = new Date();
    public dataAtual = this.date.getFullYear().toString() + "-" + (this.date.getMonth() + 1).toString() + "-" + this.date.getDate().toString();
    public minDatePagamento: any = this.dataAtual;
    refazerFiltro: boolean;

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    selectedItems = [];
    dropdownSettings = {};

    public errors: any[] = [];
    myOptionsFornecedores: IMultiSelectOption[] = [];

    mostrarAviso = false;

    selectedEntities: any[];
    constructor(private fb: FormBuilder,
        private gerarRemessaPagamentoService: GerarRemessaPagamentoService,
        private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private report: ReportService,
        http: HttpClient) {

        this.dropdownSettings = {
            singleSelection: false,
            text: "Selecione um fornecedor",
            selectAllText: 'Marcar Todos',
            checkedStyle: 'fontawesome',
            unSelectAllText: 'Desmarcar Todos',
            searchPlaceholder: 'Procurar',
            enableSearchFilter: true,
            //containerClasses: 'myclass',
            //classes: "myclass custom-class ng-untouched ng-pristine ng-valid",
            classes: "selected-list[_ngcontent-c6] c-btn[_ngcontent-c6]",
            badgeShowLimit: 1,
        };

        this.toastr.setRootViewContainerRef(vcr);

        this.validationMessages = {

            grupoEmpresaId: {
                required: 'O Grupo Empresa é requerido.'
            },
            empresaId: {
                required: 'A Empresa é requerida.'
            },
            contaCorrenteId: {
                required: 'A Conta Corrente é requerida.'

            },
            dataVencimentoInicial: {
                required: 'A Dt. Vencimento Inicial é requerida.'

            },
            dataVencimentoFinal: {
                required: 'A Dt. Vencimento Final é requerida.'

            }

        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.filtroRemessaPagamento = new FiltroRemessaPagamento();
        this.swal = new SweetAlertAdviceService();
    }

    makeAsyncDataSource(fornecedores){
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: function() {
                return fornecedores;
            }
        });
    };

    ngOnInit(): void {
        this.filtroRemessaPagamentoForm = this.fb.group({
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            contaCorrenteId: ['', [Validators.required]],
            dataVencimentoInicial: ['', [Validators.required]],
            dataVencimentoFinal: ['', [Validators.required]],
            fornecedores: [[]]
        });

        this.gerarRemessaPagamentoService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                () => { });

        this.data = [];
        this.contaCorrentes = [];
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(this.filtroRemessaPagamentoForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.filtroRemessaPagamentoForm);
        });
    }

    filtrarPagamentos(): void {
        if (this.filtroRemessaPagamentoForm.valueChanges) {
            this.refazerFiltro = false;
          }

        this.carregarTable = false;
        this.data = [];

        if (this.filtroRemessaPagamentoForm.dirty && this.filtroRemessaPagamentoForm.valid) {
            let p = Object.assign({}, this.filtrarPagamentos, this.filtroRemessaPagamentoForm.value);

            p.dataVencimentoInicial = new Date(p.dataVencimentoInicial).toDateString();
            p.dataVencimentoFinal = new Date(p.dataVencimentoFinal).toDateString();

            p.contaCorrenteId = p.contaCorrenteId.toString();
            p.empresaId = p.empresaId.toString();
            p.grupoEmpresaId = p.grupoEmpresaId.toString();

            let fornecedores = "";

            if (this._gridBoxValue.length > 0) {
                for (var i = 0; i < this._gridBoxValue.length; i++) {
                    if (fornecedores != "")
                        fornecedores = fornecedores + "&" + "fornecedores[" + [i] + "]=" + this._gridBoxValue[i];
                    else
                        fornecedores = "fornecedores[" + [i] + "]=" + this._gridBoxValue[i]

                }

            } else {
                fornecedores = "fornecedores[]"
            }

            // if (this.selectedItems.length > 0) {
            //     for (var i = 0; i < this.selectedItems.length; i++) {
            //         if (fornecedores != "")
            //             fornecedores = fornecedores + "&" + "fornecedores[" + [i] + "]=" + this.selectedItems[i].id;
            //         else
            //             fornecedores = "fornecedores[" + [i] + "]=" + this.selectedItems[i].id

            //     }

            // } else {
            //     fornecedores = "fornecedores[]"
            // }

            this.busy = this.gerarRemessaPagamentoService.obterParcelasParaRemessa(p, fornecedores)
                .subscribe(
                    result => {
                        if (result.length == 0) {
                            this.toasterMensagemErro('Não há pagamentos para os filtros escolhidos')

                        }
                        this.data = result;
                        this.carregarTable = true;
                        this.gerarRemessaPagamentoService.obterLeiauteArquivoBancarioPorBanco(p.empresaId, p.grupoEmpresaId, p.contaCorrenteId)
                            .subscribe(
                                result => {
                                    this.mostrarAviso = !(result.id > 0);
                                    this.leiauteArquivoBancario = result;
                                }
                            )
                    }
                )
        }

        this.refazerFiltro = true;

    }

    public toasterMensagemSucesso(msg) {
        this.toastr.success(msg, 'Sucesso', { dismiss: 'click' });
        this.toastr.success(msg, 'Sucesso', { dismiss: 'controlled' })
            .then((toast: Toast) => {
                setTimeout(() => {
                    this.toastr.dismissToast(toast);

                }, 2500);
            });
    }

    public toasterMensagemErro(msg) {
        this.toastr.success(msg, 'Sucesso', { dismiss: 'click' });
        this.toastr.warning(msg, 'Ateção', { dismiss: 'controlled' })
            .then((toast: Toast) => {
                setTimeout(() => {
                    this.toastr.dismissToast(toast);

                }, 3500);
            });
    }

    gerarArquivoRemessa() {

        if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
            this.toasterMensagemErro('Não há parcelas selecionadas')
        }
        else if (this.dataPagamento == undefined) {
            this.toasterMensagemErro('É necessário escolher uma Data p/ Pagamento válida')
        }
        else {

            this.vwCamposLeiaute = this.selectedEntities;

            for (var i = 0; i < this.vwCamposLeiaute.length; i++) {
                this.vwCamposLeiaute[i].dataPagamento = this.dataPagamento.formatted;
            }

            this.leiauteArquivoBancarioParcelas = new LeiauteArquivoBancarioParcelas;

            this.leiauteArquivoBancarioParcelas.leiauteArquivoBancario = this.leiauteArquivoBancario;
            this.leiauteArquivoBancarioParcelas.parcelas = this.vwCamposLeiaute;

            this.gerarRemessaPagamentoService.gerarRemessaPagamento(this.leiauteArquivoBancarioParcelas)
                .subscribe(
                    (res) => {
                        let resultado: string;
                        resultado = "";
                        for (var i = 0; i < res.length; i++) {
                            resultado = resultado + res[i] + "\n";

                        }

                        this.downloadFile(resultado)

                    }
                )
        }
    }

    // onItemSelect(item: any) {
    //    this.selectedItems.push({ id: item.id, itemName: item.itemName });
    // }

    // OnItemDeSelect(item: any) {
    //     for (var i = 0; i < this.selectedItems.length; i++) {
    //         if (item.id == this.selectedItems[i].id)
    //             this.selectedItems.splice(i, 1)
    //     }
    // }
    // onSelectAll(items: any) {
    //     this.selectedItems.push(items);
    // }

    // onDeSelectAll(items: any) {
    //     this.selectedItems = [];
    // }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    public setSelectedEntities($event: any) {
        this.selectedEntities = $event;
    }

    private downloadFile(data) {

        var blob = new Blob([data], { type: 'application/txt' });

        var url = window.URL.createObjectURL(blob);

        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", this.leiauteArquivoBancario.nomeArquivo + "." + this.leiauteArquivoBancario.tipoArquivo);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    gerarExcel(model, id?) {
        if (!this.report.gerarExcel(model, "Gerar Arquivo de Pagamentos", id))
            this.toastr.error("Não Possui Informações");
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Gerar Arquivo de Pagamentos");
    }
    ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.dropdownList = [];
        this.contaCorrentes = [];
        this.myOptionsFornecedores = [];
        this.gerarRemessaPagamentoService.obterTodosEmpresaPorId(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => { });
    }
     ConsultaSelectEmpresa(idEmpresa){

        this.dropdownList = [];
        this.gridDataSource = null;

        // let myOptions = [];
        this.gerarRemessaPagamentoService.obterTodosFornecedorPorEmpresa(idEmpresa)
            .subscribe(f => {
                this.fornecedores = f;
                this.fornecedores.forEach(el => {
                    this.dropdownList.push({ id: el.id, fornecedor: el.pessoa.nome });
                    
                });

                this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

            },
                () => { });
        

        this.contaCorrentes = [];
        this.gerarRemessaPagamentoService.obterTodosContaCorrentePorEmpresa(idEmpresa)
            .subscribe(cc => {
                this.contaCorrentes = cc;
            },
                () => { });

    }

    get gridBoxValue(): string[] {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: string[]) {
        this._gridBoxValue = value || [];
    }


    definirValor(event) {
        this.minDate = event.value;
    }

}


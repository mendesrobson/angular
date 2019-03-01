import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { DateUtils } from '../../../utils/date.utils';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FiltroParcelasAVencer, Parcela, Fornecedor } from '../models/parcela';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ToastsManager, Toast } from 'ng2-toastr';
import { AlterarVencimentoLoteService } from '../alterarvencimentolote.service';
import { Observable } from 'rxjs/Observable';
import { ReportService } from '../../../utils/report.service';


@Component({
    selector: 'app-lista-parcelapagar',
    templateUrl: './lista-parcelapagar.component.html',
    styleUrls: [],
    providers: [DateUtils]
})

export class ListaParcelaPagarComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public filtroParcelasAVencerForm: FormGroup;
    public filtroParcelasAVencer: FiltroParcelasAVencer;

    public novaDataVencimentoForm: FormGroup;

    busy: Subscription;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    parcelas: Parcela[];
    fornecedores: Fornecedor[];

    public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

    displayMessage: { [key: string]: string } = {};

    public data: any[];

    carregarTable = false;

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];

    selectedEntities: any[];

    diasDoMes: any[] = [];

    myOptionsFornecedores: IMultiSelectOption[] = [];

    mySettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'btn btn-default btn-secondary',
        containerClasses: 'dropdown-inline',
        showCheckAll: true,
        showUncheckAll: true,

        dynamicTitleMaxItems: 1,
        // maxHeight: '300px',
        displayAllSelectedText: true

        // isLazyLoad: true,
        //   loadViewDistance: 1,
        // stopScrollPropagation: true
    };

    myTexts: IMultiSelectTexts = {
        checkAll: 'Marcar todos',
        uncheckAll: 'Desmarcar todos',
        checked: 'selecionado',
        checkedPlural: 'selecionados',
        searchPlaceholder: 'Pesquisar',
        searchEmptyResult: 'Pesquisando...',
        searchNoRenderText: 'Não encontrado',
        defaultTitle: 'Selecione',
        allSelected: 'Todos',
    };

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

    constructor(private fb: FormBuilder,
        private alteraVencimentoParcelaService: AlterarVencimentoLoteService,
        private toastr: ToastsManager,
        vcr: ViewContainerRef,
        private report: ReportService
    ) {

        this.toastr.setRootViewContainerRef(vcr);

        this.validationMessages = {

            grupoEmpresaId: {
                required: 'O Grupo Empresa é requerido.'
            },
            empresaId: {
                required: 'A Empresa é requerida.'
            },
            dataVencimentoInicial: {
                required: 'A Dt. Vencimento Inicial é requerida.'

            },
            dataVencimentoFinal: {
                required: 'A Dt. Vencimento Final é requerida.'

            },
            fornecedores: {
                required: 'Escolha ao menos 1(um) fornecedor'
            }

        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.filtroParcelasAVencer = new FiltroParcelasAVencer();
        this.parcelas = [];
    }


    ngOnInit(): void {
        this.filtroParcelasAVencerForm = this.fb.group({
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            dataVencimentoInicial: ['', [Validators.required]],
            dataVencimentoFinal: ['', [Validators.required]],
            fornecedores: [[], [Validators.required]]
        });

        const date = new Date();

        this.novaDataVencimentoForm = this.fb.group({
            novaDataVencimento: [{
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            }],
            novoDiaVencimento: [{ value: '', disabled: true }]

        });

        this.alteraVencimentoParcelaService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            },
                () => this.errors);

        this.alteraVencimentoParcelaService.obterTodosEmpresa()
            .subscribe(empresas => {
                this.empresas = empresas;
            },
                () => this.errors);


        this.data = [];

        const myOptions = [];
        this.alteraVencimentoParcelaService.obterTodosFornecedor()
            .subscribe(fornecedores => {
                this.fornecedores = fornecedores,
                    this.fornecedores.forEach(element => {
                        myOptions.push({ id: element.id, name: element.pessoa.nome });
                        this.dropdownList.push({ id: element.id, itemName: element.pessoa.nome });
                    });
                return this.myOptionsFornecedores = myOptions;
            },
                () => this.errors);

        this.dropdownSettings = {
            singleSelection: false,
            text: "Selecione um Fornecedor",
            selectAllText: 'Marcar Todos',
            unSelectAllText: 'Desmarcar Todos',
            enableSearchFilter: true,
            classes: "myclass custom-class",
            badgeShowLimit: 1
        };

        for (let i = 1; i < 32; i++) {
            this.diasDoMes.push([i]);
        }
    }


    onItemSelect(item: any) {
        this.selectedItems.push(item);
    }
    OnItemDeSelect(item: any) {
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (item.id === this.selectedItems[i].id) {
                this.selectedItems.splice(i, 1);
            }
        }
    }

    onSelectAll(items: any) {
        this.selectedItems = [];
        for (let i = 0; i < items.length; i++) {
            this.selectedItems.push(items[i]);
        }
    }


    onDeSelectAll(items: any) {
        this.selectedItems = [];
    }


    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(this.filtroParcelasAVencerForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.filtroParcelasAVencerForm);
        });
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    public setSelectedEntities($event: any) {
        this.selectedEntities = $event;
    }

    filtrarParcelas(): void {

        this.carregarTable = true;
        this.data = [];
        if (this.filtroParcelasAVencerForm.dirty && this.filtroParcelasAVencerForm.valid) {
            const p = Object.assign({}, this.filtroParcelasAVencer, this.filtroParcelasAVencerForm.value);

            p.dataVencimentoInicial = p.dataVencimentoInicial.formatted;
            p.dataVencimentoFinal = p.dataVencimentoFinal.formatted;


            p.empresaId = p.empresaId.toString();
            p.grupoEmpresaId = p.grupoEmpresaId.toString();

            let fornecedores = "";

            if (this.selectedItems.length > 0) {
                for (let i = 0; i < this.selectedItems.length; i++) {
                    if (fornecedores !== "") {
                        fornecedores = fornecedores + "&" + "fornecedores[" + [i] + "]=" + this.selectedItems[i].id;
                    } else {
                        fornecedores = "fornecedores[" + [i] + "]=" + this.selectedItems[i].id;
                    }
                }

            } else {
                fornecedores = "fornecedores[]";
            }

            this.busy = this.alteraVencimentoParcelaService.obterParcelasPagarParaAlterar(p, fornecedores)
                .subscribe(result => {
                    this.data = result;
                    this.carregarTable = true;
                });

        }
    }


    habilitarDesabilitarOpcaoData(campoHabilitar, campoDesabilitar) {
        // alert("entrou no click ");
        if (campoDesabilitar === 'novoDiaVencimento') {
            this.novaDataVencimentoForm.patchValue({ novoDiaVencimento: '' });
        } else {
            this.novaDataVencimentoForm.patchValue({ novaDataVencimento: '' });
        }
        this.novaDataVencimentoForm.controls[campoDesabilitar].disable();
        this.novaDataVencimentoForm.controls[campoHabilitar].enable();
    }


    alterarVencimentoParcelas() {
        if (this.selectedEntities !== undefined && this.selectedEntities.length > 0) {
            let parcelasNovoVencimento: Parcela[];
            parcelasNovoVencimento = [];

            const p = this.novaDataVencimentoForm.value;

            for (let i = 0; i < this.selectedEntities.length; i++) {

                //  this.selectedEntities[i]._Cliente = null;
                if (p.novaDataVencimento !== undefined) {
                    // tslint:disable-next-line:max-line-length
                    this.selectedEntities[i].dataVencimento = [p.novaDataVencimento.date.year, p.novaDataVencimento.date.month, p.novaDataVencimento.date.day].join('/');
                    // this.selectedEntities[i].dataVencimento = null;
                    parcelasNovoVencimento.push(this.selectedEntities[i]);
                } else {
                    let dataVencimentoOld;
                    const dataAtual = new Date();

                    dataVencimentoOld = new Date(this.selectedEntities[i].dataVencimento);

                    const dia1 = dataAtual.getDate();
                    const mes1 = dataAtual.getMonth() + 1;
                    const ano1 = dataAtual.getFullYear();
                    const novaData1 = [ano1, mes1, dia1].join('/');


                    const dia = p.novoDiaVencimento;
                    const mes = dataVencimentoOld.getMonth() + 1;
                    const ano = dataVencimentoOld.getFullYear();
                    const novaData = [ano, mes, dia].join('/');

                    if (!this.validarData([dia, mes, ano].join('/'))) {
                        const d = new Date(novaData);
                        const anoC = d.getFullYear();
                        const mesC = d.getMonth();

                        const dataFimMes = new Date(anoC, mesC, 0);
                        this.selectedEntities[i].dataVencimento = [ano, mes, dataFimMes.getDate()].join('/');

                    } else {
                        this.selectedEntities[i].dataVencimento = [ano, mes, dia].join('/');
                    }

                    if (novaData > novaData1) {
                        parcelasNovoVencimento.push(this.selectedEntities[i]);
                    } else {
                        this.selectedEntities[i].dataVencimento = dataVencimentoOld;
                    }
                }

            }

            //  let parcelasAlteradas: Parcela[];

            //  parcelasAlteradas = this.selectedEntities;

            if (parcelasNovoVencimento.length > 0) {

                this.alteraVencimentoParcelaService.alterarVencimentoParcelas(parcelasNovoVencimento)
                    .subscribe(() => {
                        this.toastr.success('Vencimento da(s) parcela(s) alterada(s) com sucesso', 'Sucesso', { dismiss: 'controlled' })
                            .then((toast: Toast) => {
                                setTimeout(() => {
                                    this.toastr.dismissToast(toast);

                                }, 2500);
                            });

                        this.filtrarParcelas();

                    },
                        () => this.errors);
            }
        }
    }

    validarData(data): boolean {
        // tslint:disable-next-line:max-line-length
        const RegExPattern = /^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])      [\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/;

        if (!((data.match(RegExPattern)) && (data !== ''))) {
            return false;
        } else {
            return true;
        }
    }

      gerarExcel(model,id?)  {
        if (!this.report.gerarExcel(model, "Aleterar Vencimento em Lote",id))
            this.toastr.error("Não Possui Informações");
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Aleterar Vencimento em Lote");
    }
}

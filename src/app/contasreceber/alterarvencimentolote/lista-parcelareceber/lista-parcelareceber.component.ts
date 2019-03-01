import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { DateUtils } from '../../../utils/date.utils';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FiltroParcelasAVencer, Parcela, Cliente } from '../models/parcela';
import { Subscription, Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
//import { ToastsManager, Toast } from 'ng2-toastr';
import { AlterarVencimentoLoteService } from '../alterarvencimentolote.service';
//import { Observable } from 'rxjs/Observable';
import { UtilService } from '../../../services/util.service';
import { ToastsManager, Toast } from 'ng2-toastr';
import { ReportService } from '../../../utils/report.service';



@Component({
    selector: 'app-lista-parcelareceber',
    templateUrl: './lista-parcelareceber.component.html',
    styleUrls: [],
    providers: [DateUtils]
})

export class ListaParcelaReceberComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public filtroParcelasAVencerForm: FormGroup;
    public filtroParcelasAVencer: FiltroParcelasAVencer;

    public novaDataVencimentoForm: FormGroup;

    busy: Subscription;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    parcelas: Parcela[];
    clientes: Cliente[];

    //public myDatePickerOptions = DateUtils.getMyDatePickerOptions();
    public myDatePickerOptions = DateUtils.getMyDatePickerDefaultOptions();
    public myDatePickerOptionsNew = DateUtils.getMyDatePickerOptions();

    displayMessage: { [key: string]: string } = {};

    public data: any[];

    swal: SweetAlertAdviceService;

    carregarTable: boolean = false;

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    refazerFiltro: boolean;
    public minDate: Date;
    public errors: any[] = [];

    selectedEntities: any[];

    diasDoMes: any[] = [];

    myOptionsClientes: IMultiSelectOption[] = [];

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
        vcr: ViewContainerRef, private report: ReportService,
        private _utilService: UtilService
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
            clientes: {
                required: 'Escolha ao menos 1(um) cliente'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.filtroParcelasAVencer = new FiltroParcelasAVencer();
        this.parcelas = [];
        this.swal = new SweetAlertAdviceService();
    }


    ngOnInit(): void {
        this.filtroParcelasAVencerForm = this.fb.group({
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            dataVencimentoInicial: ['', [Validators.required]],
            dataVencimentoFinal: ['', [Validators.required]],
            clientes: [[], [Validators.required]]
        });

        let date = new Date();

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
                this.grupoEmpresas = grupoEmpresas
            },
                error => this.errors);

        this.alteraVencimentoParcelaService.obterTodosEmpresa()
            .subscribe(empresas => {
                this.empresas = empresas
            },
                error => this.errors);


        this.data = [];

        let myOptions = [];
        this.alteraVencimentoParcelaService.obterTodosCliente()
            .subscribe(clientes => {
                this.clientes = clientes,
                    this.clientes.forEach(element => {
                        myOptions.push({ id: element.id, name: element.pessoa.nome })
                        this.dropdownList.push({ id: element.id, itemName: element.pessoa.nome })
                    })
                return this.myOptionsClientes = myOptions;
            }
                ,
                error => this.errors);

        this.dropdownSettings = {
            singleSelection: false,
            text: "Selecione um cliente",
            selectAllText: 'Marcar Todos',
            unSelectAllText: 'Desmarcar Todos',
            enableSearchFilter: true,
            classes: "myclass custom-class",
            badgeShowLimit: 1
        };

        for (var i = 1; i < 32; i++) {
            this.diasDoMes.push([i]);
        }
    }


    onItemSelect(item: any) {
        this.selectedItems.push(item)
    }
    OnItemDeSelect(item: any) {
        for (var i = 0; i < this.selectedItems.length; i++) {
            if (item.id == this.selectedItems[i].id)
                this.selectedItems.splice(i, 1)
        }
    }

    onSelectAll(items: any) {
        this.selectedItems = [];
        for (var i = 0; i < items.length; i++) {
            this.selectedItems.push(items[i])
        }
    }

    onDeSelectAll(items: any) {
        this.selectedItems = [];
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
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

        if (this.filtroParcelasAVencerForm.valueChanges) {
            this.refazerFiltro = false;
          }

        if (this.filtroParcelasAVencerForm.dirty && this.filtroParcelasAVencerForm.valid) {
            let p = Object.assign({}, this.filtroParcelasAVencer, this.filtroParcelasAVencerForm.value);

            // p.dataVencimentoInicial = p.dataVencimentoInicial.formatted;
            // p.dataVencimentoFinal = p.dataVencimentoFinal.formatted;

            p.dataVencimentoInicial = new Date(p.dataVencimentoInicial).toDateString();
            p.dataVencimentoFinal = new Date(p.dataVencimentoFinal).toDateString();

            this.carregarTable = true;
            this.data = [];

            p.empresaId = p.empresaId.toString();
            p.grupoEmpresaId = p.grupoEmpresaId.toString();

            let clientes = "";

            if (this.selectedItems.length > 0) {
                for (var i = 0; i < this.selectedItems.length; i++) {
                    if (clientes != "")
                        clientes = clientes + "&" + "clientes[" + [i] + "]=" + this.selectedItems[i].id;
                    else
                        clientes = "clientes[" + [i] + "]=" + this.selectedItems[i].id

                }

            } else {
                clientes = "clientes[]"
            }

            this.busy = this.alteraVencimentoParcelaService.obterParcelasReceberParaAlterar(p, clientes)
                .subscribe(result => {
                    this.data = result;
                    this.carregarTable = true;
            });
           
        }

        this.refazerFiltro = true;
    }


    habilitarDesabilitarOpcaoData(campoHabilitar, campoDesabilitar) {
        // alert("entrou no click ");

        if (campoDesabilitar == 'novoDiaVencimento')
            this.novaDataVencimentoForm.patchValue({ novoDiaVencimento: '' });
        else
            this.novaDataVencimentoForm.patchValue({ novaDataVencimento: '' });
        this.novaDataVencimentoForm.controls[campoDesabilitar].disable();

        this.novaDataVencimentoForm.controls[campoHabilitar].enable();



    }


    alterarVencimentoParcelas() {

        if (this.selectedEntities != undefined && this.selectedEntities.length > 0) {
            let parcelasNovoVencimento: Parcela[];
            parcelasNovoVencimento = [];

            let p = this.novaDataVencimentoForm.value;

            for (var i = 0; i < this.selectedEntities.length; i++) {

                //  this.selectedEntities[i]._Cliente = null;

                if (p.novaDataVencimento != undefined) {
                     
                    this.selectedEntities[i].dataVencimento = [p.novaDataVencimento.date.year, p.novaDataVencimento.date.month, p.novaDataVencimento.date.day].join('/');
                    //this.selectedEntities[i].dataVencimento = null;
                    parcelasNovoVencimento.push(this.selectedEntities[i]);
                }
                else {

                    let dataVencimentoOld;
                    let dataAtual = new Date();

                    dataVencimentoOld = new Date(this.selectedEntities[i].dataVencimento);

                    let dia1 = dataAtual.getDate();
                    let mes1 = dataAtual.getMonth() + 1;
                    let ano1 = dataAtual.getFullYear();
                    let novaData1 = [ano1, mes1, dia1].join('/');


                    let dia = p.novoDiaVencimento;
                    let mes = dataVencimentoOld.getMonth() + 1;
                    let ano = dataVencimentoOld.getFullYear();
                    let novaData = [ano, mes, dia].join('/');

                    if (!this.validarData([dia, mes, ano].join('/'))) {
                        var d = new Date(novaData);
                        var anoC = d.getFullYear();
                        var mesC = d.getMonth();

                        var dataFimMes = new Date(anoC, mesC, 0);

                        this.selectedEntities[i].dataVencimento = [ano, mes, dataFimMes.getDate()].join('/');

                    }
                    else
                        this.selectedEntities[i].dataVencimento = [ano, mes, dia].join('/');

                      if (novaData > novaData1 || novaData === novaData1)
                        parcelasNovoVencimento.push(this.selectedEntities[i])
                      else
                         this.selectedEntities[i].dataVencimento = dataVencimentoOld;


                }

            }

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

                    }, () => this.errors);
            }
        }
    }

    validarData(data): boolean {
        var RegExPattern = /^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])      [\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/;

        if (!((data.match(RegExPattern)) && (data != '')))
            return false

        return true;
    }

    blurMultiSelect() {
        //alert('éntrou no blur')
    }

    gerarExcel(model,id?)  {
        if (!this.report.gerarExcel(model, "Aleterar Vencimento em Lote",id))
            this.toastr.error("Não Possui Informações");
    }
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Aleterar Vencimento em Lote");
    }

    definirValor(event) {
        this.minDate = event.value;
      }
}
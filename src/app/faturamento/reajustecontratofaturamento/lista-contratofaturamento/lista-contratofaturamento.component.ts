import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MaskService } from '../../../services/mask.service';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReajusteContratoFaturamentoService } from '../reajustecontratofaturamento.service';
import { FiltroContratosReajuste, ReajusteValores } from '../models/contratofaturamento';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { ContratoFaturamento, Cliente } from '../models/contratofaturamento';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
//import { ToastsManager, Toast } from 'ng2-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-lista-contratofaturamento',
    templateUrl: './lista-contratofaturamento.component.html',
    providers: [MaskService]

})

export class ListaContratoFaturamentoComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public filtroContratosReajusteForm: FormGroup;
    public filtroContratosReajuste: FiltroContratosReajuste;

    public reajusteValoresForm: FormGroup;
    public reajusteValores: ReajusteValores;

    busy: Subscription;

    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    contratosFaturamento: ContratoFaturamento[];
    clientes: Cliente[];

    mesAnoMask = this._maskService.MesAno();
    displayMessage: { [key: string]: string } = {};

    public data: any[];
    carregarTable: boolean = false;

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    anoMesCompetencia = this._maskService.competenciaPattern;

    public errors: any[] = [];

    selectedEntities: any[];

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

    constructor(
        private reajusteContratoFaturamentoService: ReajusteContratoFaturamentoService,
        private fb: FormBuilder,
        private _maskService: MaskService,
        private router: Router,
       // private toastr: ToastsManager,
        vcr: ViewContainerRef) {
       // this.toastr.setRootViewContainerRef(vcr);

        this.validationMessages = {

            grupoEmpresaId: {
                required: 'O Grupo Empresa é requerido.'
            },
            empresaId: {
                required: 'A Empresa é requerida.'
            },
            competencia: {
                required: 'A Competência é requerida.',
                pattern: 'Competência inválida'

            },
            clientes: {
                required: 'Escolha ao menos 1(um) cliente'
            }

        };


        this.genericValidator = new GenericValidator(this.validationMessages);
        this.filtroContratosReajuste = new FiltroContratosReajuste();
        this.reajusteValores = new ReajusteValores();
        this.contratosFaturamento = [];


    }

    ngOnInit(): void {
        console.log(this.anoMesCompetencia);
        this.filtroContratosReajusteForm = this.fb.group({
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            competencia: ['', [Validators.required, Validators.minLength(7), 
                               Validators.pattern(this.anoMesCompetencia)]],
            clientes: [[], [Validators.required]]
        });

        this.reajusteValoresForm = this.fb.group({
            valorReajuste: [0, [Validators.required]],
            tipoReajuste: ['%', [Validators.required]],
            competencia: ['', Validators.minLength(7)]
        });

        this.reajusteContratoFaturamentoService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                error => this.errors);

        this.reajusteContratoFaturamentoService.obterTodosEmpresa()
            .subscribe(empresas => {
                this.empresas = empresas
            },
                error => this.errors);


        this.data = [];

        let myOptions = [];
        this.reajusteContratoFaturamentoService.obterTodosCliente()
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
    }

    onSelectAll(items: any) {
        console.log('onSelectAll')
        console.log(items);
        this.selectedItems = [];
        for (var i = 0; i < items.length; i++) {

            this.selectedItems.push(items[i])
        }

    }


    onDeSelectAll(items: any) {
        console.log('onDeSelectAll')
        console.log(items);
        this.selectedItems = [];
    }

    onItemSelect(item: any) {
        console.log('onItemSelect')
        console.log(item);
        this.selectedItems.push(item)
        console.log(this.selectedItems);
    }

    OnItemDeSelect(item: any) {
        console.log('OnItemDeSelect');
        console.log(item);
        for (var i = 0; i < this.selectedItems.length; i++) {
            if (item.id == this.selectedItems[i].id)
                this.selectedItems.splice(i, 1)
        }


        console.log(this.selectedItems);
    }


    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.filtroContratosReajusteForm);
        });


    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    public setSelectedEntities($event: any) {
        this.selectedEntities = $event;
    }

    filtrarContratosFaturamento(): void {
        //  console.log(this.filtroContratosReajusteForm.get('tipoReajuste').value)
        this.reajusteValoresForm.patchValue({
            //  tipoReajuste: '%',
            competencia: this.filtroContratosReajusteForm.get('competencia').value
        });
        this.carregarTable = true;
        this.data = [];

        if (this.filtroContratosReajusteForm.dirty && this.filtroContratosReajusteForm.valid) {
            let p = Object.assign({}, this.filtroContratosReajuste, this.filtroContratosReajusteForm.value);


            p.empresaId = p.empresaId.toString();
            p.grupoEmpresaId = p.grupoEmpresaId.toString();
            p.competencia = p.competencia.toString();

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

            this.busy = this.reajusteContratoFaturamentoService.obterTodosContratoParaReajustar(p, clientes)
                .subscribe(result => {
                    this.data = result;
                    this.carregarTable = true;
                    console.log('resultado contratofaturamento');
                    console.log(this.data)


                })


        }
    }

    reajusteContratosFaturamento(): void {
        if (this.selectedEntities != undefined && this.selectedEntities.length > 0) {

            console.log(this.reajusteValoresForm.value);

            let p = Object.assign({}, this.reajusteValores, this.reajusteValoresForm.value);


            this.busy = this.reajusteContratoFaturamentoService.reajustarContratos(p, this.selectedEntities)
                .subscribe(parcelas => {
                    // this.toastr.success('Contrato(s) reajustado(s) com sucesso', 'Sucesso', { dismiss: 'controlled' })
                    //     .then((toast: Toast) => {
                    //         setTimeout(() => {
                    //             this.toastr.dismissToast(toast);

                    //         }, 2500);
                    //     });

                    this.filtrarContratosFaturamento();

                },
                    error => this.errors);


         }
    }

    habilitarDesabilitarOpcaoData(campoHabilitar, campoDesabilitar) {
        // alert("entrou no click ");

        if (campoDesabilitar == 'percentualReajuste')
            this.reajusteValoresForm.patchValue({ percentualReajuste: '' });
        else
            this.reajusteValoresForm.patchValue({ valorReajuste: '' });
        this.reajusteValoresForm.controls[campoDesabilitar].disable();

        this.reajusteValoresForm.controls[campoHabilitar].enable();



    }




}
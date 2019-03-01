import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ElementRef, ViewChildren } from '@angular/core';
import { ExpandOperator } from 'rxjs/operators/expand';
import { DadosSangriaCaixa } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { ContaCorrente } from '../../../cadastros/contacorrente/models/contacorrente';

@Component({
    selector: 'app-sangriacaixa',
    templateUrl: './sangriacaixa.component.html',
    styleUrls: ['./sangriacaixa.component.css']
})
export class SangriaCaixaComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    swal: SweetAlertAdviceService;


    public dadosSangriaCaixa: DadosSangriaCaixa;
    public dadosSangriaCaixaForm: FormGroup;
    public contasCorrente: ContaCorrente[];

    public data: any[];

    selectedEntities: any[];

    public errors: any[] = [];

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;


    constructor(public tituloParcelaBaixaService: TituloParcelaBaixaService,
        private fb: FormBuilder) {

        this.validationMessages = {
            contaCorrenteUsuarioId: {
                required: 'Conta Caixa é requirida.'
            }
        }
        this.swal = new SweetAlertAdviceService();
        this.genericValidator = new GenericValidator(this.validationMessages);
    }



    ngOnInit() {
        this.dadosSangriaCaixaForm = this.fb.group({
            valorSangriaDinheiro: 0,
            valorSangriaCheque: 0,
            valorSangriaCartao: 0,
            contaCorrenteUsuarioId: ['', [Validators.required]],
            contaCorrenteDestinoId: ''
        });

        this.tituloParcelaBaixaService.obterTodosContaCorrenteCaixa()
            .subscribe(contasCorrente => {
                this.contasCorrente = contasCorrente
            },
                errors => this.errors);
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.dadosSangriaCaixaForm);
        });

    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }


    sangriaCaixa() {



        this.tituloParcelaBaixaService.sangriaCaixa(this.dadosSangriaCaixa)
            .subscribe(
                result => {
                    this.swal.showSwalSuccess('Sangria de Caixa realizada com sucesso!');
                    this.close();
                },
                errors => this.errors);

    }


    obterTodosMovimentoContaSangria(id) {

        this.tituloParcelaBaixaService.obterTodosMovimentoContaSangria(id)
            .subscribe(
                result => {
                    this.data = result;
                },
                errors => this.errors);
    }

    public setSelectedEntities($event: any) {
        this.selectedEntities = $event;
    }

}
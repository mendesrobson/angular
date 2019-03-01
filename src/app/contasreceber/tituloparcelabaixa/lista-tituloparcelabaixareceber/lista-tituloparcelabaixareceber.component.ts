import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaixaPagarReceber } from '../models/tituloparcelabaixa';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable, Subscription } from 'rxjs';
import { ContaCorrente } from '../../../cadastros/contacorrente/models/contacorrente';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app-lista-tituloparcelabaixareceber',
    templateUrl: './lista-tituloparcelabaixareceber.component.html'

})
export class ListaTituloParcelaBaixaReceberComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public baixaPagarReceber: BaixaPagarReceber[];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "nome";
    public sortOrder = "asc";
    swal: SweetAlertAdviceService;

    public contaCorrenteForm: FormGroup;
    public contasCorrente: ContaCorrente[];

    public showModalSangria: boolean = false;
    public showModalAvulsoReforco: boolean = false;
    public tipoOperacao: string;

    public errors: any[] = [];
    public data: any[];
    public modalVisible: boolean = false;

    public sub: Subscription;
    public natureza: string = "";

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    displayMessage: { [key: string]: string } = {};

    constructor(public tituloParcelaBaixaService: TituloParcelaBaixaService,
        private router: Router, private report: ReportService,
        private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
        private route: ActivatedRoute, private toastr: ToastsManager,
        vcr: ViewContainerRef, private fb: FormBuilder) {

        this.toastr.setRootViewContainerRef(vcr);

        this.validationMessages = {
            contaCorrenteId: {
                required: 'Conta Corrente requerida.'
            }
        };
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit(): void {

        this.contaCorrenteForm = this.fb.group({
            contaCorrenteId: ['', [Validators.required]]
        });

        this.baixaPagarReceber = new Array();
        this.data = new Array();

        this.sub = this.route.params.subscribe(
            params => {
                this.natureza = params['natureza'];

                if (this.natureza == "receber") {
                    this.tituloParcelaBaixaService.obterTodosBaixaReceber()
                        .subscribe(baixaPagarReceber => {
                            this.baixaPagarReceber = baixaPagarReceber
                            this.data = baixaPagarReceber
                        }, () => this.errors);
                } else if (this.natureza == "pagar") {
                    this.tituloParcelaBaixaService.obterTodosBaixaPagar()
                        .subscribe(baixaPagarReceber => {
                            this.baixaPagarReceber = baixaPagarReceber
                            this.data = baixaPagarReceber
                        }, () => this.errors);
                }
            }
        );

        this.tituloParcelaBaixaService.obterTodosContaCorrenteCaixa()
            .subscribe(contasCorrente => {
                this.contasCorrente = contasCorrente
            }, () => this.errors);
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.contaCorrenteForm);
        });
    }

    editarTituloParcelaBaixa(id) {
        this.tituloParcelaBaixaComponent.Parcelas = new Array();
        this.tituloParcelaBaixaComponent.BaixaPagarReceber = new BaixaPagarReceber();
        this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos = new Array();
        if (this.natureza == 'receber') {
            this.router.navigate(['tituloparcelabaixa/editar/receber/' + id]);
        } else {
            this.router.navigate(['tituloparcelabaixa/editar/pagar/' + id]);
        }
    }

    cadastrarTituloParcelaBaixa() {
        this.tituloParcelaBaixaComponent.Parcelas = new Array();
        this.tituloParcelaBaixaComponent.BaixaPagarReceber = new BaixaPagarReceber();
        this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos = new Array();

        if (this.natureza == 'receber') {
            this.router.navigate(['tituloparcelabaixa/adicionar/receber']);
        } else {
            this.router.navigate(['tituloparcelabaixa/adicionar/pagar']);
        }
    }

    aberturaCaixa() {
        if (this.contaCorrenteForm.dirty && this.contaCorrenteForm.valid) {
            let idContaCorrente = this.contaCorrenteForm.controls['contaCorrenteId'].value;

            this.tituloParcelaBaixaService.aberturaCaixa(idContaCorrente)
                .subscribe(
                    () => {
                        this.swal.showSwalSuccess('Caixa aberto com sucesso');
                        this.ngOnInit();
                    }
                );
        }
    }

    fechamentoCaixa() {
        if (this.contaCorrenteForm.dirty && this.contaCorrenteForm.valid) {
            let idContaCorrente = this.contaCorrenteForm.controls['contaCorrenteId'].value;

            this.tituloParcelaBaixaService.fechamentoCaixa(idContaCorrente)
                .subscribe(
                    () => {
                        this.swal.showSwalSuccess('Caixa fechado com sucesso');
                        this.ngOnInit();
                    }
                );
        }

    }

    public showModal(): void {
        this.modalVisible = true;
    }

    public hideModal(): void {
        this.modalVisible = false;
    }

    public operacaoAbeturaFechamento(tipoOperacao) {

        if (this.tipoOperacao == 'ABE')
            this.aberturaCaixa()
        else
            this.fechamentoCaixa();

    }

    gerarExcel(model,id?) {
        if (!this.report.gerarExcel(model, "Baixar Parcelas",id))
            this.toastr.error("Não Possui Informações");
    }
    
    gerarPDF(model: string) {
        this.report.pdfFile(model, "Baixar Parcelas");
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }
}
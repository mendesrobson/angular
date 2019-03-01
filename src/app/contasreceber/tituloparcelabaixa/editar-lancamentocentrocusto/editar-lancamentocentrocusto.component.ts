import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { MovimentoContaCentro, CentroCusto } from '../models/tituloparcelabaixa';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { ListaLancamentoCentroCustoComponent } from '../lista-lancamentocentrocusto/lista-lancamentocentrocusto.component';

@Component({
    selector: 'app-editar-lancamentocentrocusto',
    templateUrl: './editar-lancamentocentrocusto.component.html',
    styleUrls: ['./editar-lancamentocentrocusto.component.css']
})
export class EditarLancamentoCentroCustoComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    showModal = false;

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public movimentoContaCentro: MovimentoContaCentro;
    public movimentoContaCentros = [];
    public lancamentoCentroCustoForm: FormGroup;
    //public movimentoContaId = 0;

    public centroCustos: CentroCusto[];

    swal: SweetAlertAdviceService;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];


    constructor(private tituloParcelaBaixaService: TituloParcelaBaixaService,
        private _maskService: MaskService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private listCentroCusto: ListaLancamentoCentroCustoComponent,
        private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent) {

        this.validationMessages = {
            centroCustoId: {
                required: 'Centro Custo requerido.'
            },
            percentual: {
                required: 'Percentual requerido.'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.movimentoContaCentro = new MovimentoContaCentro();
        this.swal = new SweetAlertAdviceService();

    }

    ngOnInit() {


        this.lancamentoCentroCustoForm = this.fb.group({
            tituloId: 0,
            centroCustoId: [0, [Validators.required]],
            // codigo: '',
            // descricao: '',
            percentual: [0, [Validators.required]]
        });




        this.tituloParcelaBaixaService.obterTodosCentroCusto()
            .subscribe(centroCustos => {
                this.centroCustos = centroCustos
            },
                error => this.errors);


        console.log('editar');
        console.log(this.tituloParcelaBaixaComponent.MovimentoContaCentro)

        this.preencherMovimentoContaCentroCustoForm(this.tituloParcelaBaixaComponent.MovimentoContaCentro);

    }

    ngAfterViewInit(): void {
        // let controlBlurs: Observable<any>[] = this.formInputElements
        //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Observable.merge(...controlBlurs).subscribe(value => {
        //   this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

        // });
    }

    editarCentroCusto() {
        if (this.lancamentoCentroCustoForm.dirty && this.lancamentoCentroCustoForm.valid) {
            let p = Object.assign({}, this.movimentoContaCentroCusto, this.lancamentoCentroCustoForm.value);

            for (var i = 0; i < this.centroCustos.length; i++) {
                if (p.centroCustoId == this.centroCustos[i].id) {
                    p.centroCusto = this.centroCustos[i];

                }
            }

            p.centroResultado = null;



            for (var i = 0; i < this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                if (this.tituloParcelaBaixaComponent.MovimentoContaCentro.id == this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                    this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i] = p;
                }
            }

            if (!this.tituloParcelaBaixaService.validarPercentual(this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null))) {

                this.listCentroCusto.centroCustoErro('Centro de Custo não gravado, os valores excedem 100%');
                for (var i = 0; i < this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                    if (p.id == this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                        this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
                    }
                }

                this.listCentroCusto.atualizaStorage();
                this.close()

            } else {

                this.listCentroCusto.atualizaStorage();

                this.listCentroCusto.centroCustoGravado('Centro Custo, Atualizado com sucesso!');
                this.close();
            }



        }

    }

    preencherMovimentoContaCentroCustoForm(movimentoContaCentro: MovimentoContaCentro): void {
        this.movimentoContaCentro = movimentoContaCentro;
        this.lancamentoCentroCustoForm.patchValue({
            movimentoContaId: this.movimentoContaCentro.id,
            centroCustoId: this.movimentoContaCentro.centroCusto.id,
            percentual: this.movimentoContaCentro.percentual
        })

    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }



    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

}



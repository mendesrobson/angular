import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { MovimentoContaCentro, CentroResultado } from '../models/tituloparcelabaixa';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';

import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { ListaLancamentoCentroResultadoComponent } from '../lista-lancamentocentroresultado/lista-lancamentocentroresultado.component';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';


@Component({
    selector: 'app-editar-lancamentocentroresultado',
    templateUrl: './editar-lancamentocentroresultado.component.html',
    styleUrls: ['./editar-lancamentocentroresultado.component.css']
})
export class EditarLancamentoCentroResultadoComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    showModal = false;

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public movimentoContaCentro: MovimentoContaCentro;
    public movimentoContaCentros = [];
    public lancamentoCentroResultadoForm: FormGroup;
    //public movimentoContaId = 0;

    public centroResultados: CentroResultado[];

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
        private listCentroResultado: ListaLancamentoCentroResultadoComponent,
        private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent) {

        this.validationMessages = {
            centroResultadoId: {
                required: 'Centro Resultado requerido.'
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


        this.lancamentoCentroResultadoForm = this.fb.group({
            movimentoContaId: 0,
            centroResultadoId: [0, [Validators.required]],
            // codigo: '',
            // descricao: '',
            percentual: [0, [Validators.required]]
        });




        this.tituloParcelaBaixaService.obterTodosCentroResultado()
            .subscribe(centroResultados => {
                this.centroResultados = centroResultados
            },
                error => this.errors);


        this.preencherMovimentoContaCentroResultadoForm(this.tituloParcelaBaixaComponent.MovimentoContaCentro);

    }

    ngAfterViewInit(): void {
        // let controlBlurs: Observable<any>[] = this.formInputElements
        //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Observable.merge(...controlBlurs).subscribe(value => {
        //   this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

        // });
    }

    editarCentroResultado() {
        if (this.lancamentoCentroResultadoForm.dirty && this.lancamentoCentroResultadoForm.valid) {
            let p = Object.assign({}, this.movimentoContaCentro, this.lancamentoCentroResultadoForm.value);

            for (var i = 0; i < this.centroResultados.length; i++) {
                if (p.centroResultadoId == this.centroResultados[i].id) {
                    p.centroResultado = this.centroResultados[i];

                }
            }

            p.centroCusto = null;



            for (var i = 0; i < this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                if (this.tituloParcelaBaixaComponent.MovimentoContaCentro.id == this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                    this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i] = p;
                }
            }

            if (!this.tituloParcelaBaixaService.validarPercentual(this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null))) {

                this.listCentroResultado.centroResultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
                for (var i = 0; i < this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                    if (p.id == this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                        this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
                    }
                }

                this.listCentroResultado.atualizaStorage();
                this.close()

            } else {





                this.listCentroResultado.atualizaStorage();

                this.listCentroResultado.centroResultadoGravado('Centro Resultado, Atualizado com sucesso!');
                this.close();


            }

        }

    }

    preencherMovimentoContaCentroResultadoForm(movimentoContaCentro: MovimentoContaCentro): void {
        this.movimentoContaCentro = movimentoContaCentro;
        this.lancamentoCentroResultadoForm.patchValue({
            movimentoContaId: this.movimentoContaCentro.id,
            centroResultadoId: this.movimentoContaCentro.centroResultado.id,
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



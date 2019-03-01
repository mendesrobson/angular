import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { MovimentoContaCentro, CentroResultado } from '../models/movimentoconta';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { MovimentoContaService } from '../movimentoconta.service';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ListaMovimentoContaCentroResultadoComponent } from '../lista-movimentocontacentroresultado/lista-movimentocontacentroresultado.component';
import { MovimentoContaComponent } from '../movimentoconta.component';

@Component({
    selector: 'app-editar-movimentocontacentroresultado',
    templateUrl: './editar-movimentocontacentroresultado.component.html',
    styleUrls: ['./editar-movimentocontacentroresultado.component.css']
})
export class EditarMovimentoContaCentroResultadoComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    showModal = false;

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public movimentoContaCentro: MovimentoContaCentro;
    public movimentoContaCentros = [];
    public movimentoContaCentroResultadoForm: FormGroup;
    public movimentoContaId = 0;

    public centroResultados: CentroResultado[];

    swal: SweetAlertAdviceService;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];


    constructor(private movimentoContaService: MovimentoContaService,
        private _maskService: MaskService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private listCentroResultado: ListaMovimentoContaCentroResultadoComponent,
        private movimentoContaComponent: MovimentoContaComponent) {

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

        if (this.route.snapshot.params['id'] == undefined)
            this.movimentoContaId = 0
        else
            this.movimentoContaId = this.route.snapshot.params['id'];

        this.movimentoContaCentroResultadoForm = this.fb.group({
            movimentoContaId: 0,
            centroResultadoId: [0, [Validators.required]],
            // codigo: '',
            // descricao: '',
            percentual: [0, [Validators.required]]
        });




        this.movimentoContaService.obterTodosCentroResultado()
            .subscribe(centroResultados => {
                this.centroResultados = centroResultados
            },
                error => this.errors);


        console.log('editar');
        console.log(this.movimentoContaComponent.MovimentoContaCentro)

        this.preencherMovimentoContaCentroResultadoForm(this.movimentoContaComponent.MovimentoContaCentro);

    }

    ngAfterViewInit(): void {
        // let controlBlurs: Observable<any>[] = this.formInputElements
        //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Observable.merge(...controlBlurs).subscribe(value => {
        //   this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

        // });
    }

    editarCentroResultado() {
        if (this.movimentoContaCentroResultadoForm.dirty && this.movimentoContaCentroResultadoForm.valid) {
            let p = Object.assign({}, this.movimentoContaCentro, this.movimentoContaCentroResultadoForm.value);

            for (var i = 0; i < this.centroResultados.length; i++) {
                if (p.centroResultadoId == this.centroResultados[i].id) {
                    p.centroResultado = this.centroResultados[i];

                }
            }

            p.centroCusto = null;



            for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                if (this.movimentoContaComponent.MovimentoContaCentro.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                    this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i] = p;
                }
            }

            if (!this.movimentoContaService.validarPercentual(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null))) {

                this.listCentroResultado.centroResultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
                for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                    if (p.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
                    }
                }

                this.listCentroResultado.atualizaStorage();
                this.close()

            } else {

                if (this.movimentoContaId > 0) {


                } else {



                    this.listCentroResultado.atualizaStorage();

                    this.listCentroResultado.centroResultadoGravado('Centro Resultado, Atualizado com sucesso!');
                    this.close();

                }
            }

        }

    }

    preencherMovimentoContaCentroResultadoForm(movimentoContaCentro: MovimentoContaCentro): void {
        this.movimentoContaCentro = movimentoContaCentro;
        this.movimentoContaCentroResultadoForm.patchValue({
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



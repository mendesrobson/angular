import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { MovimentoContaCentro, CentroCusto } from '../models/movimentoconta';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { MovimentoContaService } from '../movimentoconta.service';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ListaMovimentoContaCentroCustoComponent } from '../lista-movimentocontacentrocusto/lista-movimentocontacentrocusto.component';
import { MovimentoContaComponent } from '../movimentoconta.component';

@Component({
    selector: 'app-editar-movimentocontacentrocusto',
    templateUrl: './editar-movimentocontacentrocusto.component.html',
    styleUrls: ['./editar-movimentocontacentrocusto.component.css']
})
export class EditarMovimentoContaCentroCustoComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    showModal = false;

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public movimentoContaCentro: MovimentoContaCentro;
    public movimentoContaCentros = [];
    public movimentoContaCentroCustoForm: FormGroup;
    public movimentoContaId = 0;

    public centroCustos: CentroCusto[];

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
        private listCentroCusto: ListaMovimentoContaCentroCustoComponent,
        private movimentoContaComponent: MovimentoContaComponent) {

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

        if (this.route.snapshot.params['id'] == undefined)
            this.movimentoContaId = 0
        else
            this.movimentoContaId = this.route.snapshot.params['id'];

        this.movimentoContaCentroCustoForm = this.fb.group({
            tituloId: 0,
            centroCustoId: [0, [Validators.required]],
            // codigo: '',
            // descricao: '',
            percentual: [0, [Validators.required]]
        });




        this.movimentoContaService.obterTodosCentroCusto()
            .subscribe(centroCustos => {
                this.centroCustos = centroCustos
            },
                error => this.errors);


        console.log('editar');
        console.log(this.movimentoContaComponent.MovimentoContaCentro)

        this.preencherMovimentoContaCentroCustoForm(this.movimentoContaComponent.MovimentoContaCentro);

    }

    ngAfterViewInit(): void {
        // let controlBlurs: Observable<any>[] = this.formInputElements
        //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Observable.merge(...controlBlurs).subscribe(value => {
        //   this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

        // });
    }

    editarCentroCusto() {
        if (this.movimentoContaCentroCustoForm.dirty && this.movimentoContaCentroCustoForm.valid) {
            let p = Object.assign({}, this.movimentoContaCentroCusto, this.movimentoContaCentroCustoForm.value);

            for (var i = 0; i < this.centroCustos.length; i++) {
                if (p.centroCustoId == this.centroCustos[i].id) {
                    p.centroCusto = this.centroCustos[i];

                }
            }

            p.centroResultado = null;



            for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                if (this.movimentoContaComponent.MovimentoContaCentro.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                    this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i] = p;
                }
            }

            if (!this.movimentoContaService.validarPercentual(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null))) {

                this.listCentroCusto.centroCustoErro('Centro de Custo não gravado, os valores excedem 100%');
                for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
                    if (p.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
                        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
                    }
                }

                this.listCentroCusto.atualizaStorage();
                this.close()

            } else {

                if (this.movimentoContaId > 0) {


                } else {



                    this.listCentroCusto.atualizaStorage();

                    this.listCentroCusto.centroCustoGravado('Centro Custo, Atualizado com sucesso!');
                    this.close();

                }
            }

        }

    }

    preencherMovimentoContaCentroCustoForm(movimentoContaCentro: MovimentoContaCentro): void {
        this.movimentoContaCentro = movimentoContaCentro;
        this.movimentoContaCentroCustoForm.patchValue({
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



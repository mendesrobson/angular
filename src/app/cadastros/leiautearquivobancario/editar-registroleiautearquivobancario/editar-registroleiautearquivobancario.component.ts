import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { LeiauteArquivoBancarioService } from "../leiautearquivobancario.service";
import { LeiauteArquivoBancarioComponent } from "../leiautearquivobancario.component";
import { FormBuilder, FormControlName, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { RegLeiauteArquivoBancario } from "../models/leiautearquivobancario";
import { GenericValidator } from "../../../validation/generic-form-validator";
import { Observable } from "rxjs/Observable";

import { ListaRegistroLeiauteArquivoBancarioComponent } from "../lista-registroleiautearquivobancario/lista-registroleiautearquivobancario.component";

@Component({
    selector: 'app-editar-registroleiautearquivobancario',
    templateUrl: './editar-registroleiautearquivobancario.component.html',
    styleUrls: ['../css-modal.component.css']
})
export class EditarRegistroLeiauteArquivoBancarioComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public regLeiauteArquivoBancario: RegLeiauteArquivoBancario;
    public regLeiauteArquivoBancarioForm: FormGroup;

    public leiauteArquivoBancarioId = 0;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];

    constructor(private leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private listRegistroLeiauteArquivoBancario: ListaRegistroLeiauteArquivoBancarioComponent) {
        this.validationMessages = {
            codigo: {
                required: 'Código requerido.'
            },
            descricao: {
                required: 'Descrição requerido.'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);


    }
    ngOnInit(): void {
        if (this.route.snapshot.params['id'] == undefined)
            this.leiauteArquivoBancarioId = 0
        else
            this.leiauteArquivoBancarioId = this.route.snapshot.params['id'];

        this.regLeiauteArquivoBancarioForm = this.fb.group({
            id: 0,
            leiauteArquivoBancarioId: '',
            codigo: ['', [Validators.required]],
            descricao: ['', Validators.required]
        });


        this.preencherForm(this.leiauteArquivoBancarioComponent.regLeiauteArquivoBancario);

    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.regLeiauteArquivoBancarioForm);
        });
    }

    preencherForm(regLeiauteArquivoBancario: RegLeiauteArquivoBancario) {
        this.regLeiauteArquivoBancario = regLeiauteArquivoBancario;

        this.regLeiauteArquivoBancarioForm.patchValue({
            id: this.regLeiauteArquivoBancario.id,
            codigo: this.regLeiauteArquivoBancario.codigo,
            descricao: this.regLeiauteArquivoBancario.descricao
        })

    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    editarRegistroLeiaute() {
        if (this.regLeiauteArquivoBancarioForm.dirty && this.regLeiauteArquivoBancarioForm.valid) {
            let p = Object.assign({}, this.regLeiauteArquivoBancario, this.regLeiauteArquivoBancarioForm.value);

            if (this.leiauteArquivoBancarioId > 0) {
                p.leiauteArquivoBancarioId = this.leiauteArquivoBancarioId;
                this.leiauteArquivoBancarioService.atualizarRegLeiauteArquivoBancario(p)
                    .subscribe(
                        result => {
                            for (let i = 0; this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length > i; i++) {
                                if (result.id == this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[i].id) {
                                    this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[i] = result;
                                }
                            }

                            this.listRegistroLeiauteArquivoBancario.registroLeiauteGravado('Registro editado com sucesso!');
                            this.close();
                        },
                        error => {
                            this.errors;
                        }
                    );

            }
            else {
                this.regLeiauteArquivoBancario = p;

                for (let i = 0; this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length > i; i++) {
                    if (this.regLeiauteArquivoBancario.id == this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[i].id) {
                        this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[i] = this.regLeiauteArquivoBancario;
                    }
                }

                this.listRegistroLeiauteArquivoBancario.registroLeiauteGravado('Registro editado com sucesso!');
                this.close();

            }
        }

    }
}
import { Component, OnInit, ElementRef, Input, Output, ViewChildren, EventEmitter } from "@angular/core";
import { FormControlName, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegLeiauteArquivoBancario } from "../models/leiautearquivobancario";
import { GenericValidator } from "../../../validation/generic-form-validator";
import { LeiauteArquivoBancarioComponent } from "../leiautearquivobancario.component";
import { LeiauteArquivoBancarioService } from "../leiautearquivobancario.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ListaRegistroLeiauteArquivoBancarioComponent } from "../lista-registroleiautearquivobancario/lista-registroleiautearquivobancario.component";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'app-adicionar-registroleiautearquivobancario',
    templateUrl: './adicionar-registroleiautearquivobancario.component.html',
    styleUrls: ['../css-modal.component.css']
})
export class AdicionarRegistroLeiauteArquivoBancarioComponent implements OnInit {
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
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent,
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
        this.regLeiauteArquivoBancario = new RegLeiauteArquivoBancario();


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
        })
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.regLeiauteArquivoBancarioForm);
        });
    }

    registroLeiauteArquivoBancario() {
        if (this.regLeiauteArquivoBancarioForm.dirty && this.regLeiauteArquivoBancarioForm.valid) {
            let p = Object.assign({}, this.registroLeiauteArquivoBancario, this.regLeiauteArquivoBancarioForm.value);

            if (this.leiauteArquivoBancarioId > 0) {
                p.leiauteArquivoBancarioId = this.leiauteArquivoBancarioId;

                this.leiauteArquivoBancarioService.adicionarRegLeiauteArquivoBancario(p)
                    .subscribe(
                        result => {
                            this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.push(result);
                            this.listRegistroLeiauteArquivoBancario.registroLeiauteGravado('Registro do Leiaute adicionado com sucesso');
                            this.close();
                        },
                        error => {
                            this.errors;
                        }
                    );

            }
            else {
                p.id = 0;
                if (this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length > 0) {
                    p.id = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.length + 1;
                }

                this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario.push(p);
                this.listRegistroLeiauteArquivoBancario.registroLeiauteGravado('Registro do Leiaute adicionar com sucesso');
                this.close();

            }
        }
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
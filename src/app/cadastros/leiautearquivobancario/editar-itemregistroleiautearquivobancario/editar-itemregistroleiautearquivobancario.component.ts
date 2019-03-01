import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { FormControlName, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IteRegLeiauteArquivoBancario, Campos } from "../models/leiautearquivobancario";
import { GenericValidator } from "../../../validation/generic-form-validator";
import { LeiauteArquivoBancarioService } from "../leiautearquivobancario.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LeiauteArquivoBancarioComponent } from "../leiautearquivobancario.component";
import { Observable } from "rxjs/Observable";
import { ListaItemRegistroLeiauteArquivoBancario } from "../lista-itemregistroleiautearquivobancario/lista-itemregistroleiautearquivobancario.component";

@Component({
    selector: 'app-editar-itemregistroleiautearquivobancario',
    templateUrl: './editar-itemregistroleiautearquivobancario.component.html',
    styleUrls: ['./editar-itemregistroleiautearquivobancario.component.css']
})
export class EditarItemRegistroLeiauteArquivoBancarioComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @Input() ind: number = 0;
    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public ItemRegLeiauteArquivoBancario: IteRegLeiauteArquivoBancario;
    public ItemRegLeiauteArquivoBancarioForm: FormGroup;

    public origemvalores = [{id: 'Tag', descricao: 'Tag'}, {id: 'Default', descricao: 'Default'}, {id: 'Sequencial', descricao: 'Sequencial'}];
    public tipos = [{id: "A", descricao: "Alfanumérico"}, {id: "N", descricao: "Numérico"}];

    public leiauteArquivoBancarioId = 0;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];
    public droppedCampos: any[] = [];
    public dragEnabled = true;

    public campos: Campos[];

    label: any;
    tooltip: any;
    tooltipEnabled: any;

    constructor(private leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent,
        private listaItemRegistroLeiaute: ListaItemRegistroLeiauteArquivoBancario) {

        this.validationMessages = {
            campo: {
                required: 'Informe o Campo'
            },
            tipo: {
                required: 'Informe o Tipo'
            },
            valor: {
                required: 'Informe o Valor'
            },
            posicaoInicial: {
                required: 'Informe a Posição Inicial'
            },
            posicaoFinal: {
                required: 'Informe a Posição Final'
            },
            origemValor: {
                required: 'Informa a Origem do Valor'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.ItemRegLeiauteArquivoBancario = new IteRegLeiauteArquivoBancario();

        this.label = {
            visible: true,
            format: (value) => {
                return this.format(value);
            },
            position: "top"
        };
        this.tooltip = {
            enabled: true,
            format: (value) => {
                return this.format(value);
            },
            showMode: "always", 
            position: "bottom"
        };
        this.tooltipEnabled = {
            enabled: true
        };


    }

    format(value){
        return value + "%";
    }
    
    ngOnInit(): void {
        if (this.route.snapshot.params['id'] == undefined)
            this.leiauteArquivoBancarioId = 0
        else
            this.leiauteArquivoBancarioId = this.route.snapshot.params['id'];

        this.ItemRegLeiauteArquivoBancarioForm = this.fb.group({
            campo: ['', [Validators.required]],
            origemValor: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            valor: ['', [Validators.required]],
            posicaoInicial: ['', [Validators.required]],
            posicaoFinal: ['', [Validators.required]],
            flagCampoRetorno: 'N'

        });

        this.campos = [];
        this.leiauteArquivoBancarioService.obterCamposLeiauteArquivoBancario()
            .subscribe(
                result => {
                    for (var i = 0; i < result.length; i++) {

                        this.campos[i] = { name: '{{' + result[i] + '}}', type: 'campo' }
                    }

                }
            )

        this.preencherForm(this.leiauteArquivoBancarioComponent.IteRegLeiauteArquivoBancario)
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.ItemRegLeiauteArquivoBancarioForm);

        });
    }

    preencherForm(itemregistroleiautearquivobancario: IteRegLeiauteArquivoBancario): void {
        this.ItemRegLeiauteArquivoBancario = itemregistroleiautearquivobancario;

        this.ItemRegLeiauteArquivoBancarioForm.patchValue({
            campo: this.ItemRegLeiauteArquivoBancario.campo,
            tipo: this.ItemRegLeiauteArquivoBancario.tipo,
            valor: this.ItemRegLeiauteArquivoBancario.valor,
            posicaoInicial: this.ItemRegLeiauteArquivoBancario.posicaoInicial,
            posicaoFinal: this.ItemRegLeiauteArquivoBancario.posicaoFinal,
            origemValor: this.ItemRegLeiauteArquivoBancario.origemValor,
            flagCampoRetorno: this.ItemRegLeiauteArquivoBancario.flagCampoRetorno
        })

        this.habilitaDesabilita(this.ItemRegLeiauteArquivoBancario.origemValor)

        // this.ItemRegLeiauteArquivoBancarioForm.controls['valor'].patchValue(this.ItemRegLeiauteArquivoBancario.valor);
        // this.agenciaForm.controls['localidadeEnderecoId'].patchValue(result[0].id);
    }


    editarItemRegistroLeiauteArquivoBancario() {
        if (this.ItemRegLeiauteArquivoBancarioForm.dirty && this.ItemRegLeiauteArquivoBancarioForm.valid) {
            let p = Object.assign({}, this.ItemRegLeiauteArquivoBancario, this.ItemRegLeiauteArquivoBancarioForm.getRawValue());
            //  p.regLeiauteArquivoBancario = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind];

            if (this.leiauteArquivoBancarioId > 0) {
                this.leiauteArquivoBancarioService.atualizarItemRegistroLeiauteArquivoBancario(p)
                    .subscribe(
                        result => {
                            for (let i = 0; this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario.length > i; i++) {
                                if (result.id == this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario[i].id) {
                                    this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario[i] = result;
                                }
                            }

                            this.listaItemRegistroLeiaute.itemGravado('Item atualizado com sucesso');
                            this.close();
                        },
                        error => {
                            this.onError(error)
                        }
                    )

            }
            else {

                for (let i = 0; this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario.length > i; i++) {
                    if (p.id == this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario[i].id) {
                        this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario[i] = p;
                    }
                }
                // this.leiauteArquivoBancarioComponent.regLeiauteArquivoBancario[this.ind].itemregistroleiautearquivobancario.push(p);
                this.listaItemRegistroLeiaute.itemGravado('Item atualizado com sucesso');
                this.close();

            }
        }
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }


    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    habilitaDesabilita(valor: string) {
        this.ItemRegLeiauteArquivoBancario.origemValor = valor;
        if (valor == 'Tag') {
            this.ItemRegLeiauteArquivoBancarioForm.controls['valor'].disable();
        }
        else {
            this.ItemRegLeiauteArquivoBancarioForm.controls['valor'].enable();
           // this.ItemRegLeiauteArquivoBancarioForm.controls['valor'].setValue('');

        }
    }

    onCamposDrop(e: any) {
        this.droppedCampos.push(e.dragData);
       // let instrucaoValue = this.contaCorrenteCobrancaForm.controls["instrucao"].value;
       // let textoInicio: string = instrucaoValue.substr(0, this.cursor);
       // let textoFim: string = instrucaoValue.substr(textoInicio.length, instrucaoValue.length);
        this.ItemRegLeiauteArquivoBancarioForm.patchValue({
          valor: this.droppedCampos[this.droppedCampos.length - 1].name
        });
    }
}
import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { FormControlName, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IteRegLeiauteArquivoBancario, Campos } from "../models/leiautearquivobancario";
import { GenericValidator } from "../../../validation/generic-form-validator";
import { LeiauteArquivoBancarioService } from "../leiautearquivobancario.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LeiauteArquivoBancarioComponent } from "../leiautearquivobancario.component";
import { zipProto } from "rxjs/operator/zip";
import { ListaItemRegistroLeiauteArquivoBancario } from "../lista-itemregistroleiautearquivobancario/lista-itemregistroleiautearquivobancario.component";

@Component({
    selector: 'app-adicionar-itemregistroleiautearquivobancario',
    templateUrl: './adicionar-itemregistroleiautearquivobancario.component.html',
    styleUrls: ['./adicionar-itemregistroleiautearquivobancario.component.css']
})
export class AdicionarItemRegistroLeiauteArquivoBancarioComponent implements OnInit {
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

   // public campos: { name : string , type: string};
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
        private listItemRegistroLeiauteArquivoBancario: ListaItemRegistroLeiauteArquivoBancario) {

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
            tipo: ['', [Validators.required]],
            valor: ['', [Validators.required]],
            posicaoInicial: ['', [Validators.required]],
            posicaoFinal: ['', [Validators.required]],
            origemValor: ['', [Validators.required]],
            flagCampoRetorno : 'N'
        })

        this.campos = [];

        this.leiauteArquivoBancarioService.obterCamposLeiauteArquivoBancario()
            .subscribe(
                result => {
                    for(var i=0; i <result.length; i++) {  
                  
                        this.campos[i] = {name : '{{'+result[i]+'}}', type : 'campo'}
                    }

                }
            )
    }

    adicionarItemRegistroLeiauteArquivoBancario() {
        if (this.ItemRegLeiauteArquivoBancarioForm.dirty && this.ItemRegLeiauteArquivoBancarioForm.valid) {
            let p = Object.assign({}, this.ItemRegLeiauteArquivoBancario, this.ItemRegLeiauteArquivoBancarioForm.getRawValue());
            
            if (this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario == undefined)
                this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario = [];

            let num = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario.length;

            

            p.id = num + 1;
            // p.regLeiauteArquivoBancarioId = 0;

            p.regLeiauteArquivoBancarioId = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].id;

            if (this.leiauteArquivoBancarioId > 0) {
                this.leiauteArquivoBancarioService.adicionarItemRegistroLeiauteArquivoBancario(p)
                    .subscribe(
                        result => {
                            this.ItemRegLeiauteArquivoBancario = result;
                            this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario.push(this.ItemRegLeiauteArquivoBancario);
                            this.listItemRegistroLeiauteArquivoBancario.itemGravado('Item adicionado com sucesso');
                            this.close();

                        }
                    )

            }
            else {
                this.ItemRegLeiauteArquivoBancario = p;
    
                this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario[this.ind].iteRegLeiauteArquivoBancario.push(this.ItemRegLeiauteArquivoBancario);

                this.listItemRegistroLeiauteArquivoBancario.itemGravado('Item adicionado com sucesso');
                this.close();
            }
        }
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
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
    
      getPosition(oField) {
       // if (oField.selectionStart || oField.selectionStart == '0') {
      //    this.caretPos = oField.selectionStart;
      //    this.cursor = this.caretPos;
     //   }
      }


}
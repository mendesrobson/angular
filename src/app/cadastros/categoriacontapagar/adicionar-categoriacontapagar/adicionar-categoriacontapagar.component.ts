import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaContaPagar, TipoCategoria } from '../models/categoriacontapagar';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { CategoriaContaPagarService } from '../categoriacontapagar.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';
import { MaskService } from '../../../services/mask.service';

@Component({
    selector: 'app-adicionar-categoriacontapagar',
    templateUrl: './adicionar-categoriacontapagar.component.html',
    providers: []
})
export class AdicionarCategoriaContaPagarComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @ViewChild('focusCodigo') focusCodigo: ElementRef;

    public maskValid: boolean;
    public mascSequencial: Mascara;

    public grupoEmpresaId: number;

    public categoriaContaPagar: CategoriaContaPagar;
    public categoriaContaPagarForm: FormGroup;

    swal: SweetAlertAdviceService;

    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public categoriaContaPagarPai: CategoriaContaPagar[];
    public tiposCategoria: TipoCategoria[];
    
    selectUnidade = [{ id: '', value: '' }, { id: 'V', value: 'Valor' }, { id: 'Q', value: 'Quantidade' }, { id: 'P', value: 'Percentual sobre Contrato' }];
    selectVencimento = [{ id: '', value: '' }, { id: 'F', value: 'Fixo ' }, { id: 'C', value: 'Conforme Contrato' }];

    public errors: any[] = [];
    public codMask = [];

    constructor(
        private categoriaContaPagarService: CategoriaContaPagarService,
        private fb: FormBuilder,
        private router: Router,
        private _maskService: MaskService,
        private renderer: Renderer) {

        this.validationMessages = {
            grupoEmpresaId:
            {
                required: 'Grupo requerido.'
            },
            empresaId: {
                required: 'Empresa requerida.'
            },
            codigo: {
                required: 'Codigo requerido.'
            },
            descricao: {
                required: 'Descrição requerido.'
            },
            tipo: {
                required: 'Tipo requerido.'
            }
        };

        this.maskValid = true;
        this.mascSequencial = new Mascara();
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.categoriaContaPagar = new CategoriaContaPagar();
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit() {

        this.categoriaContaPagarForm = this.fb.group({
            guid: 0,
            id: 0,
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            excluido: 'N',
            codigo: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            categoriaContaPagarPaiId: null,
            dataAlteracao: null,
            dataCadastro: null,
            dataInativacao: null
        });


        this.categoriaContaPagarService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
           () => this.errors);

           this.tiposCategoria = [
            {
              "sigla": "TOT",
              "descricao": "Totalizadora"
            },
            {
              "sigla": "NTOT",
              "descricao": "Não Totalizadora"
            }
          ];   

        this.categoriaContaPagarService.obterTodosCategoriaContaPagarPai()
            .subscribe(categoriaContaPagarPai => {
                this.categoriaContaPagarPai = categoriaContaPagarPai
            },
           () => this.errors);
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.categoriaContaPagarForm);
        });
    }

    async adicionarCategoriaContaPagar(): Promise<void> {
        if (this.categoriaContaPagarForm.dirty && this.categoriaContaPagarForm.valid) {
            let p = Object.assign({}, this.categoriaContaPagar, this.categoriaContaPagarForm.value);

            if(this.mascSequencial == null){
                this.mascSequencial = new Mascara();
                this.mascSequencial.sequencial = 'N';
            }

            if(this.mascSequencial.sequencial === 'S')
            {
                this.categoriaContaPagarService.adicionarCategoriaContaPagar(p)
                .subscribe(
                result => {
                    this.swal.showSwalSuccess('Categoria adicionada com Sucesso!');
                    this.router.navigate(['categoriacontapagar/lista']);
                },
               (error) => {
                    this.onError(error)
                });
            }
            else
            {
                let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
                let categoriaContaPagar = await this.categoriaContaPagarService.ObterCategoriaContaPagarPorCodigo(codigo).toPromise();

                if(categoriaContaPagar != null)
                {
                    var self = this;
                    this.swal.showSwalErrorCodigo('Informe um código que não esteja cadastrado!', function (isConfirmed) {
                        if (isConfirmed) {
                          self.limparCampoCodigo();
                        }
                        else {
                          
                        }
                    });
                }
                else
                {
                    this.categoriaContaPagarService.adicionarCategoriaContaPagar(p)
                    .subscribe(
                    result => {
                        this.swal.showSwalSuccess('Categoria adicionada com Sucesso!');
                        this.router.navigate(['categoriacontapagar/lista']);
                    },
                    (error) => {
                        this.onError(error)
                    });
                }
            }

            
        }
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }


    cancelar() {
        this.router.navigate(['categoriacontapagar/lista']);
    }

    limparCampoCodigo(){
        this.categoriaContaPagarForm.controls['codigo'].setValue('');
        this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
      }

    async ConsultaEmpresa(idGrupo): Promise<void> {

        this.grupoEmpresaId = idGrupo;
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'CategoriaContaPagar', this.grupoEmpresaId);

        if(this.mascSequencial != null)
        {   
            if(this.mascSequencial.sequencial === "S")
            {
                this.categoriaContaPagarForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {
                this.categoriaContaPagarForm.controls['codigo'].setValue('');
                this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
                this.maskValid = true;
            }

        }
        else
        {
            this.categoriaContaPagarForm.controls['codigo'].setValue('');
            this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
            this.maskValid = true;
        }

        this.empresas = [];
        this.categoriaContaPagarService.obterTodosEmpresaPorGrupo(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => this.errors);
    }

    async OnChangeEmpresa(empresaId) : Promise<void> {
        
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'CategoriaContaPagar', this.grupoEmpresaId, empresaId);
        
        if(this.mascSequencial != null)
        {
            if(this.mascSequencial.sequencial === 'S')
            {
                this.categoriaContaPagarForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {   
                this.categoriaContaPagarForm.controls['codigo'].setValue('');
                this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
                this.maskValid = true;
            }
        }
        else
        {
          this.categoriaContaPagarForm.controls['codigo'].setValue('');
          this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
          this.maskValid = true;
          
        }
      
      }



}

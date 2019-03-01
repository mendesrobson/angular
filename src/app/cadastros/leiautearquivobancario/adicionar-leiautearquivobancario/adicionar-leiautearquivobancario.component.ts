import { Component, OnInit, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { MaskService } from '../../../services/mask.service';
import { LeiauteArquivoBancario, Banco } from '../models/leiautearquivobancario';
import { LeiauteArquivoBancarioService } from '../leiautearquivobancario.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { LeiauteArquivoBancarioComponent } from '../leiautearquivobancario.component';
import { Mascara } from '../../mascara/models/mascara';

@Component({
    selector: 'app-adicionar-leiautearquivobancario',
    templateUrl: './adicionar-leiautearquivobancario.component.html',
    styleUrls: []
})
export class AdicionarLeiauteArquivoBancarioComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @ViewChild('focusCodigo') focusCodigo: ElementRef;

    public maskValid: boolean;
    public mascSequencial: Mascara;

    public grupoEmpresaId: number;

    leiauteArquivoBancarioForm: FormGroup;
    leiauteArquivoBancario: LeiauteArquivoBancario;

    swal: SweetAlertAdviceService;
    displayMessage: { [key: string]: string } = {};

    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public bancos: Banco[];
    public tipoArquivos = [{id: 'txt', descricao: "txt"}];

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];
    public codMask = [];

    constructor(
        private leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private fb: FormBuilder,
        private router: Router,
        private _maskService: MaskService,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent,
        private renderer: Renderer) {

        this.validationMessages = {
            grupoEmpresaId: {
                required: 'Grupo requirido'
            },
            empresaId: {
                required: 'Empresa requirido'
            },
            bancoId: {
                required: 'Banco requirido'
            },
            codigo: {
                required: 'Código requirido',
                minlength: 'O Código precisa ter no mínimo 3 caracteres',
                maxlength: 'O Código precisa ter no máximo 20 caracteres'
            },
            descricao: {
                //  required : 'Código requirido',
                //  minlength: 'O Código precisa ter no mínimo 3 caracteres',
                maxlength: 'A descrição precisa ter no máximo 100 caracteres'
            },
            nomeArquivo: {
                required: 'Nome do Arquivo requirido',
                minlength: 'O Nome do Arquivo precisa ter no mínimo 3 caracteres',
                maxlength: 'A Nome do Arquivo precisa ter no máximo 100 caracteres'
            },
            tipoArquivo: {
                maxlength: 'O Tipo de Arquivo precisa ter no máximo 100 caracteres'
            }


        }

        this.maskValid = true;
        this.mascSequencial = new Mascara();
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.leiauteArquivoBancario = new LeiauteArquivoBancario();
        this.swal = new SweetAlertAdviceService();


    }


    ngOnInit(): void {
        this.leiauteArquivoBancarioForm = this.fb.group({
            id: 0,
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            descricao: ['', [Validators.maxLength(100)]],
            nomeArquivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            tipoArquivo: ['', [Validators.maxLength(3)]],
            bancoId: ['', [Validators.required]],
            excluido: 'N'


        });

        this.leiauteArquivoBancarioService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                () => { });

        this.leiauteArquivoBancarioService.obterTodosBanco()
            .subscribe(bancos => {
                this.bancos = bancos
            },
                error => this.errors);


    }
    async ConsultaEmpresa(idGrupo): Promise<void> {

        this.grupoEmpresaId = idGrupo;
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'LeiauteArquivoBancario', this.grupoEmpresaId);

        if(this.mascSequencial != null)
        {   
            if(this.mascSequencial.sequencial === "S")
            {
                this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {
                this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
                this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
                this.maskValid = true;
            }

        }
        else
        {
            this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
            this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
            this.maskValid = true;
        }

        this.empresas = [];
        this.leiauteArquivoBancarioService.obterTodosEmpresaPorGrupo(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => this.errors);
    }

    async OnChangeEmpresa(empresaId) : Promise<void> {
        
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'LeiauteArquivoBancario', this.grupoEmpresaId, empresaId);
        
        if(this.mascSequencial != null)
        {
            if(this.mascSequencial.sequencial === 'S')
            {
                this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {   
                this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
                this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
                this.maskValid = true;
            }
        }
        else
        {
          this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
          this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
          this.maskValid = true;
          
        }
      
      }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.leiauteArquivoBancarioForm);
        });
    }


    async adicionarLeiauteArquivoBancario(): Promise<void> {
        if (this.leiauteArquivoBancarioForm.dirty && this.leiauteArquivoBancarioForm.valid) {

            let p = Object.assign({}, this.leiauteArquivoBancario, this.leiauteArquivoBancarioForm.value);
            p.regLeiauteArquivoBancario = this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario;

            if(this.mascSequencial == null){
                this.mascSequencial = new Mascara();
                this.mascSequencial.sequencial = 'N';
            }

            if(this.mascSequencial.sequencial === "S")
            {
                this.leiauteArquivoBancarioService.adicionarLeiauteArquivoBancario(p)
                    .subscribe(
                        result => {
                            this.swal.showSwalSuccess('Leiaute Bancário Adicionado com sucesso');
                            this.router.navigate(['leiautearquivobancario/lista']);
                        },
                        error => {
                            this.onError(error)
                        });
            }
            else
            {   
                let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
                let leiauteArquivoBancario = await this.leiauteArquivoBancarioService.ObterLeiauteArquivoBancarioPorCodigo(codigo).toPromise();

                if(leiauteArquivoBancario != null)
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
                    this.leiauteArquivoBancarioService.adicionarLeiauteArquivoBancario(p)
                    .subscribe(
                        result => {
                            this.swal.showSwalSuccess('Leiaute Bancário Adicionado com sucesso');
                            this.router.navigate(['leiautearquivobancario/lista']);
                        },
                        error => {
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
        this.router.navigate(['leiautearquivobancario/lista']);
    }

    limparCampoCodigo(){
        this.leiauteArquivoBancarioForm.controls['codigo'].setValue('');
        this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
      }

}

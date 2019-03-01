import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnDestroy, Renderer, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ContaCorrente, Banco, Agencia, ContaCorrenteCobranca, TipoConta } from '../models/contacorrente';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { ContaCorrenteComponent } from '../contacorrente.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Subscription } from 'rxjs';
import { Mascara } from '../../mascara/models/mascara';

@Component({
  selector: 'app-adicionar-contacorrente',
  templateUrl: './adicionar-contacorrente.component.html',
  providers: [MaskService],
  styleUrls: []
})
export class AdicionarContaCorrenteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public contaCorrente: ContaCorrente;
  public contaCorrenteForm: FormGroup;

  swal: SweetAlertAdviceService;
  cnpjMask = this._maskService.Cnpj();
  cnpjPattern = this._maskService.cnpjPattern;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public bancos: Banco[];
  public agencias: Agencia[];
  public tipoContas: TipoConta[];
  public contaCorrenteCobranca: ContaCorrenteCobranca;

  public sub: Subscription;
  public errors: any[] = [];
  public codMask = [];
  public tipo: String;

  constructor(private contaCorrenteService: ContaCorrenteService,
    private _maskService: MaskService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contaCorrenteComponent: ContaCorrenteComponent,
    private renderer: Renderer) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      bancoId: {
        required: 'Banco requerido.'
      },
      tipoContaId: {
        required: 'Tipo da Conta requerido.'
      },
      agenciaId: {
        required: 'Agência requerida.'
      },
      codigo: {
        required: 'Código requerido.',
        maxLength: 'O Código precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'Descricao requerida.',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      nomeEmpresa: {
        required: 'Nome Empresa requerida.',
        maxlength: 'O Nome Empresa precisa ter no máximo 20 caracteres'
      },
      cnpj: {
        required: 'CNPJ requerido.',
        pattern: 'Formato de CNPJ inválido'
      },
      conta: {
        required: 'Conta requerida.',
        maxlength: 'A Conta precisa ter no máximo 20 caracteres'
      },
      digito: {
        required: 'Dígito requerida.',
        maxlength: 'O Dígito precisa ter no máximo 20 caracteres'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contaCorrente = new ContaCorrente();
    this.swal = new SweetAlertAdviceService();

    this.contaCorrenteComponent.ContaCorrente = new ContaCorrente();
    this.contaCorrenteComponent.contaCorrente.contaCorrenteCobranca = [];
    this.contaCorrenteComponent.contaCorrenteCobranca = new ContaCorrenteCobranca();

  }

  ngOnInit() {

    this.contaCorrenteForm = this._fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      // bancoId: ['', [Validators.required]],
      bancoId: null,
      tipoContaId: ['', [Validators.required]],
      // agenciaId: ['', [Validators.required]],
      agenciaId: null,
      codigo: ['', [Validators.required,
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.maxLength(100)]],
      // nomeEmpresa: ['', [Validators.required,
      // Validators.maxLength(20)]],
      nomeEmpresa: [''],
      // cnpj: ['', [Validators.required, Validators.pattern(this.cnpjPattern)]],
      cnpj: [''],
      // conta: ['', [Validators.required,
      // Validators.maxLength(20)]],
      conta: [''],
      // digito: ['', [Validators.required,
      // Validators.maxLength(20)]],
      digito: [''],
      dataInicial: null,
      saldoInicial: '',
      saldoReal: '',
      saldoConciliado: '',
      saldoConciliadoEmissao: '',
      dataUltimaConciliacao: null,
      sangria: 'N',
      caixaPrincipal: 'N',
      visualizaFluxoCaixa: 'N',
      codigoConvenioBanco: null,
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        console.log('Tipo Conta');
        this.tipo = params['tipoConta'];
        if (this.tipo === 'caixa') {
          console.log('Tipo Conta Combo');
          this.contaCorrenteService.obterTodosTipoContaCaixa()
            .subscribe(tipoContas => {
              this.tipoContas = tipoContas;
            },
              () => this.errors);
        } else {
          this.contaCorrenteService.obterTodosTipoContaBancaria()
            .subscribe(tipoContas => {
              this.tipoContas = tipoContas;
            },
              () => this.errors);
        }
      });

    this.contaCorrenteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);

    this.contaCorrenteService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos;
      },
        () => this.errors);

    this.contaCorrenteService.obterTodosAgencia()
      .subscribe(agencias => {
        this.agencias = agencias;
      },
        () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contaCorrenteForm);
    });
  }

  formCaixaBanco(event) {
    this.contaCorrente.tipoContaId = event;
  }

  async ObterCNPJAutomatico(event): Promise<void> {

    if(this.tipo === 'caixa')
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'ContaCaixa', this.grupoEmpresaId, event);
    else
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'ContaCorrente', this.grupoEmpresaId, event);

    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === 'S')
        {
            this.contaCorrenteForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {   
            this.contaCorrenteForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
      this.contaCorrenteForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }

    if(this.empresas != null){
      this.empresas.forEach(result => {
        if (result.id == event) {
          this.contaCorrenteForm.get('cnpj').setValue(result.pessoa.cnpj);
        }
      });
    }
    
  }


  async adicionarContaCorrente(): Promise<void> {
    if (this.contaCorrenteForm.dirty && this.contaCorrenteForm.valid) { 

      const p = Object.assign({}, this.contaCorrente, this.contaCorrenteForm.getRawValue());
      p.contaCorrenteCobranca = this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca;

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      } 

      if(this.mascSequencial.sequencial === 'S')
      {
            this.contaCorrenteService.adicionarContaCorrente(p)
            .subscribe(
              result => {
                this.swal.showSwalSuccess('Conta Corrente Adicionada com Sucesso!');
                if (p.tipoContaId === 25) {
                  this.router.navigate(['conta/listacontacaixa']);
                } else {
                  this.router.navigate(['conta/lista']);
                }
              },
              error => {
                this.onError(error);
              });
      }
      else
      {   
            let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');

            let conta = null;
            if(this.tipo === 'caixa')
              conta = await this.contaCorrenteService.ObterContaPorTipoContaeCodigo(25, codigo).toPromise();
            else
              conta = await this.contaCorrenteService.ObterContaPorTipoContaeCodigo(21, codigo).toPromise();

            if(conta != null)
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
                this.contaCorrenteService.adicionarContaCorrente(p)
                .subscribe(
                  result => {
                    this.swal.showSwalSuccess('Conta Corrente Adicionada com Sucesso!');
                    if (p.tipoContaId === 25) {
                      this.router.navigate(['conta/listacontacaixa']);
                    } else {
                      this.router.navigate(['conta/lista']);
                    }
                  },
                  error => {
                    this.onError(error);
                  });
            }
      }
      
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }
  cancelar() {
    if (this.contaCorrenteForm.controls['tipoContaId'].value == 25) {
      this.router.navigate(['conta/listacontacaixa']);
    } else {
      this.router.navigate(['conta']);
    }
  }

  limparCampoCodigo(){
    this.contaCorrenteForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  ngOnDestroy() {
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    
    if(this.tipo === 'caixa')
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'ContaCaixa', this.grupoEmpresaId);
    else
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'ContaCorrente', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === "S")
        {
            this.contaCorrenteForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.contaCorrenteForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
        this.contaCorrenteForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.contaCorrenteForm.get('cnpj').reset();
    this.contaCorrenteService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }
}

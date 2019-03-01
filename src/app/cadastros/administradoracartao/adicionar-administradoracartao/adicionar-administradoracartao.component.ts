import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { MaskService } from '../../../services/mask.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from '../models/administradoracartao';
import { Banco } from '../../banco/models/banco';
import { Agencia } from '../../agencia/models/agencia';
import { TipoConta, ContaCorrente } from '../../contacorrente/models/contacorrente';
import { AdministradoracartaoComponent } from '../administradoracartao.component';
import { UtilService } from '../../../services/util.service';
import { Mascara } from '../../mascara/models/mascara';

@Component({
  selector: 'app-adicionar-administradoracartao',
  templateUrl: './adicionar-administradoracartao.component.html',
  styleUrls: []
})
export class AdicionarAdministradoracartaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public administradoraCartao: Administradoracartao;
  public administradoraCartaoEndereco: AdministradoraCartaoEndereco;
  public administradoraCartaoContato: AdministradoraCartaoContato;
  public administradoraCartaoForm: FormGroup;

  public bancos: Banco[];
  public agencias: Agencia[];
  public tipoContas: TipoConta[];   
  public contaCorrentes: ContaCorrente[]; 


  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public errors: any[] = [];
  public codMask = [];

  constructor(private administradoraCartaoService: AdministradoracartaoService,
    private fb: FormBuilder,
    private utilService: UtilService,
    private _maskService: MaskService,
    private router: Router,
    private administradoraCartaoComponent: AdministradoracartaoComponent,
    private renderer: Renderer) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      codigo: {
        required: 'Informe o código',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.administradoraCartao = new Administradoracartao();
    this.administradoraCartaoEndereco = new AdministradoraCartaoEndereco();
    this.administradoraCartaoContato = new AdministradoraCartaoContato();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.administradoraCartaoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required]],
      nomeFantasia: '',
      bancoId: '',
      agenciaId: '',
      contaCorrenteId: '',
      pagarReceber: '',
      diaLimite: 0,
      diaVencimento: 0,
      cartaoCredito: 'N',
      cartaoDebito: 'N',
      quantidadeDiasCredito: 0,
      quantidadeDiasDebito: 1,
      percTaxaCredito: 0,
      percTaxaDebito: 0,

    });

    this.administradoraCartaoForm.controls['bancoId'].disable();
    this.administradoraCartaoForm.controls['agenciaId'].disable();
    this.administradoraCartaoForm.controls['quantidadeDiasDebito'].disable();

    this.administradoraCartaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.administradoraCartaoService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos
      },
      error => this.errors);

    this.administradoraCartaoService.obterTodosAgencia()
      .subscribe(agencias => {
        this.agencias = agencias
      },
      error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.administradoraCartaoForm);
    });

  }


  //   Adm Cartao
  // -> Preencher o banco e agencia a partir da Conta Corrente
  // -> Desabilitar a quantidade de Parcelas (padrão = 1)

  async adicionarAdministradoraCartao(): Promise<void> {

    if (this.administradoraCartaoForm.dirty && this.administradoraCartaoForm.valid) {
      let p = Object.assign({}, this.administradoraCartao, this.administradoraCartaoForm.getRawValue());

      p.administradoraCartaoEndereco = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco;
      p.administradoraCartaoContato = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato;

      //this.administradoraCartaoComponent.Administradoracartao = p;

      if(this.mascSequencial.sequencial === 'S')
      {
          this.administradoraCartaoService.AdicionarAdministradoraCartao(p)
          .subscribe(
          result => {

            this.administradoraCartao = result;

            // this.administradoraCartaoComponent.Titulo = this.titulo;

            //this.tituloComponent = null;
            this.swal.showSwalSuccess('Administradora de Cartão adicionado com Sucesso!');

            this.router.navigate(['administradoracartao/lista']);


          },
          () => {  });
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let administradorCartao = await this.administradoraCartaoService.ObterAdministradorCartaoPorCodigo(codigo).toPromise();

          if(administradorCartao != null)
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
              this.administradoraCartaoService.AdicionarAdministradoraCartao(p)
              .subscribe(
              result => {
    
                this.administradoraCartao = result;
    
                // this.administradoraCartaoComponent.Titulo = this.titulo;
    
                //this.tituloComponent = null;
                this.swal.showSwalSuccess('Administradora de Cartão adicionado com Sucesso!');
    
                this.router.navigate(['administradoracartao/lista']);
    
    
              },
              () => {  });
          }
      }
      
    }
  }

  popularDadosBancarios(id) {
    this.administradoraCartaoService.obterContaCorrentePorId(id)
      .subscribe(
      result => {
        
        this.administradoraCartaoForm.controls['agenciaId'].setValue(result.agenciaId); 
        this.administradoraCartaoForm.controls['bancoId'].setValue(result.bancoId); 

      });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['administradoracartao/lista']);
  }

  limparCampoCodigo(){
    this.administradoraCartaoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'AdministradoraCartao', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.administradoraCartaoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.administradoraCartaoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.administradoraCartaoForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.administradoraCartaoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  async ConsultaSelectEmpresa(idEmpresa): Promise<void> {

    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'AdministradoraCartao', this.grupoEmpresaId, idEmpresa);

    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === 'S')
        {
            this.administradoraCartaoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {   
            this.administradoraCartaoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
      this.administradoraCartaoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }
  
    this.contaCorrentes = [];
    this.administradoraCartaoService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
      () => { });

  }
}

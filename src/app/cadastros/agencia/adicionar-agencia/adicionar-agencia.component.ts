import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Agencia, Banco, TipoLogradouro, Uf, Pais, Localidade } from '../models/agencia';
import { AgenciaService } from '../agencia.service';
import { MaskService } from '../../../services/mask.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { Mascara } from '../../mascara/models/mascara';

@Component({
  selector: 'app-adicionar-agencia',
  templateUrl: './adicionar-agencia.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class AdicionarAgenciaComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public agencia: Agencia;
  public agenciaForm: FormGroup;

  swal: SweetAlertAdviceService;
  cepMask = this._maskService.Cep();
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public bancos: Banco[];
  public tipoLogradouros: TipoLogradouro[];
  public ufs: Uf[];
  public paises: Pais[];
  public localidades: Localidade[];

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private agenciaService: AgenciaService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router,
    private renderer: Renderer) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      digito: {
        required: 'Informe o Dígito da Agência'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      bancoId: {
        required: 'Informe o Banco'
      },
      gerente: {
        required: 'O Gerente é requerido',
        minlength: 'O Gerente precisa ter no mínimo 3 caracteres',
        maxlength: 'O Gerente precisa ter no máximo 60 caracteres'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.agencia = new Agencia();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {


    this.agenciaForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', Validators.maxLength(10)],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      empresaId: '',// ['', [Validators.required]],
      grupoEmpresaId: '',// ['', [Validators.required]],
      bancoId: ['', [Validators.required]],
      digito: ['', [Validators.required]],
      cep: [],
      tipoLogradouroId: [],
      logradouro: [],
      numero: [],
      complemento: [],
      bairro: [],
      localidadeId: [],
      ufId: [],
      paisId: [],
      gerente: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(60)]],
    });

    this.agenciaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.agenciaService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos
      },
        error => this.errors);

    this.agenciaService.obterTodosLocalidade()
      .subscribe(localidades => {
        this.localidades = localidades
      },
        error => this.errors);

    this.agenciaService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs
      },
        error => this.errors);

    this.agenciaService.obterTodosPais()
      .subscribe(paises => {
        this.paises = paises
      },
        error => this.errors);


        this.agenciaService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        error => this.errors);

      this.agenciaService.obterTodosLocalidadeEndereco()
      .subscribe(localidadeEnderecos => {
        this.localidadeEnderecos = localidadeEnderecos
      },
        error => this.errors);

    this.agenciaService.obterTodosUfEndereco()
      .subscribe(ufEnderecos => {
        this.ufEnderecos = ufEnderecos
      },
        error => this.errors);

    this.agenciaService.obterTodosPaisEndereco()
      .subscribe(paisEnderecos => {
        this.paisEnderecos = paisEnderecos
      },
        error => this.errors);


  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.agenciaForm);
    });

  }

  async adicionarAgencia(): Promise<void> {
    if (this.agenciaForm.dirty && this.agenciaForm.valid) {

      let p = Object.assign({}, this.agencia, this.agenciaForm.getRawValue());

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
          this.agenciaService.AdicionarAgencia(p)
          .subscribe(
            result => {
              this.swal.showSwalSuccess('Agência Adicionada com Sucesso!');
              this.router.navigate(['agencia/lista']);
            },
            error => { console.log(error);});
      }
      else
      {   
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let agencia = await this.agenciaService.ObterAgenciaPorCodigo(codigo).toPromise();

          if(agencia != null)
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
                this.agenciaService.AdicionarAgencia(p)
                .subscribe(
                  result => {
                    this.swal.showSwalSuccess('Agência Adicionada com Sucesso!');
                    this.router.navigate(['agencia/lista']);
                  },
                  error => { console.log(error);});
          }
      }
      
      
    }
  }

  ConsultaCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get("//cepapi.delivoro.com.br/" + cep)
          .map(dados => dados)
          .subscribe(dados => this.popularForm(dados));
      }
    }
  }

  limparCampoCodigo(){
    this.agenciaForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  popularForm(dados) {
    this.obterLocalidadeId(dados.cidade);
    this.obterUfId(dados.cidade);
    this.obterTipoLogradouroId(dados.tipoLogradouro);
    this.obterPaisId('Brasil');
    this.consultaCepCodMunicipio(dados.cep);

    this.agenciaForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadeId(desc: string) {
    this.agenciaService.obterLocalidadeId(desc)
      .subscribe(
        result => {
          this.agenciaForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterUfId(desc: string) {
    this.agenciaService.obterUfId(desc)
      .subscribe(
        result => {
          this.agenciaForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterTipoLogradouroId(desc: string) {
    this.agenciaService.obterTipoLogradouroId(desc)
      .subscribe(
        result => {
          this.agenciaForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterPaisId(desc: string) {
    this.agenciaService.obterPaisId(desc)
      .subscribe(
        result => {
          this.agenciaForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  consultaCepCodMunicipio(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
          .map(result => result)
          .subscribe(result => this.agenciaForm.controls['codigoMunicipio'].patchValue(result.ibge));
      }
    }
  }

  cancelar() {
    this.router.navigate(['agencia/lista']);
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'Agencia', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.agenciaForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.agenciaForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.agenciaForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }


    this.empresas = [];
    this.agenciaService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  async OnChangeEmpresa(empresaId) : Promise<void> {
        
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Agencia', this.grupoEmpresaId, empresaId);
    
    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === 'S')
        {
            this.agenciaForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {   
            this.agenciaForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
      this.agenciaForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }
  
  }

}

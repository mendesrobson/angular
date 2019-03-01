import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AgenteIntegrador, TipoLogradouro, Uf, Pais, Localidade } from '../models/agenteintegrador';
import { AgenteintegradorService } from '../agenteintegrador.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-agenteintegrador',
  templateUrl: './adicionar-agenteintegrador.component.html',
  styleUrls: []
})
export class AdicionarAgenteintegradorComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public agenteIntegrador: AgenteIntegrador;
  public agenteIntegradorForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  cepMask = this._maskService.Cep();
  cnpjMask = this._maskService.Cnpj();
  telMask = this._maskService.Telefone();

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipoLogradouros: TipoLogradouro[];
  public ufs: Uf[];
  public paises: Pais[];
  public localidades: Localidade[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private agenteIntegradorService: AgenteintegradorService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      tipoLogradouroId: {
        required: 'Tipo Logradouro requerido.'
      },
      ufId: {
        required: 'Uf Endereço requerido.'
      },
      paisId: {
        required: 'Pais Endereço requerido.'
      },
      localidadeId: {
        required: 'Localidade Endereço requerida.'
      },
      codigo: {
        required: 'Código requerido.'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.agenteIntegrador = new AgenteIntegrador();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.agenteIntegradorForm = this.fb.group({
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      tipoLogradouroId: ['', [Validators.required]],
      ufId: ['', [Validators.required]],
      paisId: ['', [Validators.required]],
      localidadeId: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
      nome: [''],
      cnpj: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      cep: [''],
      bairro: [''],
      codigoMunicipioIbge: [''],
      telefone: [''],
      excluido: 'N'
    });

    this.agenteIntegradorService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.agenteIntegradorService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        error => this.errors);

    this.agenteIntegradorService.obterTodosLocalidade()
      .subscribe(localidades => {
        this.localidades = localidades
      },
        error => this.errors);

    this.agenteIntegradorService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs
      },
        error => this.errors);

    this.agenteIntegradorService.obterTodosPais()
      .subscribe(paises => {
        this.paises = paises
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.agenteIntegradorForm);
    });
  }

  adicionarAgenteIntegrador() {
    if (this.agenteIntegradorForm.dirty && this.agenteIntegradorForm.valid) {
      const p = Object.assign({}, this.agenteIntegrador, this.agenteIntegradorForm.getRawValue());
      console.log(p);
      this.agenteIntegradorService.adicionarAgenteIntegrador(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Agente Integrador, Adicionado com Sucesso!');
              this.router.navigate(['agenteintegrador/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          error => {
            console.error(error)
          })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['agenteintegrador/lista']);
  }

  ConsultaCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//cepapi.delivoro.com.br/" + cep)
          .map(dados => dados)
          .subscribe(dados => this.popularForm(dados));
      }
    }
  }

  popularForm(dados) {
    this.obterLocalidadePorDesc(dados.cidade);
    this.obterUfPorDesc(dados.cidade);
    this.obterTipoLogradouroPorDesc(dados.tipoLogradouro);
    this.obterPaisPorDesc('Brasil');
    this.consultaCepCodMunicipio(dados.cep);

    this.agenteIntegradorForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadePorDesc(desc: string) {
    this.agenteIntegradorService.obterLocalidadePorDesc(desc)
      .subscribe(
        result => {
          this.agenteIntegradorForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterUfPorDesc(desc: string) {
    this.agenteIntegradorService.obterUfPorDesc(desc)
      .subscribe(
        result => {
          this.agenteIntegradorForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterTipoLogradouroPorDesc(desc: string) {
    this.agenteIntegradorService.obterTipoLogradouroPorDesc(desc)
      .subscribe(
        result => {
          this.agenteIntegradorForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterPaisPorDesc(desc: string) {
    this.agenteIntegradorService.obterPaisPorDesc(desc)
      .subscribe(
        result => {          
          this.agenteIntegradorForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  consultaCepCodMunicipio(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
          .map(result => result)
          .subscribe(result => this.agenteIntegradorForm.controls['codigoMunicipioIbge'].patchValue(result.ibge));
      }
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.agenteIntegradorService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaCnpj(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj != "") {
      this.agenteIntegradorService.buscarDadosCnpj(cnpj)
        .subscribe(
          result => {
            this.popularFormCnpj(result);
          },
          error => {
            this.onError(error)
          })
    }
  }

  popularFormCnpj(dados) {
    this.ConsultaCEP(dados.cep);

    this.agenteIntegradorForm.patchValue({
      cep: dados.cep.replace(".", ""),      
      nome: dados.nome.substring(0, 100),
      telefone: dados.telefone.substring(0, 20)      
    });
       
  }

}

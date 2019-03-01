import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InstituicaoEnsino, TipoLogradouro, Uf, Pais, Localidade } from '../models/instituicaoensino';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { InstituicaoEnsinoService } from '../instituicaoensino.service';
import { testemunhaRouterConfig } from './../../../cadastros/testemunha/testemunha.routes';

@Component({
  selector: 'app-adicionar-instituicaoensino',
  templateUrl: './adicionar-instituicaoensino.component.html',
  styleUrls: []
})

export class AdicionarInstituicaoensinoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public instituicaoEnsino: InstituicaoEnsino;
  public instituicaoEnsinoForm: FormGroup;
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
    private instituicaoEnsinoService : InstituicaoEnsinoService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router
  ) {
    this.validationMessages = {
      nome: {
        required: 'A Nome é requerida.',
        minlength: 'A Nome precisa ter no mínimo 3 caracteres',
        maxlength: 'A Nome precisa ter no máximo 100 caracteres'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.instituicaoEnsino = new InstituicaoEnsino();
    this.swal = new SweetAlertAdviceService();
   }

  ngOnInit() {
    this.instituicaoEnsinoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      tipoLogradouroId: 0,
      ufId: 0,
      paisId: 0,
      localidadeId: 0,
      codigo: [''],
      sigla: [''],
      nomeReitor: [''],
      nome: ['', [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)]],
      cnpj: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      cep: [''],
      bairro: [''],
      codigoMunicipioIbge: 0,
      telefone: [''],
       email: [''],
       ramal: [''],
      tipoEnderecoId: 0,
      excluido: 'N'
    });

    this.instituicaoEnsinoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas;
    },
      error => this.errors);

  this.instituicaoEnsinoService.obterTodosTipoLogradouro()
    .subscribe(tipoLogradouros => {
      this.tipoLogradouros = tipoLogradouros;
    },
      error => this.errors);

  this.instituicaoEnsinoService.obterTodosLocalidade()
    .subscribe(localidades => {
      this.localidades = localidades;
    },
      error => this.errors);

  this.instituicaoEnsinoService.obterTodosUf()
    .subscribe(ufs => {
      this.ufs = ufs;
    },
      error => this.errors);

  this.instituicaoEnsinoService.obterTodosPais()
    .subscribe(paises => {
      this.paises = paises;
    },
      error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.instituicaoEnsinoForm);
    });
  }

  adicionarInstituicaoEnsino() {
    if (this.instituicaoEnsinoForm.dirty && this.instituicaoEnsinoForm.valid) {

      if (this.instituicaoEnsinoForm.controls['cep'].value === "") {
        this.popularForm("");
      }
      const p = Object.assign({}, this.instituicaoEnsino, this.instituicaoEnsinoForm.getRawValue());
      console.log(p);

      this.instituicaoEnsinoService.AdicionarInstituicaoEnsino(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Instituição de Ensino, Adicionado com Sucesso!');
              this.router.navigate(['instituicaoensino/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          error => {
            console.error(error);
          });
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['instituicaoensino/lista']);
  }

  ConsultaCEP(cep) {
    if (cep === null) {
         return;
    }

    cep = cep.replace(/\D/g, '');
    if (cep !== "") {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//cepapi.delivoro.com.br/" + cep)
          .map(dados => dados)
          .subscribe(dados => this.popularForm(dados));
      }
    }
  }

  popularForm(dados) {
    if (dados === "") {
      this.instituicaoEnsinoForm.controls['localidadeId'].patchValue(0);
      this.instituicaoEnsinoForm.controls['ufId'].patchValue(0);
      this.instituicaoEnsinoForm.controls['tipoLogradouroId'].patchValue(0);
      this.instituicaoEnsinoForm.controls['paisId'].patchValue(0);
      this.instituicaoEnsinoForm.controls['codigoMunicipioIbge'].patchValue(0);
      this.instituicaoEnsinoForm.patchValue({
        logradouro: dados,
        bairro: dados
      });
      return;
    }

    this.obterLocalidadePorDesc(dados.cidade);
    this.obterUfPorDesc(dados.cidade);
    this.obterTipoLogradouroPorDesc(dados.tipoLogradouro);
    this.obterPaisPorDesc('Brasil');
    this.consultaCepCodMunicipio(dados.cep);

    this.instituicaoEnsinoForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadePorDesc(desc: string) {
    this.instituicaoEnsinoService.obterLocalidadePorDesc(desc)
      .subscribe(
        result => {
          this.instituicaoEnsinoForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error);
        });
  }

  obterUfPorDesc(desc: string) {
    this.instituicaoEnsinoService.obterUfPorDesc(desc)
      .subscribe(
        result => {
           this.instituicaoEnsinoForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error);
        });
  }

  obterTipoLogradouroPorDesc(desc: string) {
    this.instituicaoEnsinoService.obterTipoLogradouroPorDesc(desc)
      .subscribe(
        result => {
          this.instituicaoEnsinoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error);
        });
  }

  obterPaisPorDesc(desc: string) {
       this.instituicaoEnsinoService.obterPaisPorDesc(desc)
      .subscribe(
        result => {
          this.instituicaoEnsinoForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error);
        });
  }

  consultaCepCodMunicipio(cep) {

    cep = cep.replace(/\D/g, '');
    if (cep !== "") {
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
          .map(result => result)
          .subscribe(result => this.instituicaoEnsinoForm.controls['codigoMunicipioIbge'].patchValue(result.ibge));
      }
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.instituicaoEnsinoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  ConsultaCnpj(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj !== "") {
      this.instituicaoEnsinoService.BuscarDadosCnpj(cnpj)
        .subscribe(
          result => {
            if (result.nome !== null) {
              this.popularFormCnpj(result);
            }
          },
          error => {
            this.onError(error);
          });
    }
  }

  popularFormCnpj(dados) {
    this.ConsultaCEP(dados.cep);
    this.instituicaoEnsinoForm.patchValue({
      cep: dados.cep.replace(".", ""),
      nome: dados.nome.substring(0, 100),
      telefone: dados.telefone.substring(0, 20)
    });
  }
}

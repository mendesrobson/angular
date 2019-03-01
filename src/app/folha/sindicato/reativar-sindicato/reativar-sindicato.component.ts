import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MaskService } from '../../../services/mask.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Sindicato, Localidade, TipoLogradouro, Uf, Pais, TipoEndereco, TipoEntidade, TipoSindicato } from '../models/sindicato';
import { SindicatoService } from '../sindicato.service';

@Component({
  selector: 'app-reativar-sindicato',
  templateUrl: './reativar-sindicato.component.html',
  styleUrls: []
})
export class ReativarSindicatoComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public sindicato: Sindicato;
  public sindicatoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  cepMask = this._maskService.Cep();
  cnpjMask = this._maskService.Cnpj();
  telMask = this._maskService.Telefone();


  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public localidades: Localidade[];
  public tipoLogradouros: TipoLogradouro[];
  public tipoEnderecos: TipoEndereco[];
  public ufs: Uf[];
  public paises: Pais[];
  public tipoEntidades: TipoEntidade[];
  public tipoSindicatos: TipoSindicato[];
  public sindicatoId: "";

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private sindicatoService: SindicatoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _maskService: MaskService,
    private httpClient: HttpClient) { 

      this.validationMessages = {

        codigo:{
          required: 'Código requerido!',
          maxlength: 'O Código deve ter no máximo 20 caracteres!'
        },
        sigla:{
          maxlength: 'A Sigla deve ter no máximo 20 caracteres!'
        },
        descricao:{
          required: 'Descrição requerida!',
          maxlength: 'A Descrição deve ter no máximo 100 caracteres!',
          minlength: 'A Descrição deve ter no mínimo 3 caracteres!'
        },
        cnpj:{
          required: 'Cnpj requerido!'
        },
        cep:{
          required: 'Cep requerido!'
        },
        logradouro:{
          maxlength: 'O Logradouro deve ter no máximo 120 caracteres!'
        },
        numero:{
          required: 'Número requerido!',
          maxlength: 'O Número deve ter no máximo 10 caracteres!'
        },
        complemento:{
          maxlength: 'O Complemento deve ter no máximo 100 caracteres!'
        },
        bairro:{
          maxlength: 'O Bairro deve ter no máximo 100 caracteres!'
        },
        telefone:{
          maxlength: 'O Telefone deve ter no máximo 20 caracteres!' 
        },
        ramal:{
          maxlength: 'O Ramal deve ter no máximo 10 caracteres!'
        },
        email:{
          maxlength: 'O E-mail deve ter no máximo 100 caracteres!'
        },
        site:{
          maxlength: 'O Site deve ter no máximo 100 caracteres!'
        },
        codigoEntidade:{
          maxlength: 'O Código Entidade deve ter no máximo 16 caracteres!'
        },
        nomeDocumentoProfissional:{
          maxlength: 'O Nome Documento Profissional deve ter no máximo 30 caracteres!'
        },
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.sindicato = new Sindicato();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    this.sindicatoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: [],
      empresaId: [],
      codigo: ['', [Validators.required]],
      sigla: [''],
      descricao: ['', [Validators.required]],
      cnpj:['', [Validators.required]],
      cep:['', [Validators.required]],
      tipoLogradouroId:[''],
      logradouro:[''],
      numero:['',[Validators.required]],
      complemento:[''],
      bairro:[''],
      tipoEnderecoId:[],
      localidadeId:[''],
      codigoMunicipioIbge:[''],
      ufId:[''],
      paisId:[''],
      telefone:[''],
      ramal:[''],
      email:[''],
      site: [''],
      tipoEntidade: [''],
      codigoEntidade: [''],
      nomeDocumentoProfissional: [''],
      tipoSindicato: [''],
      taxaHomologacao: 0,
      excluido: 'N',

    });

    this.sindicatoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
      error => this.errors);

    this.sindicatoService.obterTodosLocalidade()
    .subscribe(localidades => {
      this.localidades = localidades
    },
      error => this.errors);

    this.sindicatoService.obterTodosTipoLogradouro()
    .subscribe(tipoLogradouros => {
      this.tipoLogradouros = tipoLogradouros
    },
      error => this.errors);

    this.sindicatoService.obterTodosTipoEndereco()
    .subscribe(tipoEnderecos => {
      this.tipoEnderecos = tipoEnderecos
    },
      error => this.errors);

    this.sindicatoService.obterTodosUf()
    .subscribe(ufs => {
      this.ufs = ufs
    },
      error => this.errors);

    this.sindicatoService.obterTodosPais()
    .subscribe(paises => {
      this.paises = paises
    },
      error => this.errors);

    // this.sindicatoService.getTipoEntidade()
    // .subscribe(tipoEntidades => {
    //   this.tipoEntidades = tipoEntidades;
    // },
    //   error => this.errors);
    this.tipoEntidades = [
      {
        "id": "",
        "descricao": ""
      },
      {
        "id": "Sindi",
        "descricao": "Sindicato"
      },
      {
        "id": "Fede",
        "descricao": "Federação"
      },
      {
        "id": "Confe",
        "descricao": "Confederação"
      },
      {
        "id": "CEES",
        "descricao": "CEES"
      }

    ];

    // this.sindicatoService.getTipoSindicato()
    // .subscribe(tipoSindicatos => {
    //   this.tipoSindicatos = tipoSindicatos;
    // },
    //   error => this.errors);

    this.tipoSindicatos = [
      {
        "id": "Emp",
        "descricao": "Empregados"
      },
      {
        "id": "Pat",
        "descricao": "Patronal"
      },
      {
        "id": "Assoc",
        "descricao": "Associação de Classes"
      },
      {
        "id": "Conse",
        "descricao": "Conselho Regional"
      }
    ];
    
    this.sub = this.route.params.subscribe(
      params => {
        this.sindicatoId = params['id'];
        this.obterSindicato(this.sindicatoId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarSindicato();
      }
      else {
        self.cancelar();
      }
    });
  }


  obterSindicato(id: string) {
    this.sindicatoService.obterSindicato(id)
      .subscribe(
        sindicato => this.preencherFormSindicato(sindicato),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormSindicato(sindicato: Sindicato): void {
    this.sindicato = sindicato;

    this.reativarVisivel = this.sindicato.excluido === 'S';
    this.removerVisivel = this.sindicato.excluido === 'N';

    this.sindicatoForm.patchValue({
      id: this.sindicato.id,
      grupoEmpresaId: this.sindicato.grupoEmpresaId,
      empresaId: this.sindicato.empresaId,
      codigo: this.sindicato.codigo,
      sigla: this.sindicato.sigla,
      descricao: this.sindicato.descricao,
      cnpj: this.sindicato.cnpj,
      cep: this.sindicato.cep,
      tipoLogradouroId: this.sindicato.tipoEnderecoId,
      logradouro: this.sindicato.logradouro,
      numero: this.sindicato.numero,
      complemento: this.sindicato.complemento,
      bairro: this.sindicato.bairro,
      tipoEnderecoId: this.sindicato.tipoEnderecoId,
      localidadeId: this.sindicato.localidadeId,
      codigoMunicipioIbge: this.sindicato.codigoMunicipioIbge,
      ufId: this.sindicato.ufId,
      paisId: this.sindicato.paisId,
      telefone: this.sindicato.telefone,
      ramal: this.sindicato.ramal,
      email: this.sindicato.email,
      site: this.sindicato.site,
      tipoEntidade: this.sindicato.tipoEntidade,
      codigoEntidade: this.sindicato.codigoEntidade,
      nomeDocumentoProfissional: this.sindicato.nomeDocumentoProfissional,
      tipoSindicato: this.sindicato.tipoSindicato,
      taxaHomologacao: this.sindicato.taxaHomologacao,
      excluido: this.sindicato.excluido
    });
  }

  reativarSindicato() {
    this.sindicatoService.reativarSindicato(this.sindicato)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Sindicato reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }        
        this.router.navigate(['sindicato/lista']);
      },
      error => {
        console.error(error)
      });
  }


  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.sindicatoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['sindicato/editar/' + this.sindicatoId]);
  }

}

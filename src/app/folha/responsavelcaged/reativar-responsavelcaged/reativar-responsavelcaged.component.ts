import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { ResponsavelCaged, TipoPessoa, TipoLogradouro, TipoEndereco, Localidade, Uf, Pais } from '../models/responsavelcaged';
import { ResponsavelCagedService } from '../responsavelcaged.service';

@Component({
  selector: 'app-reativar-responsavelcaged',
  templateUrl: './reativar-responsavelcaged.component.html',
  styleUrls: []
})
export class ReativarResponsavelcagedComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public responsavelCaged: ResponsavelCaged;
  public responsavelCagedForm: FormGroup;
  public responsavelCagedId: "";
  displayMessage: { [key: string]: string } = {};

  cepMask = this._maskService.Cep();
  cnpjMask = this._maskService.Cnpj();
  telMask = this._maskService.Telefone(); 
  cpfMask = this._maskService.Cpf();

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public tipoPessoas: TipoPessoa[];

  public tipoLogradouros: TipoLogradouro[];
  public tipoEnderecos: TipoEndereco[];
  public localidades: Localidade[];
  public tipoPessoaId : number;
  public ufs: Uf[];
  public paises: Pais[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private responsavelCagedService: ResponsavelCagedService,
    private fb: FormBuilder,
    private router: Router,
    private _maskService: MaskService,
    private route: ActivatedRoute,
    private httpClient: HttpClient) { 

      this.validationMessages = {

        tipoPessoaId: {
          required: 'Tipo de pessoa requerida!'
        },
        codigo:{
          required: 'Código requerido!',
          maxlength: 'O código deve ter no máximo 20 caracteres!'
        },
        sigla:{
          maxlength: 'A Sigla deve ter no máximo 20 caracteres!'
        },
        nome:{
          maxlength: 'O Nome deve ter no máximo 100 caracteres!'
        },
        cep:{
          required: 'Cep requerido!',
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
        ramal:{
          maxlength: 'O Ramal deve ter no máximo 10 caracteres!'
        },
        numeroAutorizacao:{
          maxlength: 'O Número de Autorização deve ter no máximo 5 caracteres!'
        },
        email:{
          maxlength: 'O E-mail deve ter no máximo 100 caracteres!'
        },
        cpf:{
          required: 'Cpf requerido!'
        },
        cnpj:{
          required: 'Cnpj requerido!'
        },
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.responsavelCaged = new ResponsavelCaged();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    this.responsavelCagedForm = this.fb.group({
      id: 0,
      grupoEmpresaId: [],
      empresaId: [],
      tipoPessoaId:['', [Validators.required]],
      codigo: ['', [Validators.required]],
      sigla: [''],
      cnpj:[''],
      cpf: [''],
      nome: [''],
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
      numeroAutorizacao:[''],
      email:[''],
      excluido: 'N'

    });

    this.responsavelCagedService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
      error => this.errors);

    this.responsavelCagedService.obterTodosLocalidade()
    .subscribe(localidades => {
      this.localidades = localidades
    },
      error => this.errors);

    this.responsavelCagedService.obterTodosTipoPessoa()
    .subscribe(tipoPessoas => {
      this.tipoPessoas = tipoPessoas
    },
      error => this.errors);

    this.responsavelCagedService.obterTodosTipoLogradouro()
    .subscribe(tipoLogradouros => {
      this.tipoLogradouros = tipoLogradouros
    },
      error => this.errors);

    this.responsavelCagedService.obterTodosTipoEndereco()
    .subscribe(tipoEnderecos => {
      this.tipoEnderecos = tipoEnderecos
    },
      error => this.errors);

    this.responsavelCagedService.obterTodosUf()
    .subscribe(ufs => {
      this.ufs = ufs
    },
      error => this.errors);

    this.responsavelCagedService.obterTodosPais()
    .subscribe(paises => {
      this.paises = paises
    },
      error => this.errors);


    this.sub = this.route.params.subscribe(
      params => {
        this.responsavelCagedId = params['id'];
        this.ObterResponsavelCaged(this.responsavelCagedId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarResponsavelCaged();
      }
      else {
        self.cancelar();
      }
    });
  }

  reativarResponsavelCaged() {
    this.responsavelCagedService.reativarResponsavelCaged(this.responsavelCaged)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Responsável Caged reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }        
        this.router.navigate(['responsavelcaged/lista']);
      },
      error => {
        console.error(error)
      });
  }

  ObterResponsavelCaged(id: string) {
    this.responsavelCagedService.obterResponsavelCaged(id)
      .subscribe(
        responsavelcaged => this.preencherFormResponsavelCaged(responsavelcaged),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
          
        });
  }

  preencherFormResponsavelCaged(responsavelcaged: ResponsavelCaged): void {
    this.responsavelCaged = responsavelcaged;

    this.reativarVisivel = this.responsavelCaged.excluido === 'S';
    this.removerVisivel = this.responsavelCaged.excluido === 'N';

    this.responsavelCagedForm.patchValue({
      id: this.responsavelCaged.id,
      guid: 1,
      grupoEmpresaId: this.responsavelCaged.grupoEmpresaId,
      empresaId: this.responsavelCaged.empresaId,
      tipoPessoaId: this.responsavelCaged.tipoPessoaId,
      codigo: this.responsavelCaged.codigo,
      sigla: this.responsavelCaged.sigla,
      cnpj: this.responsavelCaged.cnpj,
      cpf: this.responsavelCaged.cpf,
      nome: this.responsavelCaged.nome,
      cep: this.responsavelCaged.cep,
      tipoLogradouroId: this.responsavelCaged.tipoLogradouroId,
      logradouro: this.responsavelCaged.logradouro,
      numero: this.responsavelCaged.numero,
      complemento: this.responsavelCaged.complemento,
      bairro: this.responsavelCaged.bairro,
      tipoEnderecoId: this.responsavelCaged.tipoEnderecoId,
      localidadeId: this.responsavelCaged.localidadeId,
      codigoMunicipioIbge: this.responsavelCaged.codigoMunicipioIbge,
      ufId: this.responsavelCaged.ufId,
      paisId: this.responsavelCaged.paisId,
      telefone: this.responsavelCaged.telefone,
      ramal: this.responsavelCaged.ramal,
      numeroAutorizacao: this.responsavelCaged.numeroAutorizacao,
      email: this.responsavelCaged.email,
      excluido: this.responsavelCaged.excluido
      
    });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.responsavelCagedService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  carregarFormEmpresa(event){
    
    this.tipoPessoaId = event;
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['responsavelcaged/lista']);
  }

}

import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { ResponsavelCagedService } from '../responsavelcaged.service';
import { ResponsavelCaged, TipoPessoa, TipoLogradouro, TipoEndereco, Localidade, Uf, Pais } from '../models/responsavelcaged';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editar-responsavelcaged',
  templateUrl: './editar-responsavelcaged.component.html',
  styleUrls: []
})
export class EditarResponsavelcagedComponent implements OnInit {
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
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private route: ActivatedRoute) { 

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
      grupoEmpresaId: null,
      empresaId: null,
      tipoPessoaId:[null, [Validators.required]],
      codigo: ['', [Validators.required]],
      sigla: [''],
      cnpj: null,
      cpf: null,
      nome: [''],
      cep:['', [Validators.required]],
      tipoLogradouroId: null,
      logradouro:[''],
      numero:['',[Validators.required]],
      complemento:[''],
      bairro:[''],
      tipoEnderecoId: null,
      localidadeId: null,
      codigoMunicipioIbge: null,
      ufId: null,
      paisId: null,
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
    !this.removerVisivel ? this.responsavelCagedForm.disable() : this.responsavelCagedForm.enable();

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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.responsavelCagedForm);
    });
  }

  editarResponsavelCaged() {
    if (this.responsavelCagedForm.dirty && this.responsavelCagedForm.valid) {
      const p = Object.assign({}, this.responsavelCaged, this.responsavelCagedForm.value);

      if(p.tipoPessoaId == 2){
        p.cpf = null;
      }else{
        p.cnpj = null;
      }

      this.responsavelCagedService.atualizarResponsavelCaged(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Responsável Caged atualizado com sucesso!');
                this.router.navigate(['responsavelcaged/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

        },
        error => {
            console.error(error)
        })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.responsavelCagedService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaCEP(cep) {

    if(cep != null && cep != ''){

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
    
  }

  popularForm(dados) {
    this.obterLocalidadePorDescricao(dados.cidade);
    this.obterUfPorDescricao(dados.cidade);
    this.obterTipoLogradouroPorDescricao(dados.tipoLogradouro);
    this.obterPaisPorDescricao('Brasil');
    this.consultaCepCodMunicipio(dados.cep);

    this.responsavelCagedForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadePorDescricao(desc: string) {
    this.responsavelCagedService.obterLocalidadePorDescricao(desc)
      .subscribe(
        result => {
          this.responsavelCagedForm.controls['localidadeId'].patchValue(result[0].id);
          console.log(this.responsavelCagedForm.controls['localidadeId']);
        },
        error => {
          this.onError(error)
        })
  }

  obterUfPorDescricao(desc: string) {
    this.responsavelCagedService.obterUfPorDescricao(desc)
      .subscribe(
        result => {
          this.responsavelCagedForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterTipoLogradouroPorDescricao(desc: string) {
    this.responsavelCagedService.obterTipoLogradouroPorDescricao(desc)
      .subscribe(
        result => {
          this.responsavelCagedForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterPaisPorDescricao(desc: string) {
    this.responsavelCagedService.obterPaisPorDescricao(desc)
      .subscribe(
        result => {
          this.responsavelCagedForm.controls['paisId'].patchValue(result[0].id);
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
          .subscribe(result => this.responsavelCagedForm.controls['codigoMunicipioIbge'].patchValue(result.ibge));
      }
    }
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

  remover(id) {
    this.router.navigate(['responsavelcaged/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['responsavelcaged/reativar/' + id]);
  }

  ConsultaCnpj(cnpj) {

    if(cnpj != null && cnpj != ''){

      cnpj = cnpj.replace(/\D/g, '');
      if (cnpj != "") {
        this.responsavelCagedService.buscarDadosCnpj(cnpj)
          .subscribe(
            result => {
              this.popularFormCnpj(result);
            },
            error => {
              this.onError(error)
            })
      }

    }
    
  }

  popularFormCnpj(dados) {

    if(dados != null){

      this.ConsultaCEP(dados.cep);

      this.responsavelCagedForm.patchValue({
      cep: dados.cep != null && dados.cep != '' ? dados.cep.replace(".", "") : dados.cep,
      descricao: dados.nome != null && dados.nome != '' ? dados.nome.substring(0, 100) : dados.nome,
      telefone: dados.telefone != null && dados.telefone != '' ? dados.telefone.substring(0, 20) : dados.telefone
    });

    }
  }

}

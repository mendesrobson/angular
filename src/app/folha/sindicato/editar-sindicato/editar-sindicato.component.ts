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
import { SindicatoComponent } from '../sindicato.component';

@Component({
  selector: 'app-editar-sindicato',
  templateUrl: './editar-sindicato.component.html',
  styleUrls: []
})
export class EditarSindicatoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public sindicato: Sindicato;
  public sindicatoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  cepMask = this._maskService.Cep();
  cnpjMask = this._maskService.Cnpj();
  telMask = this._maskService.Telefone();

  carregaDiretoriaSindical = false;
  carregaSindicatoConvencao = false;
  carregaBaseTerritorial = false;
  carregaSindicatoCargo = false;
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
    private httpClient: HttpClient,
    private sindicatoComponent: SindicatoComponent) {

    this.validationMessages = {

      codigo: {
        required: 'Código requerido!',
        maxlength: 'O Código deve ter no máximo 20 caracteres!'
      },
      sigla: {
        maxlength: 'A Sigla deve ter no máximo 20 caracteres!'
      },
      descricao: {
        required: 'Descrição requerida!',
        maxlength: 'A Descrição deve ter no máximo 100 caracteres!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!'
      },
      cnpj: {
        required: 'Cnpj requerido!'
      },
      cep: {
        required: 'Cep requerido!'
      },
      logradouro: {
        maxlength: 'O Logradouro deve ter no máximo 120 caracteres!'
      },
      numero: {
        required: 'Número requerido!',
        maxlength: 'O Número deve ter no máximo 10 caracteres!'
      },
      complemento: {
        maxlength: 'O Complemento deve ter no máximo 100 caracteres!'
      },
      bairro: {
        maxlength: 'O Bairro deve ter no máximo 100 caracteres!'
      },
      telefone: {
        maxlength: 'O Telefone deve ter no máximo 20 caracteres!'
      },
      ramal: {
        maxlength: 'O Ramal deve ter no máximo 10 caracteres!'
      },
      email: {
        maxlength: 'O E-mail deve ter no máximo 100 caracteres!'
      },
      site: {
        maxlength: 'O Site deve ter no máximo 100 caracteres!'
      },
      codigoEntidade: {
        maxlength: 'O Código Entidade deve ter no máximo 16 caracteres!'
      },
      nomeDocumentoProfissional: {
        maxlength: 'O Nome Documento Profissional deve ter no máximo 30 caracteres!'
      },
      tipoLogradouroId:{
        required: 'O Tipo de Logradouro é requerido!'
      },
      localidadeId:{
        required: 'A Cidade é requerida!'
      },
      codigoMunicipioIbge:{
        required: 'O Código Município Ibge é requerido!'
      },
      ufId:{
        required: 'O Estado é requerido!'
      },
      paisId:{
        required: 'O País é requerido!'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.sindicato = new Sindicato();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.sindicatoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: null,
      empresaId: null,
      codigo: ['', [Validators.required]],
      sigla: [''],
      descricao: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      tipoLogradouroId: null,
      logradouro: [''],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: [''],
      tipoEnderecoId: null,
      localidadeId: [null, [Validators.required]],
      codigoMunicipioIbge: ['', [Validators.required]],
      ufId: [null, [Validators.required]],  
      paisId: [null, [Validators.required]],
      telefone: [''],
      ramal: [''],
      email: [''],
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
    this.sindicatoComponent.Sindicato.sindicatoConvencao = sindicato.sindicatoConvencao;
    this.sindicatoComponent.Sindicato.baseTerritorialSindicato = sindicato.baseTerritorialSindicato;
    this.sindicatoComponent.Sindicato.sindicatoCargo = sindicato.sindicatoCargo;
    this.sindicatoComponent.Sindicato.diretoriaSindical = sindicato.diretoriaSindical;
    this.sindicato = sindicato;

    this.reativarVisivel = this.sindicato.excluido === 'S';
    this.removerVisivel = this.sindicato.excluido === 'N';
    !this.removerVisivel ? this.sindicatoForm.disable() : this.sindicatoForm.enable();
    this.sindicatoComponent.Excluido = !this.removerVisivel;

    this.sindicatoForm.patchValue({
      id: this.sindicato.id,
      grupoEmpresaId: this.sindicato.grupoEmpresaId,
      empresaId: this.sindicato.empresaId,
      codigo: this.sindicato.codigo,
      sigla: this.sindicato.sigla,
      descricao: this.sindicato.descricao,
      cnpj: this.sindicato.cnpj,
      cep: this.sindicato.cep,
      tipoLogradouroId: this.sindicato.tipoLogradouroId,
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

    this.carregaSindicatoCargo = true;
    this.carregaDiretoriaSindical = true;
    this.carregaBaseTerritorial = true;
    this.carregaSindicatoConvencao = true;

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.sindicatoForm);
    });
  }

  editarSindicato() {
    if (this.sindicatoForm.dirty && this.sindicatoForm.valid) {
      const p = Object.assign({}, this.sindicato, this.sindicatoForm.value);

      p.sindicatoCargo = null;
      p.sindicatoConvencao = null;
      p.diretoriaSindical = null;
      p.baseTerritorialSindicato = null;
      p.sindicato = null;

      this.sindicatoService.atualizarSindicato(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Sindicato atualizado com sucesso!');
              this.router.navigate(['sindicato/lista']);
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

      if(idGrupo != null && idGrupo != ''){

        this.empresas = [];
        this.sindicatoService.obterTodosEmpresa(idGrupo)
          .subscribe(empresas => {
            this.empresas = empresas
          },
            () => this.errors);

      }
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

    this.sindicatoForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadePorDescricao(desc: string) {
    this.sindicatoService.obterLocalidadePorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterUfPorDescricao(desc: string) {
    this.sindicatoService.obterUfPorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterTipoLogradouroPorDescricao(desc: string) {
    this.sindicatoService.obterTipoLogradouroPorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterPaisPorDescricao(desc: string) {
    this.sindicatoService.obterPaisPorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  consultaCepCodMunicipio(cep) {

        if(cep != null && cep != ''){

          cep = cep.replace(/\D/g, '');
          if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
              this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
                .map(result => result)
                .subscribe(result => this.sindicatoForm.controls['codigoMunicipioIbge'].patchValue(result.ibge));
            }
          }

        }

    
  }

  ConsultaCnpj(cnpj) {

    if(cnpj != null && cnpj != ''){
    
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj != "") {
          this.sindicatoService.buscarDadosCnpj(cnpj)
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

      this.sindicatoForm.patchValue({
      cep: dados.cep != null && dados.cep != '' ? dados.cep.replace(".", "") : dados.cep,
      descricao: dados.nome.substring(0, 100),
      telefone: dados.telefone.substring(0, 20)
    });

    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['sindicato/lista']);
  }

  remover(id) {
    this.router.navigate(['sindicato/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['sindicato/reativar/' + id]);
  }

}

import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { MaskService } from '../../../services/mask.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Sindicato, Localidade, TipoLogradouro, TipoEndereco, Uf, Pais, TipoEntidade, TipoSindicato } from '../models/sindicato';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SindicatoService } from '../sindicato.service';
import validator from 'devextreme/ui/validator';
import { SindicatoComponent } from './../sindicato.component';

@Component({
  selector: 'app-adicionar-sindicato',
  templateUrl: './adicionar-sindicato.component.html',
  styleUrls: []
})
export class AdicionarSindicatoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

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

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private sindicatoService: SindicatoService,
    private fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private sindicatoComponent: SindicatoComponent
  ) {

    this.sindicatoComponent.Excluido = false;

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
    this.sindicatoComponent.Sindicato.sindicatoCargo = new Array();
    this.sindicatoComponent.Sindicato.sindicatoConvencao = new Array();
    this.sindicatoComponent.sindicato.diretoriaSindical = new Array();
    this.sindicatoComponent.sindicato.baseTerritorialSindicato = new Array();
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
      localidadeId: [null],
      codigoMunicipioIbge: [''],
      ufId: [null],
      paisId: [null],
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
        () => this.errors);

    this.sindicatoService.obterTodosLocalidade()
      .subscribe(localidades => {
        this.localidades = localidades
      },
        () => this.errors);

    this.sindicatoService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        () => this.errors);

    this.sindicatoService.obterTodosTipoEndereco()
      .subscribe(tipoEnderecos => {
        this.tipoEnderecos = tipoEnderecos
      },
        () => this.errors);

    this.sindicatoService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs
      },
        () => this.errors);

    this.sindicatoService.obterTodosPais()
      .subscribe(paises => {
        this.paises = paises
      },
        () => {});

    // this.sindicatoService.getTipoEntidade()
    // .subscribe(tipoEntidades => {
    //   this.tipoEntidades = tipoEntidades;
    // },
    //   () => this.errors);
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
    //   .subscribe(tipoSindicatos => {
    //     this.tipoSindicatos = tipoSindicatos;
    //   },
    //     error => this.errors);

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

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.sindicatoForm);
    });
  }

  adicionarSindicato() {
    if (this.sindicatoForm.dirty && this.sindicatoForm.valid) {
      const p = Object.assign({}, this.sindicato, this.sindicatoForm.getRawValue());

      for(var i =0; this.sindicatoComponent.Sindicato.diretoriaSindical.length > i;i++){
        this.sindicatoComponent.Sindicato.diretoriaSindical[i].cargo = null;
      }
      
      p.sindicatoConvencao = this.sindicatoComponent.sindicato.sindicatoConvencao;
      p.sindicatoCargo = this.sindicatoComponent.Sindicato.sindicatoCargo;
      p.diretoriaSindical = this.sindicatoComponent.Sindicato.diretoriaSindical;
      p.baseTerritorialSindicato = this.sindicatoComponent.Sindicato.baseTerritorialSindicato;

      this.sindicatoService.adicionarSindicato(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Sindicato adicionado com sucesso!');
              this.router.navigate(['sindicato/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

          },
          () => {})
    }
  }

  cancelar() {
    this.router.navigate(['sindicato/lista']);
  }


  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.sindicatoService.obterTodosEmpresa(idGrupo)
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
        () => {  })
  }

  obterUfPorDescricao(desc: string) {
    this.sindicatoService.obterUfPorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
        })
  }

  obterTipoLogradouroPorDescricao(desc: string) {
    this.sindicatoService.obterTipoLogradouroPorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        () => {  })
  }

  obterPaisPorDescricao(desc: string) {
    this.sindicatoService.obterPaisPorDescricao(desc)
      .subscribe(
        result => {
          this.sindicatoForm.controls['paisId'].patchValue(result[0].id);
        },
        () => {  })
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
            () => {   })
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

}

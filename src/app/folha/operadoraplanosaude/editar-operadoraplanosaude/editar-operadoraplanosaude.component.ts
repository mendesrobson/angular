import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OperadoraPlanoSaude } from './../models/operadoraplanosaude';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { OperadoraPlanoSaudeService } from './../operadoraplanosaude.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BaixaPagarReceberPgto } from './../../../contasreceber/tituloparcelabaixa/models/tituloparcelabaixa';
import { HttpClient } from '@angular/common/http';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { TipoLogradouro, Uf, Pais, Localidade } from '../../../cadastros/pessoa/models/pessoa';
import { MaskService } from '../../../services/mask.service';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-editar-operadoraplanosaude',
  templateUrl: './editar-operadoraplanosaude.component.html',
  styleUrls: []
})

export class EditarOperadoraPlanoSaudeComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel = false;
  public reativarVisivel = false;

  public operadoraPlanoSaudeForm: FormGroup;
  public operadoraPlanoSaude: OperadoraPlanoSaude;
  public operadoraPlanoSaudeId: string = "";

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

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private operadoraPlanoSaudeService: OperadoraPlanoSaudeService,
    private fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private route: ActivatedRoute) {
    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      codigo: {
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
        maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
      },
      nome: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      registroAns: {
        minlength: 'O Registro Ans precisa ter no mínimo 1 caracter',
        maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
      },
      telefone: {
        minlength: 'O Telefone precisa ter no mínimo 9 digitos',
        maxlength: 'O Telefone precisa ter no máximo 20 digitos'
      },
      logradouro: {
        minlength: 'O Logradouro precisa ter no mínimo 1 caracter',
        maxlength: 'O Logradouro precisa ter no máximo 100 caracteres'
      },
      numero: {
        minlength: 'O Número precisa ter no mínimo 1 caracteres',
        maxlength: 'O Número precisa ter no máximo 20 caracteres'
      },
      complemento: {
        minlength: 'O Número precisa ter no mínimo 1 caracter',
        maxlength: 'O Número precisa ter no máximo 100 caracteres'
      },
      bairro: {
        minlength: 'O Número precisa ter no mínimo 1 caracter',
        maxlength: 'O Número precisa ter no máximo 100 caracteres'
      },
      localidadeId: {},
      ufId: {},
      paisId: {},
      tipoLogradouroId: {}
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.operadoraPlanoSaude = new OperadoraPlanoSaude();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.operadoraPlanoSaudeForm = this.fb.group({
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [
        Validators.minLength(2),
        Validators.maxLength(20)]],
      sigla: ['', [
        Validators.minLength(2),
        Validators.maxLength(20)]],
      nome: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      cnpj: [''],
      registroAns: ['', [
        Validators.minLength(1),
        Validators.maxLength(20)]],
      telefone: ['', [
        Validators.minLength(9),
        Validators.maxLength(20)]],
      cep: [''],
      logradouro: ['', [
        Validators.minLength(1),
        Validators.maxLength(100)]],
      numero: ['', [
        Validators.minLength(1),
        Validators.maxLength(20)]],
      complemento: ['', [
        Validators.minLength(1),
        Validators.maxLength(100)]],
      bairro: ['', [
        Validators.minLength(1),
        Validators.maxLength(100)]],
      localidadeId: [''],
      ufId: [''],
      paisId: [''],
      tipoLogradouroId: [''],
      codigoMunicipioIbge: [''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.operadoraPlanoSaudeId = params['id'];
        this.obterOperadoraPlanoSaude(this.operadoraPlanoSaudeId);
      });

    this.operadoraPlanoSaudeService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.operadoraPlanoSaudeService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        error => this.errors);

    this.operadoraPlanoSaudeService.obterTodosLocalidade()
      .subscribe(localidades => {
        this.localidades = localidades
      },
        error => this.errors);

    this.operadoraPlanoSaudeService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs
      },
        error => this.errors);

    this.operadoraPlanoSaudeService.obterTodosPais()
      .subscribe(paises => {
        this.paises = paises
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.operadoraPlanoSaudeForm);
    });
  }

  obterOperadoraPlanoSaude(id: string) {
    this.operadoraPlanoSaudeService.obterOperadoraPlanoSaude(id)
      .subscribe(
        operadoraplanosaude => this.preencherFormOperadoraPlanoSaude(operadoraplanosaude),
        response => {
          if (response.status === 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormOperadoraPlanoSaude(operadoraPlanoSaude: OperadoraPlanoSaude): void {
    this.operadoraPlanoSaude = operadoraPlanoSaude;

    this.reativarVisivel = this.operadoraPlanoSaude.excluido === 'S';
    this.removerVisivel = this.operadoraPlanoSaude.excluido === 'N';
    !this.removerVisivel ? this.operadoraPlanoSaudeForm.disable() : this.operadoraPlanoSaudeForm.enable();

    this.operadoraPlanoSaudeForm.patchValue({
      id: this.operadoraPlanoSaude.id,
      grupoEmpresaId: this.operadoraPlanoSaude.grupoEmpresaId,
      empresaId: this.operadoraPlanoSaude.empresaId,
      codigo: this.operadoraPlanoSaude.codigo,
      sigla: this.operadoraPlanoSaude.sigla,
      nome: this.operadoraPlanoSaude.nome,
      cnpj: this.operadoraPlanoSaude.cnpj,
      registroAns: this.operadoraPlanoSaude.registroAns,
      telefone: this.operadoraPlanoSaude.telefone,
      cep: this.operadoraPlanoSaude.cep,
      logradouro: this.operadoraPlanoSaude.logradouro,
      numero: this.operadoraPlanoSaude.numero,
      complemento: this.operadoraPlanoSaude.complemento,
      bairro: this.operadoraPlanoSaude.bairro,
      localidadeId: this.operadoraPlanoSaude.localidadeId,
      ufId: this.operadoraPlanoSaude.ufId,
      paisId: this.operadoraPlanoSaude.paisId,
      tipoLogradouroId: this.operadoraPlanoSaude.tipoLogradouroId,
      codigoMunicipioIbge: this.operadoraPlanoSaude.codigoMunicipioIbge,
      excluido: this.operadoraPlanoSaude.excluido
    });
  }

  editarOperadoraPlanoSaude() {
    if (this.operadoraPlanoSaudeForm.dirty && this.operadoraPlanoSaudeForm.valid) {
      const p = Object.assign({}, this.operadoraPlanoSaudeService, this.operadoraPlanoSaudeForm.value);

      this.operadoraPlanoSaudeService.atualizarOperadoraPlanoSaude(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Operadora de Plano de Saúde Atualizado com Sucesso');
            this.router.navigate(['operadoraplanosaude/lista']);
          },
          error => {
            console.error(error);
          });
    }
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

    this.operadoraPlanoSaudeForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadePorDesc(desc: string) {
    this.operadoraPlanoSaudeService.obterLocalidadePorDesc(desc)
      .subscribe(
        result => {
          this.operadoraPlanoSaudeForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterUfPorDesc(desc: string) {
    this.operadoraPlanoSaudeService.obterUfPorDesc(desc)
      .subscribe(
        result => {
          this.operadoraPlanoSaudeForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterTipoLogradouroPorDesc(desc: string) {
    this.operadoraPlanoSaudeService.obterTipoLogradouroPorDesc(desc)
      .subscribe(
        result => {
          this.operadoraPlanoSaudeForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterPaisPorDesc(desc: string) {
    this.operadoraPlanoSaudeService.obterPaisPorDesc(desc)
      .subscribe(
        result => {
          this.operadoraPlanoSaudeForm.controls['paisId'].patchValue(result[0].id);
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
          .subscribe(result => this.operadoraPlanoSaudeForm.controls['codigoMunicipioIbge'].patchValue(result.ibge));
      }
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.operadoraPlanoSaudeService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaCnpj(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj != "") {
      this.operadoraPlanoSaudeService.buscarDadosCnpj(cnpj)
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
    if (dados.cep != null) {
      this.ConsultaCEP(dados.cep);

      this.operadoraPlanoSaudeForm.patchValue({
        cep: dados.cep.replace(".", ""),
        nome: dados.nome,
        telefone: dados.telefone
      });
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['operadoraplanosaude/lista']);
  }

  remover(id) {
    this.router.navigate(['operadoraplanosaude/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['operadoraplanosaude/reativar/' + id]);
  }

}

import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Agencia, Banco, TipoLogradouro, Uf, Pais, Localidade } from '../models/agencia';
import { AgenciaService } from '../agencia.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editar-agencia',
  templateUrl: './editar-agencia.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class EditarAgenciaComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public agencia: Agencia;
  public agenciaForm: FormGroup;
  public agenciaId: string = "";
  public sub: Subscription;

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

  constructor(
    private agenciaService: AgenciaService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {

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
      // empresaId: {
      //   required: 'Informe a Empresa'
      // },
      // grupoEmpresaId: {
      //   required: 'Informe o Grupo'
      // },
      bancoId: {
        required: 'Informe o Banco'
      },
      gerente: {
        required: 'O Gerente é requerido',
        minlength: 'O Gerente precisa ter no mínimo 3 caracteres',
        maxlength: 'O Gerente precisa ter no máximo 60 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.agencia = new Agencia();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {

    this.agenciaForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      empresaId: '', //['', [Validators.required]],
      grupoEmpresaId: '', //['', [Validators.required]],
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

    this.sub = this.route.params.subscribe(
      params => {
        this.agenciaId = params['id'];
        this.obterAgencia(this.agenciaId);
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

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.agenciaForm);
    });

  }

  obterAgencia(id: string) {
    this.agenciaService.obterAgencia(id)
      .subscribe(
        agencia => this.preencherFormAgencia(agencia),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormAgencia(agencia: Agencia): void {
    this.agencia = agencia;

    this.reativarVisivel = this.agencia.excluido === 'S';
    this.removerVisivel = this.agencia.excluido === 'N';

    this.agenciaForm.controls['codigo'].disable();

    this.agenciaForm.patchValue({
      codigo: this.agencia.codigo,
      sigla: this.agencia.sigla,
      descricao: this.agencia.descricao,
      empresaId: this.agencia.empresaId,
      grupoEmpresaId: this.agencia.grupoEmpresaId,
      bancoId: this.agencia.bancoId,
      digito: this.agencia.digito,
      cep: this.agencia.cep,
      tipoLogradouroId: this.agencia.tipoLogradouroId,
      logradouro: this.agencia.logradouro,
      numero: this.agencia.numero,
      complemento: this.agencia.complemento,
      bairro: this.agencia.bairro,
      localidadeId: this.agencia.localidadeId,
      ufId: this.agencia.ufId,
      paisId: this.agencia.paisId,
      gerente: this.agencia.gerente
    });
  }

  editarAgencia() {
    if (this.agenciaForm.dirty && this.agenciaForm.valid) {

      let p = Object.assign({}, this.agencia, this.agenciaForm.getRawValue());

      this.agenciaService.AtualizarAgencia(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Agência Atualizado com Sucesso!');
            this.router.navigate(['agencia/lista']);
          },
          error => {
            this.onError(error)
          })
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

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.agenciaService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }
  
  cancelar() {
    this.router.navigate(['agencia/lista']);
  }

  remover(id) {
    this.router.navigate(['agencia/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['agencia/reativar/' + id]);
  }


}


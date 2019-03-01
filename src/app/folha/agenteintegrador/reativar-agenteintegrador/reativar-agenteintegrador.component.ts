import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AgenteIntegrador, TipoLogradouro, Uf, Pais, Localidade } from '../models/agenteintegrador';
import { AgenteintegradorService } from '../agenteintegrador.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-reativar-agenteintegrador',
  templateUrl: './reativar-agenteintegrador.component.html',
  styleUrls: []
})
export class ReativarAgenteintegradorComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public agenteIntegrador: AgenteIntegrador;
  public agenteIntegradorForm: FormGroup;
  public agenteIntegradorId: string = "";

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
    private agenteIntegradorService: AgenteintegradorService,
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

    this.sub = this.route.params.subscribe(
      params => {
        this.agenteIntegradorId = params['id'];
        this.obterAgenteIntegrador(this.agenteIntegradorId);
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
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarAgenteIntegrador();
      }
      else {
        self.cancelar();
      }
    });

  }

  obterAgenteIntegrador(id: string) {
    this.agenteIntegradorService.obterAgenteIntegrador(id)
      .subscribe(
        agenteIntegrador => this.preencherFormAgenteIntegrador(agenteIntegrador),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormAgenteIntegrador(agenteIntegrador: AgenteIntegrador): void {
    this.agenteIntegrador = agenteIntegrador;

    this.reativarVisivel = this.agenteIntegrador.excluido === 'S';
    this.removerVisivel = this.agenteIntegrador.excluido === 'N';

    this.agenteIntegradorForm.patchValue({
      id: this.agenteIntegrador.id,
      grupoEmpresaId: this.agenteIntegrador.grupoEmpresaId,
      empresaId: this.agenteIntegrador.empresaId,
      tipoLogradouroId: this.agenteIntegrador.tipoLogradouroId,
      ufId: this.agenteIntegrador.ufId,
      paisId: this.agenteIntegrador.paisId,
      localidadeId: this.agenteIntegrador.localidadeId,
      codigo: this.agenteIntegrador.codigo,
      sigla: this.agenteIntegrador.sigla,
      descricao: this.agenteIntegrador.descricao,
      nome: this.agenteIntegrador.nome,
      cnpj: this.agenteIntegrador.cnpj,
      logradouro: this.agenteIntegrador.logradouro,
      numero: this.agenteIntegrador.numero,
      complemento: this.agenteIntegrador.complemento,
      cep: this.agenteIntegrador.cep,
      bairro: this.agenteIntegrador.bairro,
      codigoMunicipioIbge: this.agenteIntegrador.codigoMunicipioIbge,
      telefone: this.agenteIntegrador.telefone,
      excluido: this.agenteIntegrador.excluido
    });
  }

  reativarAgenteIntegrador() {
    this.agenteIntegradorService.reativarAgenteIntegrador(this.agenteIntegrador)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Agente Integrador, Reativado com Sucesso');
          this.router.navigate(['agenteintegrador/lista']);
        },
        error => {
          console.error(error)
        });
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

  cancelar() {
    this.router.navigate(['agenteintegrador/editar/' + this.agenteIntegradorId]);
  }

}

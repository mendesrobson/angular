import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, Fornecedor, Endereco, PessoaContato, TipoPessoa, Sexo, Localidade, Uf, EstadoCivil, Profissao, Religiao, Cor, Cnpj, Cliente, Servico } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-excluir-pessoa',
  templateUrl: './excluir-pessoa.component.html',
  styleUrls: ['./excluir-pessoa.component.css']
})
export class ExcluirPessoaComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public pessoa: Pessoa;
  public endereco: Endereco;
  public pessoaForm: FormGroup;

  public pessoaId: string = "";

  public fornecedor: Fornecedor;
  public cliente: Cliente;
  public empresa: Empresa;

  public empId: number;
  public gEmpId: number;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};
  cpfMask = this._maskService.Cpf();
  cnpjMask = this._maskService.Cnpj();

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public sub: Subscription;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipoPessoa: TipoPessoa[];
  public sexo: Sexo[];
  public localidade: Localidade[];
  public uf: Uf[];
  public estadoCivil: EstadoCivil[];
  public profissao: Profissao[];
  public religiao: Religiao[];
  public cor: Cor[];
  public servicos: Servico[];

  carregaEndereco: boolean = false;
  carregaContato: boolean = false;
  carregaEmpresa: boolean = false;

  public errors: any[] = [];

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private utilService: UtilService,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      codigo: {
        required: 'Informe o Código',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.pessoa = new Pessoa();
    this.endereco = new Endereco();
    this.fornecedor = new Fornecedor();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.pessoaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      tipoPessoaId: '',
      tipoId: '',
      nome: ['', [Validators.required]],
      sexoId: 0,
      cpf: ['', [Validators.required]],
      rg: '',
      dataNascimento: ['', [Validators.required]],
      localidadeId: '',
      ufNascimentoId: '',
      estadoCivilId: [0, [Validators.required]],
      dataCasamento: '',
      profissaoId: '',
      religiaoId: '',
      corRacaId: '',
      cnpj: '',
      fantasia: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      orgEmissaoRg: '',
      dataEmissaoRg: '',
      rge: '',
      dataAbertura: '',
      dataFalecimento: '',
      dataEncerramento: '',
      empresaTrabalha: '',
      site: '',
      tituloEleitoral: '',
      sessaoEleitoral: '',
      zonaEleitoral: '',
      dataEmissaoTitulo: '',
      nomeMae: '',
      nomePai: '',
      descricaoDeficiencia: '',
      descricaoCtps: '',
      numSerieCtps: 0,
      ufCtps: '',
      dataEmissaoCtps: '',
      descricaoReservista: '',
      numRaReservista: 0,
      categoriaReservista: '',
      dataEmissaoReservista: '',
      servicoId: '',
      discriminacao: '',
      tokenHomologacaoNfse: '',
      tokenProducaoNfse: '',
      rpsHomologacaoNfse: '',
      rpsProducaoNfse: '',
      codigoTributacaoMunicipio: '',
      emiteProducao: ''
    });

    this.pessoaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.pessoaService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.pessoaService.obterTodosTipoPessoa()
      .subscribe(tipoPessoa => {
        this.tipoPessoa = tipoPessoa

      },
        error => this.errors);

    this.pessoaService.obterTodosSexo()
      .subscribe(sexo => {
        this.sexo = sexo

      },
        error => this.errors);

    this.pessoaService.obterLocalidade()
      .subscribe(localidade => {
        this.localidade = localidade
      },
        () => this.errors);

    this.pessoaService.obterUf()
      .subscribe(uf => {
        this.uf = uf
      },
        () => this.errors);

    this.pessoaService.obterTodosEstadoCivil()
      .subscribe(estadoCivil => {
        this.estadoCivil = estadoCivil
      },
        () => this.errors);

    this.pessoaService.obterProfissao()
      .subscribe(profissao => {
        this.profissao = profissao
      },
        error => this.errors);

    this.pessoaService.obterReligiao()
      .subscribe(religiao => {
        this.religiao = religiao
      },
        () => this.errors);

    this.pessoaService.obterTodosCor()
      .subscribe(cor => {
        this.cor = cor
      },
        () => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.pessoaId = params['id'];
        this.obterPessoa(this.pessoaId);
      });

    this.pessoaService.obterTodosServico()
      .subscribe(servicos => {
        this.servicos = servicos
      },
        () => this.errors);
  }

  obterPessoa(id: string) {
    this.pessoaService.obterPessoa(id)
      .subscribe(
        pessoa => {
          this.consultarPessoaFornecedor(pessoa);

        },
        response => {
          if (response.status == 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  consultarPessoaFornecedor(pessoa: Pessoa): void {


    if (this.cliente == null) {
      this.pessoaService.obterClientePorPessoaId(this.pessoaId)
        .subscribe(cliente => {
          this.cliente = cliente;
          //console.log(this.cliente);
          if (this.cliente != null) {
            this.empId = this.cliente.empresaId;
            this.gEmpId = this.cliente.grupoEmpresaId;
            this.preencherFormPessoa(pessoa, 1);
          } else {
            this.pessoaService.obterFornecedorPorPessoaId(this.pessoaId)
              .subscribe(fornecedor => {
                this.fornecedor = fornecedor;
                //console.log(this.fornecedor);
                if (this.fornecedor != null) {
                  this.empId = this.fornecedor.empresaId;
                  this.gEmpId = this.fornecedor.grupoEmpresaId;
                  this.preencherFormPessoa(pessoa, 2);
                } else {
                  this.pessoaService.obterEmpresaPorPessoaId(this.pessoaId)
                    .subscribe(empresa => {
                      this.empresa = empresa;
                      //console.log(this.empresa);
                      if (this.empresa != null) {
                        this.empId = this.empresa.id;
                        this.gEmpId = this.empresa.grupoEmpresaId;
                        this.preencherFormPessoa(pessoa, 3);
                      }
                    },
                      () => this.errors
                    );
                }

              },
                () => this.errors
              );
          }

        },
          () => this.errors
        );
    }
    //console.log(pessoa);
  }

  preencherFormPessoa(pessoa: Pessoa, tipoId: number): void {

    this.pessoa = new Pessoa();

    this.pessoa = pessoa;
    this.pessoaComponent.Pessoa = pessoa;

    this.pessoaForm.controls['codigo'].disable();

    if (tipoId == 3) {
      this.pessoaService.obterTodosEmpresaGrupo(this.pessoa.id.toString())
        .subscribe(empresa => {
          this.pessoaComponent.empresa = [];
          for (let i = 0; empresa.length > i; i++) {
            this.pessoaComponent.empresa.push(empresa[i]);
          }
        }
        )
    }


    let dataNascimento = '';
    let dataCasamento = '';
    let dataEmissaoRg = '';
    let dataAbertura = '';
    let dataFalecimento = '';
    let dataEncerramento = '';
    let dataEmissaoTitulo = '';
    let dataEmissaoCtps = '';
    let dataEmissaoReservista = '';
    if (this.pessoa.dataNascimento == null || this.pessoa.dataNascimento == '') {
      dataNascimento = '';
    } else {
      dataNascimento = this.utilService.ToDate(this.pessoa.dataNascimento);
    }
    if (this.pessoa.dataCasamento == null || this.pessoa.dataCasamento == '') {
      dataCasamento = '';
    } else {
      dataCasamento = this.utilService.ToDate(this.pessoa.dataCasamento);
    }
    if (this.pessoa.dataEmissaoRg == null || this.pessoa.dataEmissaoRg == '') {
      dataEmissaoRg = '';
    } else {
      dataEmissaoRg = this.utilService.ToDate(this.pessoa.dataEmissaoRg);
    }
    if (this.pessoa.dataAbertura == null || this.pessoa.dataAbertura == '') {
      dataAbertura = '';
    } else {
      dataAbertura = this.utilService.ToDate(this.pessoa.dataAbertura);
    }
    if (this.pessoa.dataFalecimento == null || this.pessoa.dataFalecimento == '') {
      dataFalecimento = '';
    } else {
      dataFalecimento = this.utilService.ToDate(this.pessoa.dataFalecimento);
    }
    if (this.pessoa.dataEncerramento == null || this.pessoa.dataEncerramento == '') {
      dataEncerramento = '';
    } else {
      dataEncerramento = this.utilService.ToDate(this.pessoa.dataEncerramento);
    }
    if (this.pessoa.dataEmissaoTitulo == null || this.pessoa.dataEmissaoTitulo == '') {
      dataEmissaoTitulo = '';
    } else {
      dataEmissaoTitulo = this.utilService.ToDate(this.pessoa.dataEmissaoTitulo);
    }
    if (this.pessoa.dataEmissaoCtps == null || this.pessoa.dataEmissaoCtps == '') {
      dataEmissaoCtps = '';
    } else {
      dataEmissaoCtps = this.utilService.ToDate(this.pessoa.dataEmissaoCtps);
    }
    if (this.pessoa.dataEmissaoReservista == null || this.pessoa.dataEmissaoReservista == '') {
      dataEmissaoReservista = '';
    } else {
      dataEmissaoReservista = this.utilService.ToDate(this.pessoa.dataEmissaoReservista);
    }


    let servicoId = 0;
    let discriminacao = '';
    let tokenHomologacaoNfse = '';
    let tokenProducaoNfse = '';
    let rpsHomologacaoNfse = 0;
    let rpsProducaoNfse = '';
    let codigoTributacaoMunicipio = '';
    let emiteProducao = '';

    if (this.empresa == null) {

    } else {
      if (this.empresa.servicoId != null) {
        servicoId = this.empresa.servicoId;
      } else {
        servicoId = 0;
      }


      if (this.empresa.discriminacao != null) {
        discriminacao = this.empresa.discriminacao;
      } else {
        discriminacao = '';
      }

      if (this.empresa.tokenHomologacaoNfse != null) {
        tokenHomologacaoNfse = this.empresa.tokenHomologacaoNfse;
      } else {
        tokenHomologacaoNfse = '';
      }

      if (this.empresa.tokenProducaoNfse != null) {
        tokenProducaoNfse = this.empresa.tokenProducaoNfse;
      } else {
        tokenProducaoNfse = '';
      }

      if (this.empresa.rpsHomologacaoNfse != null) {
        rpsHomologacaoNfse = this.empresa.rpsHomologacaoNfse;
      } else {
        rpsHomologacaoNfse = 0;
      }

      if (this.empresa.rpsProducaoNfse != null) {
        rpsProducaoNfse = this.empresa.rpsProducaoNfse;
      } else {
        rpsProducaoNfse = '';
      }

      if (this.empresa.codigoTributacaoMunicipio != null) {
        codigoTributacaoMunicipio = this.empresa.codigoTributacaoMunicipio;
      } else {
        codigoTributacaoMunicipio = '';
      }

      if (this.empresa.emiteProducao != null) {
        emiteProducao = this.empresa.emiteProducao;
      } else {
        emiteProducao = '';
      }

    }



    this.pessoaForm.patchValue({
      empresaId: this.empId,
      grupoEmpresaId: this.gEmpId,
      codigo: this.pessoa.codigo,
      tipoPessoaId: this.pessoa.tipoPessoaId,
      tipoId: tipoId,
      nome: this.pessoa.nome,
      sexoId: this.pessoa.sexoId,
      cpf: this.pessoa.cpf,
      rg: this.pessoa.rg,
      dataNascimento: dataNascimento,
      localidadeId: this.pessoa.localidadeId,
      ufNascimentoId: this.pessoa.ufNascimentoId,
      estadoCivilId: this.pessoa.estadoCivilId,
      dataCasamento: dataCasamento,
      profissaoId: this.pessoa.profissaoId,
      religiaoId: this.pessoa.religiaoId,
      corRacaId: this.pessoa.corRacaId,
      cnpj: this.pessoa.cnpj,
      fantasia: this.pessoa.fantasia,
      inscricaoEstadual: this.pessoa.inscricaoEstadual,
      inscricaoMunicipal: this.pessoa.inscricaoMunicipal,
      orgEmissaoRg: this.pessoa.orgEmissaoRg,
      dataEmissaoRg: dataEmissaoRg,
      rge: this.pessoa.rge,
      dataAbertura: dataAbertura,
      dataFalecimento: dataFalecimento,
      dataEncerramento: dataEncerramento,
      empresaTrabalha: this.pessoa.empresaTrabalha,
      site: this.pessoa.site,
      tituloEleitoral: this.pessoa.tituloEleitoral,
      sessaoEleitoral: this.pessoa.sessaoEleitoral,
      zonaEleitoral: this.pessoa.zonaEleitoral,
      dataEmissaoTitulo: dataEmissaoTitulo,
      nomeMae: this.pessoa.nomeMae,
      nomePai: this.pessoa.nomePai,
      descricaoDeficiencia: this.pessoa.descricaoDeficiencia,
      descricaoCtps: this.pessoa.descricaoCtps,
      numSerieCtps: this.pessoa.numSerieCtps,
      ufCtps: this.pessoa.ufCtps,
      dataEmissaoCtps: dataEmissaoCtps,
      descricaoReservista: this.pessoa.descricaoReservista,
      numRaReservista: this.pessoa.numRaReservista,
      categoriaReservista: this.pessoa.categoriaReservista,
      dataEmissaoReservista: dataEmissaoReservista,
      servicoId: servicoId,
      discriminacao: discriminacao,
      tokenHomologacaoNfse: tokenHomologacaoNfse,
      tokenProducaoNfse: tokenProducaoNfse,
      rpsHomologacaoNfse: rpsHomologacaoNfse,
      rpsProducaoNfse: rpsProducaoNfse,
      codigoTributacaoMunicipio: codigoTributacaoMunicipio,
      emiteProducao: emiteProducao
    });

    this.pessoaForm.controls['tipoId'].setValue(tipoId);
    this.pessoaForm.controls['tipoId'].disable();

    if (tipoId == 3) {
      this.pessoa.tipoId = 3;
      this.pessoaForm.controls['tipoPessoaId'].disable();
      this.pessoa.tipoPessoaId = 2;
      this.pessoaForm.controls['tipoPessoaId'].setValue(2);
      this.carregaEmpresa = true;
    }

    this.carregaEndereco = true;
    this.carregaContato = true;
  }

  preencher() {
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.remover();
      }
      else {
        self.cancelar();
      }
    });
  }

  ConsultaCnpj(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj != "") {
      this.pessoaService.BuscarDadosCnpj(cnpj)
        .subscribe(
          result => {
            this.popularForm(result);
          },
          error => {
            this.onError(error)
          })
    }
  }

  popularForm(dados) {

    this.pessoaForm.patchValue({
      nome: dados.nome,
      fantasia: dados.fantasia,
      dataAbertura: this.utilService.ToDate(dados.abertura)
    });

    this.endereco.cep = dados.cep;
    this.endereco.numero = dados.numero;
    this.endereco.complemento = dados.complemento;

    this.ConsultaCEP(dados.cep);

  }

  ConsultaCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get("//cepapi.delivoro.com.br/" + cep)
          .map(dados => dados)
          .subscribe(dados => this.popularFormEndereco(dados));
      }
    }
  }

  popularFormEndereco(dados) {

    this.endereco.bairro = dados.bairro;
    this.endereco.logradouro = dados.logradouro;
    this.endereco.tipoLogradouroId = dados.tipoLogradouroId;
    this.endereco.localidadeId = dados.localidadeId;

    this.pessoaComponent.Pessoa.endereco.push(this.endereco);

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    if (this.pessoaForm.controls['tipoId'].value == 1) {
      this.router.navigate(['cliente/lista']);
    }
    if (this.pessoaForm.controls['tipoId'].value == 2) {
      this.router.navigate(['fornecedor/lista']);
    }
    if (this.pessoaForm.controls['tipoId'].value == 3) {
      this.router.navigate(['empresa/lista']);
    }
  }

  remover() {
    this.pessoaService.RemoverPessoa(this.pessoa)
      .subscribe(
        () => {
          if (this.pessoaForm.controls['tipoId'].value == 1) {
            this.pessoaService.RemoverCliente(this.cliente)
              .subscribe(
                () => {
                    this.swal.showSwalSuccess('Cliente Removido com Sucesso!');
                    this.router.navigate(['cliente/lista']);
                },
                error => {
                  this.onError(error)
                });
          }
          if (this.pessoaForm.controls['tipoId'].value == 2) {

            this.pessoaService.RemoverFornecedor(this.fornecedor)
              .subscribe(
                () => {
                    this.swal.showSwalSuccess('Fornecedor Removida com Sucesso!');
                    this.router.navigate(['fornecedor/lista']);
                },
                error => {
                  this.onError(error)
                });
          }
          if (this.pessoaForm.controls['tipoId'].value == 3) {
            this.pessoaService.RemoverEmpresa(this.empresa)
              .subscribe(
                () => {
                    this.swal.showSwalSuccess('Empresa Removida com Sucesso!');
                    this.router.navigate(['empresa/lista']);
                },
                error => {
                  this.onError(error)
                });
          }
        },
        error => {
          this.onError(error)
        });
  }
}

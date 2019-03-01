import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { PessoaService } from '../pessoa.service';
import {
  Pessoa, Fornecedor, Endereco, PessoaContato, TipoPessoa, Sexo, Localidade, Uf,
  EstadoCivil, Profissao, Religiao, Cor, Cnpj, Cliente, Servico
} from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { Banco } from '../../banco/models/banco';

@Component({
  selector: 'app-editar-pessoa',
  templateUrl: './editar-pessoa.component.html',
  styleUrls: []
})
export class EditarPessoaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  public IdPessoa;
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
  public bancos : Banco[];

  carregaEndereco: boolean = false;
  carregaContato: boolean = false;
  carregaEmpresa: boolean = false;
  carregaClienteSindicato: boolean = false;
  carregaFornacedorContaCorrente: boolean = false;
  carregaClienteContaCorrente: boolean = false;

  public errors: any[] = [];

  public reativarVisivel: boolean;
  public removerVisivel: boolean;

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
      codigo: {
        required: 'Código requerido!',
        minlength: 'O Código deve ter no mínimo 2 caracteres!',
        maxlength: 'O Código deve ter no máximo 20 caracteres!'
      },
      nome:{
        required: 'Nome requerido!',
        minlength: 'O Nome deve ter no mínimo 3 caracteres!',
        maxlength: 'O Nome deve ter no máximo 120 caracteres!'
      },
      rg:{
        required: 'O Rg deve ter no máximo 20 caracteres!'
      },
      dataNascimento:{
        required: 'Data de Nascimento requerida!'
      },
      estadoCivilId:{
        required: 'Estado Civil requerido!'
      },
      fantasia:{
        maxlength: 'O Nome Fantasia deve ter no máximo 120 caracteres!'
      },
      inscricaoEstadual:{
        maxlength: 'A Inscrição Estadual deve ter no máximo 20 caracteres!'
      },
      inscricaoMunicipal:{
        maxlength: 'A Inscrição Municipal deve ter no máximo 20 caracteres!'
      },
      orgEmissaoRg:{
        maxlength: 'O Nome do Orgão Emissor do Rg deve ter no máximo 20 caracteres!'
      },
      rge:{
        maxlength: 'O Rge deve ter no máximo 20 caracteres!'
      },
      empresaTrabalha:{
        maxlength: 'O Nome da Empresa deve ter no máximo 20 caracteres!'
      },
      site: {                
          maxlength: 'O Site deve ter no máximo 100 caracteres!'
      },
      tituloEleitoral:{
        maxlength: 'O Título Eleitoral deve ter no máximo 20 caracteres!'
      },
      sessaoEleitoral:{
        maxlength: 'A Sessão Eleitoral deve ter no máximo 10 caracteres!'
      },
      zonaEleitoral:{
        maxlength: 'A Zona Eleitoral deve ter no máximo 10 caracteres!'
      },
      nomeMae:{
        maxlength: 'O Nome da Mãe deve ter no máximo 120 caracteres!'
      },
      nomePai:{
        maxlength: 'O Nome do Pai deve ter no máximo 120 caracteres!'
      },
      descricaoDeficiencia:{
        maxlength: 'A Descrição da Deficiência deve ter no máximo 60 caracteres!'
      },
      descricaoCtps:{
        maxlength: 'A Descrição Ctps deve ter no máximo 60 caracteres!'
      },
      numSerieCtps:{
        maxlength: 'O Número de Serie Ctps deve ter no máximo 18 caracteres!'
      },
      ufCtps:{
        maxlength: 'O Uf da Ctps deve ter no máximo 10 caracteres!'
      },
      descricaoReservista:{
        maxlength: 'A Descrição da Reservista deve ter no máximo 60 caracteres!'
      },
      numRaReservista:{
        maxlength: 'O Número Ra da Reservista deve ter no máximo 18 caracteres!'
      },
      categoriaReservista:{
        maxlength: 'A Categoria da reservista deve ter no máximo 10 caracteres!'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.pessoa = new Pessoa();
    this.endereco = new Endereco();
    this.fornecedor = new Fornecedor();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.pessoaComponent.dirty = false;
    this.pessoaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      grupoEmpresaId: null,
      empresaId: null,
      tipoPessoaId: null,
      tipoId: null,
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      sexoId: null,
      cpf: [''],
      rg: [''],
      dataNascimento: [''],
      localidadeId: null,
      ufNascimentoId: null,
      estadoCivilId: [null],
      dataCasamento: '',
      profissaoId: null,
      religiaoId: null,
      corRacaId: null,
      cnpj: [''],
      fantasia: ['', [Validators.maxLength(120)]],
      inscricaoEstadual: ['', [Validators.maxLength(20)]],
      inscricaoMunicipal: ['', [Validators.maxLength(20)]],
      orgEmissaoRg: ['', Validators.maxLength(20)],
      dataEmissaoRg: '',
      rge: ['', [Validators.maxLength(20)]],
      dataAbertura: '',
      dataFalecimento: '',
      dataEncerramento: '',
      empresaTrabalha: ['', Validators.maxLength(20)],
      site: ['', [Validators.maxLength(100)]],
      tituloEleitoral: ['', [Validators.maxLength(20)]],
      sessaoEleitoral: ['', [Validators.maxLength(10)]],
      zonaEleitoral: ['', [Validators.maxLength(10)]],
      dataEmissaoTitulo: '',
      nomeMae: ['', [Validators.maxLength(120)]],
      nomePai: ['', [Validators.maxLength(120)]],
      descricaoDeficiencia: ['', Validators.maxLength(60)],
      descricaoCtps: ['', [Validators.maxLength(60)]],
      numSerieCtps: [0, Validators.maxLength(18)],
      ufCtps: ['', Validators.maxLength(10)],
      dataEmissaoCtps: '',
      descricaoReservista: ['', Validators.maxLength(60)],
      numRaReservista: [0, Validators.maxLength(18)],
      categoriaReservista: ['', Validators.maxLength(10)],
      dataEmissaoReservista: '',
      servicoId: null,
      discriminacao: [''],
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
        () => this.errors);

    // this.pessoaService.obterTodosEmpresa()
    //   .subscribe(empresas => {
    //     this.empresas = empresas
    //   },
    //     () => this.errors);

    this.pessoaService.obterTodosTipoPessoa()
      .subscribe(tipoPessoa => {
        this.tipoPessoa = tipoPessoa

      },
        () => this.errors);

    this.pessoaService.obterTodosSexo()
      .subscribe(sexo => {
        this.sexo = sexo

      },
        () => this.errors);

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
        () => this.errors);

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

    this.pessoaService.obterTodosBanco().subscribe(
      result => {
          this.bancos = result;
      });

      this.pessoaService.obterTodosServico()
      .subscribe(servicos => {
        this.servicos = servicos
      },
        () => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.pessoaId = params['id'];
        this.obterPessoa(this.pessoaId);
      });
    
  }

  obterPessoa(id: string) {
    this.pessoaService.obterPessoa(id)
      .subscribe(
        pessoa => {
          this.consultarPessoaFornecedor(pessoa);

        },
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  consultarPessoaFornecedor(pessoa: Pessoa): void {

    if (this.cliente == null) {
      
      this.pessoaService.obterClientePorId(this.pessoaId)
        .subscribe(cliente => { this.cliente = cliente;
          
          if (this.cliente != null) {

                this.empId = this.cliente.empresaId;
                this.gEmpId = this.cliente.grupoEmpresaId;

                if(this.cliente.clienteContaCorrente != null){

                      for(let i = 0; i < this.cliente.clienteContaCorrente.length; i++){

                          if(this.cliente.clienteContaCorrente[i].contaCorrente != null){

                              for(let y = 0; y < this.bancos.length; y++){

                                    if(this.cliente.clienteContaCorrente[i].contaCorrente.bancoId == this.bancos[y].id){

                                          this.cliente.clienteContaCorrente[i].contaCorrente.banco = this.bancos[y];
                                          break;      
                                    }

                              }

                          }
                      } 
                }

                this.preencherFormPessoa(pessoa, 1, this.cliente);

          } else {
            this.pessoaService.obterFornecedorPorId(this.pessoaId)
              .subscribe(fornecedor => { this.fornecedor = fornecedor;

                if(this.fornecedor != null){

                      if(this.fornecedor.fornecedorContaCorrente != null){
                        
                            for(let i = 0; i < this.fornecedor.fornecedorContaCorrente.length; i++){

                                  if(this.fornecedor.fornecedorContaCorrente[i].contaCorrente != null){

                                        for(let y = 0; y < this.bancos.length; y++){

                                              if(this.fornecedor.fornecedorContaCorrente[i].contaCorrente.bancoId == this.bancos[y].id){

                                                  this.fornecedor.fornecedorContaCorrente[i].contaCorrente.banco = this.bancos[y];
                                                  break;
                                              }
                                        }

                                  }

                            }   

                      }

                      this.empId = this.fornecedor.empresaId;
                      this.gEmpId = this.fornecedor.grupoEmpresaId;
                      this.preencherFormPessoa(pessoa, 2, this.fornecedor);
                }else{

                      this.pessoaService.obterEmpresaPorPessoaId(this.pessoaId)
                      .subscribe(empresa => { this.empresa = empresa;
                          
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
  }

  preencherFormPessoa(pessoa: Pessoa, tipoId: number, tipoPessoa?: any): void {

    this.pessoa = new Pessoa();
    this.fornecedor = new Fornecedor();
    this.cliente = new Cliente();

    this.pessoaForm.controls['codigo'].disable();

    // if (typeof tipoPessoa in Fornecedor)
    //   this.pessoaComponent.fornecedor = tipoPessoa;

    // if (typeof tipoPessoa in Cliente)
    //   this.pessoaComponent.cliente = tipoPessoa;

    if(tipoId == 1)
    this.pessoaComponent.cliente = tipoPessoa;

    if(tipoId == 2)
    this.pessoaComponent.fornecedor = tipoPessoa;

    this.pessoaComponent.Pessoa = pessoa;
    this.pessoa = pessoa;

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

    this.reativarVisivel = this.pessoa.excluido === 'S';
    this.removerVisivel = this.pessoa.excluido === 'N';
    this.IdPessoa = tipoId;
    this.carregaEndereco = true;
    this.carregaContato = true;
    this.carregaClienteSindicato = true;
    this.carregaFornacedorContaCorrente = true;
    this.carregaClienteContaCorrente = true;
    this.pessoaComponent.dirty = false;

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.pessoaForm);
    });

  }

  ConsultaCnpj(cnpj) {
    //console.log("Entrou: " + cnpj);
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

  editarPessoa() {
    //if (this.pessoaForm.dirty /*&& this.pessoaForm.valid*/) {
    if (this.pessoaForm.dirty || this.pessoaComponent.dirty) {

      let p = Object.assign({}, this.pessoa, this.pessoaForm.value);

      let emp = p.empresaId;
      let gEmp = p.grupoEmpresaId;
      let tipo = this.pessoaForm.controls['tipoId'].value;
      this.IdPessoa = tipo;
      p.empresaId = null;
      p.grupoEmpresaId = null;
      p.endereco = null;
      p.pessoaContato = null;
      p.pessoaCnae = null;
      p.empresaContaCorrente = null;
      p.pessoaRegimeTributario = null;

      this.pessoaService.AtualizarPessoa(p)
        .subscribe(
          result => {
            this.pessoa = result;
            
            // ####################################################################################################################
            if (tipo == 1) {

              if(this.cliente != null){

                  if(this.cliente.id > 0 ){

                        this.cliente.empresaId = emp;
                        this.cliente.grupoEmpresaId = gEmp;
                        this.cliente.pessoaId = this.pessoa.id;

                        this.pessoaService.AtualizarCliente(this.cliente)
                          .subscribe(result => { this.cliente = result;

                          this.pessoaComponent = null;

                          this.swal.showSwalSuccess('Cliente Atualizada com Sucesso!');
                          this.router.navigate(['cliente/lista']);

                          },
                          error => {
                            this.onError(error)
                          });
                  }
                  else{
                    this.swal.showSwalSuccess('Cliente Atualizada com Sucesso!');
                    this.router.navigate(['cliente/lista']);
                  }

              }
              else{
                this.swal.showSwalSuccess('Cliente Atualizada com Sucesso!');
                this.router.navigate(['cliente/lista']);
              }
              
            }

            // ####################################################################################################################
            else if (tipo == 2) {

                if(this.fornecedor != null){

                      if(this.fornecedor.id > 0){

                              this.fornecedor.empresaId = emp;
                              this.fornecedor.grupoEmpresaId = gEmp;
                              this.fornecedor.pessoaId = this.pessoa.id;
                
                              this.pessoaService.AtualizarFornecedor(this.fornecedor)
                                .subscribe(
                                  result => { this.fornecedor = result;

                                    this.pessoaComponent = null;
                
                                    this.swal.showSwalSuccess('Fornecedor Atualizado com Sucesso!');
                                    this.router.navigate(['fornecedor/lista']);
                
                                  },
                                  error => {
                                    this.onError(error)
                                  });

                      }
                      else{
                        this.swal.showSwalSuccess('Fornecedor Atualizado com Sucesso!');
                        this.router.navigate(['fornecedor/lista']);
                      }

                }
                else{
                  this.swal.showSwalSuccess('Fornecedor Atualizado com Sucesso!');
                  this.router.navigate(['fornecedor/lista']);
                }
              
            }

            // ####################################################################################################################
            else if (tipo == 3) {

                if(this.empresa != null){

                      if(this.empresa.id > 0){

                              this.empresa.grupoEmpresaId = gEmp;
                              this.empresa.pessoaId = this.pessoa.id;
                              this.empresa.servicoId = p.servicoId;
                              this.empresa.discriminacao = p.discriminacao;
                              this.empresa.tokenHomologacaoNfse = p.tokenHomologacaoNfse;
                              this.empresa.tokenProducaoNfse = p.tokenProducaoNfse;
                              this.empresa.rpsHomologacaoNfse = p.rpsHomologacaoNfse;
                              this.empresa.rpsProducaoNfse = p.rpsProducaoNfse;
                              this.empresa.codigoTributacaoMunicipio = p.codigoTributacaoMunicipio;
                              this.empresa.emiteProducao = p.emiteProducao;
                              if (this.empresa.servicoId == 0) {
                                this.empresa.servicoId = null;
                              }
          
                              this.pessoaService.AtualizarEmpresa(this.empresa)
                                .subscribe( result => { this.empresa = result;
                                    this.pessoaComponent = null;
                
                                    this.swal.showSwalSuccess('Empresa Atualizada com Sucesso!');
                                    this.router.navigate(['empresa/lista']);
                
                                  },
                                  error => {
                                    this.onError(error)
                                  });
                        
                      }
                      else{
                        this.swal.showSwalSuccess('Empresa Atualizada com Sucesso!');
                        this.router.navigate(['empresa/lista']);
                      }

                }
                else{
                  this.swal.showSwalSuccess('Empresa Atualizada com Sucesso!');
                  this.router.navigate(['empresa/lista']);
                }

            }

          },
          error => {
            this.onError(error)
          });

    } else {
      this.cancelar();
    }
  }

  popularForm(dados) {
    //console.log("Entrou popularForm: ");
    //console.log(dados);
    //console.log(dados.abertura);
    this.pessoaForm.patchValue({
      nome: dados.nome,
      fantasia: dados.fantasia//,

      // dataAbertura: this.utilService.ToDate(dados.abertura)
    });

    //let endereco: Endereco;

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
        this.httpClient.get("cepapi.delivoro.com.br/" + cep)
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
    //console.log(this.pessoaComponent.Pessoa.endereco);

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    if (this.pessoaForm.controls['tipoId'].value == 1) {
      this.router.navigate(['cliente/lista']);
    };
    if (this.pessoaForm.controls['tipoId'].value == 2) {
      this.router.navigate(['fornecedor/lista']);
    };
    if (this.pessoaForm.controls['tipoId'].value == 3) {
      this.router.navigate(['empresa/lista']);
    };
  }
  remover(id) {
    this.router.navigate(['pessoa/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['pessoa/reativar/' + id]);
  }
  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.pessoaService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }
}

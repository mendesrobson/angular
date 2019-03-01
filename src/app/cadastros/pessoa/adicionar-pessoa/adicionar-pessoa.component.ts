import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { PessoaService } from '../pessoa.service';
import { Pessoa, Fornecedor, Cliente, Endereco, PessoaContato, TipoPessoa, Sexo, Localidade, Uf, EstadoCivil, Profissao, Religiao, Cor, Cnpj, Servico } from '../models/pessoa';
import { PessoaComponent } from '../pessoa.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { SindicatoConvencao } from '../../cliente/models/cliente';
import { Mascara } from '../../../cadastros/mascara/models/mascara';

@Component({
    selector: 'app-adicionar-pessoa',
    templateUrl: './adicionar-pessoa.component.html',
    styleUrls: []
})
export class AdicionarPessoaComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @ViewChild('focusCodigo') focusCodigo: ElementRef;

    public maskValid: boolean;
    public mascSequencial: Mascara;

    public grupoEmpresaId: number;

    public pessoa: Pessoa;
    public endereco: Endereco;
    public pessoaContato: PessoaContato;
    public pessoaForm: FormGroup;

    public fornecedor: Fornecedor;
    public cliente: Cliente;
    public empresa: Empresa;

    swal: SweetAlertAdviceService;
    displayMessage: { [key: string]: string } = {};
    cpfMask = this._maskService.Cpf();
    cnpjMask = this._maskService.Cnpj();

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

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
    public sindicatoConvencao: SindicatoConvencao[];

    public errors: any[] = [];
    public codMask = [];

    constructor(
        private pessoaService: PessoaService,
        private fb: FormBuilder,
        private httpClient: HttpClient,
        private utilService: UtilService,
        private _maskService: MaskService,
        private router: Router,
        private pessoaComponent: PessoaComponent,
        private renderer: Renderer) {

        this.validationMessages = {
            codigo: {
                required: 'Código requerido!',
                minlength: 'O Código deve ter no mínimo 2 caracteres!',
                maxlength: 'O Código deve ter no máximo 20 caracteres!'
            },
            nome: {
                required: 'Nome requerido!',
                minlength: 'O Nome deve ter no mínimo 3 caracteres!',
                maxlength: 'O Nome deve ter no máximo 120 caracteres!'
            },
            rg: {
                required: 'O Rg deve ter no máximo 20 caracteres!'
            },
            dataNascimento: {
                required: 'Data de Nascimento requerida!'
            },
            estadoCivilId: {
                required: 'Estado Civil requerido!'
            },
            fantasia: {
                maxlength: 'O Nome Fantasia deve ter no máximo 120 caracteres!'
            },
            inscricaoEstadual: {
                maxlength: 'A Inscrição Estadual deve ter no máximo 20 caracteres!'
            },
            inscricaoMunicipal: {
                maxlength: 'A Inscrição Municipal deve ter no máximo 20 caracteres!'
            },
            orgEmissaoRg: {
                maxlength: 'O Nome do Orgão Emissor do Rg deve ter no máximo 20 caracteres!'
            },
            rge: {
                maxlength: 'O Rge deve ter no máximo 20 caracteres!'
            },
            empresaTrabalha: {
                maxlength: 'O Nome da Empresa deve ter no máximo 20 caracteres!'
            },
            site: {
                maxlength: 'O Site deve ter no máximo 100 caracteres!'
            },
            tituloEleitoral: {
                maxlength: 'O Título Eleitoral deve ter no máximo 20 caracteres!'
            },
            sessaoEleitoral: {
                maxlength: 'A Sessão Eleitoral deve ter no máximo 10 caracteres!'
            },
            zonaEleitoral: {
                maxlength: 'A Zona Eleitoral deve ter no máximo 10 caracteres!'
            },
            nomeMae: {
                maxlength: 'O Nome da Mãe deve ter no máximo 120 caracteres!'
            },
            nomePai: {
                maxlength: 'O Nome do Pai deve ter no máximo 120 caracteres!'
            },
            descricaoDeficiencia: {
                maxlength: 'A Descrição da Deficiência deve ter no máximo 60 caracteres!'
            },
            descricaoCtps: {
                maxlength: 'A Descrição Ctps deve ter no máximo 60 caracteres!'
            },
            numSerieCtps: {
                maxlength: 'O Número de Serie Ctps deve ter no máximo 18 caracteres!'
            },
            ufCtps: {
                maxlength: 'O Uf da Ctps deve ter no máximo 10 caracteres!'
            },
            descricaoReservista: {
                maxlength: 'A Descrição da Reservista deve ter no máximo 60 caracteres!'
            },
            numRaReservista: {
                maxlength: 'O Número Ra da Reservista deve ter no máximo 18 caracteres!'
            },
            categoriaReservista: {
                maxlength: 'A Categoria da reservista deve ter no máximo 10 caracteres!'
            }
        };

        this.maskValid = true;
        this.mascSequencial = new Mascara();
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.pessoa = new Pessoa();
        this.endereco = new Endereco();
        this.pessoaContato = new PessoaContato();
        this.fornecedor = new Fornecedor();
        this.cliente = new Cliente();
        this.empresa = new Empresa();
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
        //     .subscribe(empresas => {
        //         this.empresas = empresas
        //     },
        //         () => this.errors);

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

        this.pessoaService.obterTodosServico()
            .subscribe(servicos => {
                this.servicos = servicos
            },
                () => this.errors);
        this.pessoaService.obterTodosSindicatoConvencao()
            .subscribe(sind => {
                this.sindicatoConvencao = sind;
            });

    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.pessoaForm);
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
                    error => { console.log(error); });
        }
    }

    ConsultaCnae(cnae) {
        if (cnae != null) {
            this.pessoaService.BuscarDadosCnae(cnae)
                .subscribe(
                    result => {
                        this.popularFormCnae(result);
                    },
                    error => { console.log(error); });
        }

    }

    async adicionarPessoa(): Promise<void> {
        if (this.pessoaForm.dirty /*&& this.pessoaForm.valid*/) {

            let p = Object.assign({}, this.pessoa, this.pessoaForm.value);

            let emp = p.empresaId;
            let gEmp = p.grupoEmpresaId;
            p.empresaId = null;
            p.grupoEmpresaId = null;
            p.endereco = this.pessoaComponent.Pessoa.endereco;
            p.pessoaContato = this.pessoaComponent.Pessoa.pessoaContato;
            p.pessoaCnae = this.pessoaComponent.Pessoa.pessoaCnae;
            p.empresaContaCorrente = this.pessoaComponent.Pessoa.empresaContaCorrente;
            p.pessoaRegimeTributario = this.pessoaComponent.Pessoa.pessoaRegimeTributario;

            this.pessoa = p;

            if(this.mascSequencial == null){
                this.mascSequencial = new Mascara();
                this.mascSequencial.sequencial = 'N';
            }
            
            if(this.mascSequencial.sequencial === "S")
            {
                //#region Adiciona a Pessoa 

                this.pessoaService.AdicionarPessoa(p)
                .subscribe(
                    result => {

                        this.pessoa = result;

                        if (p.tipoId == 1) {

                            this.cliente.id = 0;
                            this.cliente.empresaId = emp;
                            this.cliente.grupoEmpresaId = gEmp;
                            this.cliente.pessoaId = this.pessoa.id;

                            if (this.pessoaComponent.Cliente.clienteSindicato != null)
                                this.pessoaComponent.Cliente.clienteSindicato.forEach(e => {
                                    this.sindicatoConvencao.forEach(sc => {
                                        if (sc.convencaoId == e.sindicatoConvencao.convencaoId) {
                                            e.sindicatoConvencaoId = sc.id;
                                        }
                                    });
                                    e.sindicatoConvencao = null;
                                });

                            this.cliente.clienteSindicato = this.pessoaComponent.Cliente.clienteSindicato;
                            this.cliente.clienteContaCorrente = this.pessoaComponent.cliente.clienteContaCorrente;

                            this.pessoaService.AdicionarCliente(this.cliente)
                                .subscribe(
                                    result => {

                                        this.cliente = result;
                                        this.pessoaComponent = null;

                                        this.swal.showSwalSuccess('Cliente, Adicionado com Sucesso!');
                                        this.router.navigate(['cliente/lista']);

                                    },
                                    error => { console.log(error); });
                        }
                        if (p.tipoId == 2) {

                            this.fornecedor.id = 0;
                            this.fornecedor.empresaId = emp;
                            this.fornecedor.grupoEmpresaId = gEmp;
                            this.fornecedor.pessoaId = this.pessoa.id;
                            this.fornecedor.pessoa = null;

                            // if (this.pessoaComponent.Fornecedor.fornecedorContaCorrente != null)
                            //     this.pessoaComponent.Fornecedor.fornecedorContaCorrente.forEach(element => {
                            //         element.banco = null;
                            //     });

                            this.fornecedor.fornecedorContaCorrente = this.pessoaComponent.Fornecedor.fornecedorContaCorrente;

                            this.pessoaService.AdicionarFornecedor(this.fornecedor)
                                .subscribe(
                                    result => {

                                        this.fornecedor = result;
                                        this.pessoaComponent = null;

                                        this.swal.showSwalSuccess('Fornecedor Adicionado com Sucesso!');
                                        this.router.navigate(['fornecedor/lista']);

                                    },
                                    error => { console.log(error); });
                        }
                        if (p.tipoId == 3) {
                            this.empresa.id = 0;
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

                            this.pessoaService.AdicionarEmpresa(this.empresa)
                                .subscribe(
                                    result => {

                                        this.empresa = result;
                                        this.pessoaComponent = null;

                                        this.swal.showSwalSuccess('Empresa Adicionado com Sucesso!');
                                        this.router.navigate(['empresa/lista']);

                                    },
                                    error => { console.log(error); });
                        }
                    },
                    error => { console.log(error); });

                //#endregion
            }
            else
            {
                let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
                let pessoa = await this.pessoaService.ObterPessoaPorCodigo(codigo).toPromise();
                
                if(pessoa != null)
                {
                    var self = this;
                    this.swal.showSwalErrorCodigo('Informe um código que não esteja cadastrado!', function (isConfirmed) {
                    if (isConfirmed) 
                        self.limparCampoCodigo();
                    
                    });
                }
                else
                {
                    //#region Adiciona a Pessoa 

                this.pessoaService.AdicionarPessoa(p)
                .subscribe(
                    result => {

                        this.pessoa = result;

                        if (p.tipoId == 1) {

                            this.cliente.id = 0;
                            this.cliente.empresaId = emp;
                            this.cliente.grupoEmpresaId = gEmp;
                            this.cliente.pessoaId = this.pessoa.id;

                            if (this.pessoaComponent.Cliente.clienteSindicato != null)
                                this.pessoaComponent.Cliente.clienteSindicato.forEach(e => {
                                    this.sindicatoConvencao.forEach(sc => {
                                        if (sc.convencaoId == e.sindicatoConvencao.convencaoId) {
                                            e.sindicatoConvencaoId = sc.id;
                                        }
                                    });
                                    e.sindicatoConvencao = null;
                                });

                            this.cliente.clienteSindicato = this.pessoaComponent.Cliente.clienteSindicato;
                            this.cliente.clienteContaCorrente = this.pessoaComponent.cliente.clienteContaCorrente;

                            this.pessoaService.AdicionarCliente(this.cliente)
                                .subscribe(
                                    result => {

                                        this.cliente = result;
                                        this.pessoaComponent = null;

                                        this.swal.showSwalSuccess('Cliente, Adicionado com Sucesso!');
                                        this.router.navigate(['cliente/lista']);

                                    },
                                    error => { console.log(error); });
                        }
                        if (p.tipoId == 2) {

                            this.fornecedor.id = 0;
                            this.fornecedor.empresaId = emp;
                            this.fornecedor.grupoEmpresaId = gEmp;
                            this.fornecedor.pessoaId = this.pessoa.id;
                            this.fornecedor.pessoa = null;

                            // if (this.pessoaComponent.Fornecedor.fornecedorContaCorrente != null)
                            //     this.pessoaComponent.Fornecedor.fornecedorContaCorrente.forEach(element => {
                            //         element.banco = null;
                            //     });

                            this.fornecedor.fornecedorContaCorrente = this.pessoaComponent.Fornecedor.fornecedorContaCorrente;

                            this.pessoaService.AdicionarFornecedor(this.fornecedor)
                                .subscribe(
                                    result => {

                                        this.fornecedor = result;
                                        this.pessoaComponent = null;

                                        this.swal.showSwalSuccess('Fornecedor Adicionado com Sucesso!');
                                        this.router.navigate(['fornecedor/lista']);

                                    },
                                    error => { console.log(error); });
                        }
                        if (p.tipoId == 3) {
                            this.empresa.id = 0;
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

                            this.pessoaService.AdicionarEmpresa(this.empresa)
                                .subscribe(
                                    result => {

                                        this.empresa = result;
                                        this.pessoaComponent = null;

                                        this.swal.showSwalSuccess('Empresa Adicionado com Sucesso!');
                                        this.router.navigate(['empresa/lista']);

                                    },
                                    error => { console.log(error); });
                        }
                    },
                    error => { console.log(error); });

                //#endregion
                }
            }
            
        }
    }

    carregarFormEmpresa(event) {
        if (event == 3) {
            this.pessoa.tipoId = event;
            this.pessoaForm.controls['tipoPessoaId'].disable();
            this.pessoa.tipoPessoaId = 2;
            this.pessoaForm.controls['tipoPessoaId'].setValue(2);

        } else {
            this.pessoa.tipoId = event;
            this.pessoaForm.controls['tipoPessoaId'].enable();
        }
    }


    populaEmpresa() {
        this.pessoaForm = this.fb.group({
            codigo: [this.pessoaForm.controls['codigo'].value, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            grupoEmpresaId: this.pessoaForm.controls['grupoEmpresaId'].value,
            empresaId: '',
            tipoId: [this.pessoaForm.controls['tipoId'].value, [Validators.required]],
            tipoPessoaId: this.pessoaForm.controls['tipoPessoaId'].value,
            nome: this.pessoaForm.controls['nome'].value,
            sexoId: this.pessoaForm.controls['sexoId'].value,
            cpf: this.pessoaForm.controls['cpf'].value,
            rg: this.pessoaForm.controls['rg'].value,
            dataNascimento: this.pessoaForm.controls['dataNascimento'].value,
            localidadeId: this.pessoaForm.controls['localidadeId'].value,
            ufNascimentoId: this.pessoaForm.controls['ufNascimentoId'].value,
            estadoCivilId: this.pessoaForm.controls['estadoCivilId'].value,
            dataCasamento: this.pessoaForm.controls['dataCasamento'].value,
            profissaoId: this.pessoaForm.controls['profissaoId'].value,
            religiaoId: this.pessoaForm.controls['religiaoId'].value,
            corRacaId: this.pessoaForm.controls['corRacaId'].value,
            cnpj: this.pessoaForm.controls['cnpj'].value,
            fantasia: this.pessoaForm.controls['fantasia'].value,
            inscricaoEstadual: this.pessoaForm.controls['inscricaoEstadual'].value,
            inscricaoMunicipal: this.pessoaForm.controls['inscricaoMunicipal'].value,
            orgEmissaoRg: this.pessoaForm.controls['orgEmissaoRg'].value,
            dataEmissaoRg: this.pessoaForm.controls['dataEmissaoRg'].value,
            rge: this.pessoaForm.controls['rge'].value,
            dataAbertura: this.pessoaForm.controls['dataAbertura'].value,
            dataFalecimento: this.pessoaForm.controls['dataFalecimento'].value,
            dataEncerramento: this.pessoaForm.controls['dataEncerramento'].value,
            empresaTrabalha: this.pessoaForm.controls['empresaTrabalha'].value,
            site: this.pessoaForm.controls['site'].value,
            tituloEleitoral: this.pessoaForm.controls['tituloEleitoral'].value,
            sessaoEleitoral: this.pessoaForm.controls['sessaoEleitoral'].value,
            zonaEleitoral: this.pessoaForm.controls['zonaEleitoral'].value,
            dataEmissaoTitulo: this.pessoaForm.controls['dataEmissaoTitulo'].value,
            nomeMae: this.pessoaForm.controls['nomeMae'].value,
            nomePai: this.pessoaForm.controls['nomePai'].value,
            descricaoDeficiencia: this.pessoaForm.controls['descricaoDeficiencia'].value,
            descricaoCtps: this.pessoaForm.controls['descricaoCtps'].value,
            numSerieCtps: this.pessoaForm.controls['numSerieCtps'].value,
            ufCtps: this.pessoaForm.controls['ufCtps'].value,
            dataEmissaoCtps: this.pessoaForm.controls['dataEmissaoCtps'].value,
            descricaoReservista: this.pessoaForm.controls['descricaoReservista'].value,
            numRaReservista: this.pessoaForm.controls['numRaReservista'].value,
            categoriaReservista: this.pessoaForm.controls['categoriaReservista'].value,
            dataEmissaoReservista: this.pessoaForm.controls['dataEmissaoReservista'].value,
            servicoId: this.pessoaForm.controls['servicoId'].value,
            discriminacao: this.pessoaForm.controls['discriminacao'].value,
            tokenHomologacaoNfse: this.pessoaForm.controls['tokenHomologacaoNfse'].value,
            tokenProducaoNfse: this.pessoaForm.controls['tokenProducaoNfse'].value,
            rpsHomologacaoNfse: this.pessoaForm.controls['rpsHomologacaoNfse'].value,
            rpsProducaoNfse: this.pessoaForm.controls['rpsProducaoNfse'].value,
            codigoTributacaoMunicipio: this.pessoaForm.controls['codigoTributacaoMunicipio'].value,
            emiteProducao: this.pessoaForm.controls['emiteProducao'].value
        });
    }

    populaCliente() {
        this.pessoaForm = this.fb.group({
            codigo: [this.pessoaForm.controls['codigo'].value, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            grupoEmpresaId: [this.pessoaForm.controls['grupoEmpresaId'].value, [Validators.required]],
            empresaId: [this.pessoaForm.controls['empresaId'].value, [Validators.required]],
            tipoId: [this.pessoaForm.controls['tipoId'].value, [Validators.required]],
            tipoPessoaId: this.pessoaForm.controls['tipoPessoaId'].value,
            nome: this.pessoaForm.controls['nome'].value,
            sexoId: this.pessoaForm.controls['sexoId'].value,
            cpf: this.pessoaForm.controls['cpf'].value,
            rg: this.pessoaForm.controls['rg'].value,
            dataNascimento: this.pessoaForm.controls['dataNascimento'].value,
            localidadeId: this.pessoaForm.controls['localidadeId'].value,
            ufNascimentoId: this.pessoaForm.controls['ufNascimentoId'].value,
            estadoCivilId: this.pessoaForm.controls['estadoCivilId'].value,
            dataCasamento: this.pessoaForm.controls['dataCasamento'].value,
            profissaoId: this.pessoaForm.controls['profissaoId'].value,
            religiaoId: this.pessoaForm.controls['religiaoId'].value,
            corRacaId: this.pessoaForm.controls['corRacaId'].value,
            cnpj: this.pessoaForm.controls['cnpj'].value,
            fantasia: this.pessoaForm.controls['fantasia'].value,
            inscricaoEstadual: this.pessoaForm.controls['inscricaoEstadual'].value,
            inscricaoMunicipal: this.pessoaForm.controls['inscricaoMunicipal'].value,
            orgEmissaoRg: this.pessoaForm.controls['orgEmissaoRg'].value,
            dataEmissaoRg: this.pessoaForm.controls['dataEmissaoRg'].value,
            rge: this.pessoaForm.controls['rge'].value,
            dataAbertura: this.pessoaForm.controls['dataAbertura'].value,
            dataFalecimento: this.pessoaForm.controls['dataFalecimento'].value,
            dataEncerramento: this.pessoaForm.controls['dataEncerramento'].value,
            empresaTrabalha: this.pessoaForm.controls['empresaTrabalha'].value,
            site: this.pessoaForm.controls['site'].value,
            tituloEleitoral: this.pessoaForm.controls['tituloEleitoral'].value,
            sessaoEleitoral: this.pessoaForm.controls['sessaoEleitoral'].value,
            zonaEleitoral: this.pessoaForm.controls['zonaEleitoral'].value,
            dataEmissaoTitulo: this.pessoaForm.controls['dataEmissaoTitulo'].value,
            nomeMae: this.pessoaForm.controls['nomeMae'].value,
            nomePai: this.pessoaForm.controls['nomePai'].value,
            descricaoDeficiencia: this.pessoaForm.controls['descricaoDeficiencia'].value,
            descricaoCtps: this.pessoaForm.controls['descricaoCtps'].value,
            numSerieCtps: this.pessoaForm.controls['numSerieCtps'].value,
            ufCtps: this.pessoaForm.controls['ufCtps'].value,
            dataEmissaoCtps: this.pessoaForm.controls['dataEmissaoCtps'].value,
            descricaoReservista: this.pessoaForm.controls['descricaoReservista'].value,
            numRaReservista: this.pessoaForm.controls['numRaReservista'].value,
            categoriaReservista: this.pessoaForm.controls['categoriaReservista'].value,
            dataEmissaoReservista: this.pessoaForm.controls['dataEmissaoReservista'].value
        });
    }

    popularFormCnae(dados) {
        this.pessoaForm.patchValue({
            atividadePrimaria: dados.descricao
        });
    }

    popularForm(dados) {
        console.log("this.pessoaForm1: ");
        console.log(this.pessoaForm.controls['codigo'].value);
        this.pessoaForm.patchValue({
            //codigo: this.pessoaForm.controls['codigo'].value,
            //grupoEmpresaId: this.pessoaForm.controls['grupoEmpresaId'].value,
            //empresaId: this.pessoaForm.controls['empresaId'].value,
            tipoPessoaId: this.pessoaForm.controls['tipoPessoaId'].value,
            tipoId: this.pessoaForm.controls['tipoId'].value,
            nome: dados.nome,
            sexoId: this.pessoaForm.controls['sexoId'].value,
            cpf: this.pessoaForm.controls['cpf'].value,
            rg: this.pessoaForm.controls['rg'].value,
            dataNascimento: this.pessoaForm.controls['dataNascimento'].value,
            localidadeId: this.pessoaForm.controls['localidadeId'].value,
            ufNascimentoId: this.pessoaForm.controls['ufNascimentoId'].value,
            estadoCivilId: this.pessoaForm.controls['estadoCivilId'].value,
            dataCasamento: this.pessoaForm.controls['dataCasamento'].value,
            profissaoId: this.pessoaForm.controls['profissaoId'].value,
            religiaoId: this.pessoaForm.controls['religiaoId'].value,
            corRacaId: this.pessoaForm.controls['corRacaId'].value,
            cnpj: this.pessoaForm.controls['cnpj'].value,
            fantasia: dados.fantasia,
            inscricaoEstadual: this.pessoaForm.controls['inscricaoEstadual'].value,
            inscricaoMunicipal: this.pessoaForm.controls['inscricaoMunicipal'].value,
            orgEmissaoRg: this.pessoaForm.controls['orgEmissaoRg'].value,
            dataEmissaoRg: this.pessoaForm.controls['dataEmissaoRg'].value,
            rge: this.pessoaForm.controls['rge'].value,
            //dataAbertura: this.utilService.ToDate(dados.abertura),
            dataFalecimento: this.pessoaForm.controls['dataFalecimento'].value,
            dataEncerramento: this.pessoaForm.controls['dataEncerramento'].value,
            empresaTrabalha: this.pessoaForm.controls['empresaTrabalha'].value,
            site: this.pessoaForm.controls['site'].value,
            tituloEleitoral: this.pessoaForm.controls['tituloEleitoral'].value,
            sessaoEleitoral: this.pessoaForm.controls['sessaoEleitoral'].value,
            zonaEleitoral: this.pessoaForm.controls['zonaEleitoral'].value,
            dataEmissaoTitulo: this.pessoaForm.controls['dataEmissaoTitulo'].value,
            nomeMae: this.pessoaForm.controls['nomeMae'].value,
            nomePai: this.pessoaForm.controls['nomePai'].value,
            descricaoDeficiencia: this.pessoaForm.controls['descricaoDeficiencia'].value,
            descricaoCtps: this.pessoaForm.controls['descricaoCtps'].value,
            numSerieCtps: this.pessoaForm.controls['numSerieCtps'].value,
            ufCtps: this.pessoaForm.controls['ufCtps'].value,
            dataEmissaoCtps: this.pessoaForm.controls['dataEmissaoCtps'].value,
            descricaoReservista: this.pessoaForm.controls['descricaoReservista'].value,
            numRaReservista: this.pessoaForm.controls['numRaReservista'].value,
            categoriaReservista: this.pessoaForm.controls['categoriaReservista'].value,
            dataEmissaoReservista: this.pessoaForm.controls['dataEmissaoReservista'].value
        });

        console.log("this.pessoaForm2: ");
        console.log(this.pessoaForm.controls['codigo'].value);

        let telefoneJaCadastrado = false;
        let emailJaCadastrado = false;
        for (let i = 0; this.pessoaComponent.Pessoa.pessoaContato.length > i; i++) {
            if (this.pessoaComponent.Pessoa.pessoaContato[i].descricao == dados.telefone) {
                telefoneJaCadastrado = true;
            }
            if (this.pessoaComponent.Pessoa.pessoaContato[i].descricao == dados.email) {
                emailJaCadastrado = true;
            }
            if(this.pessoaComponent.Pessoa.pessoaContato[i].id == 90){
                telefoneJaCadastrado = true;
            }
            if(this.pessoaComponent.Pessoa.pessoaContato[i].id == 91){
                emailJaCadastrado = true;
            }
        }

        if (!telefoneJaCadastrado && dados.telefone != null) {
            this.pessoaContato.id = 90;
            this.pessoaContato.descricao = dados.telefone;
            this.pessoaContato.tipoContatoId = 1;
            this.pessoaContato.nome = dados.fantasia;
            this.pessoaContato.tipoContato = { id: 1, descricao: 'Telefone' };
            this.pessoaComponent.Pessoa.pessoaContato.push(this.pessoaContato);
        }

        if (!emailJaCadastrado && dados.email != null) {
            this.pessoaContato.id = 91;
            this.pessoaContato = new PessoaContato();
            this.pessoaContato.descricao = dados.email;
            this.pessoaContato.tipoContatoId = 21;
            this.pessoaContato.nome = dados.fantasia;
            this.pessoaContato.tipoContato = { id: 21, descricao: 'E-mail' };
            this.pessoaComponent.Pessoa.pessoaContato.push(this.pessoaContato);
        }

        this.endereco.numero = dados.numero;
        this.endereco.complemento = dados.complemento;

        this.ConsultaCEP(dados.cep);

    }

    ConsultaCEP(cep) {

        console.log("this.pessoaForm3: ");
        console.log(this.pessoaForm.controls['codigo'].value);

        if (cep == null) return;
        cep = cep.replace(/\D/g, '');
        if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                this.httpClient.get<any>("//cepapi.delivoro.com.br/" + cep)
                    .map(dados => dados)
                    .subscribe(dados => this.popularFormEndereco(dados));
            }
        }
    }

    popularFormEndereco(dados) {

        this.endereco.cep = dados.cep;
        this.endereco.bairro = dados.bairro;
        this.endereco.logradouro = dados.logradouro;
        this.endereco.enderecoPrincipal = "S";

        if (!dados.naoEncontrado) {
            this.obterLocalidadeId(dados.cidade);
            this.obterUfId(dados.cidade);
            this.obterTipoLogradouroId(dados.tipoLogradouro);
            this.obterPaisId('Brasil');
            this.consultaCepCodMunicipio(dados.cep);
        }

        let enderecoJaCadastrado = false;
        for (let i = 0; this.pessoaComponent.Pessoa.endereco.length > i; i++) {
            if (this.pessoaComponent.Pessoa.endereco[i].cep == dados.cep) {
                enderecoJaCadastrado = true;
            }
        }

        if (!enderecoJaCadastrado) {
            this.pessoaComponent.Pessoa.endereco.push(this.endereco);
        }
    }

    obterLocalidadeId(desc: string) {
        console.log("AdicionarPessoaComponent obterLocalidadeId");
        this.pessoaService.obterLocalidadeId(desc)
            .subscribe(
                result => {
                    this.endereco.localidadeId = result[0].id;
                },
                error => { console.log(error); });
    }

    obterUfId(desc: string) {
        console.log("AdicionarPessoaComponent obterUfId");
        this.pessoaService.obterUfId(desc)
            .subscribe(
                result => {
                    this.endereco.ufId = result[0].id;
                },
                error => { console.log(error); });
    }

    obterTipoLogradouroId(desc: string) {
        console.log("AdicionarPessoaComponent obterTipoLogradouroId");

        this.pessoaService.obterTipoLogradouroId(desc)
            .subscribe(
                result => {
                    this.endereco.tipoLogradouroId = result[0].id;
                },
                error => { console.log(error); });
    }

    obterPaisId(desc: string) {
        console.log("AdicionarPessoaComponent obterPaisId");
        this.pessoaService.obterPaisId(desc)
            .subscribe(
                result => {
                    this.endereco.paisId = result[0].id;
                },
                error => { console.log(error); });
    }

    consultaCepCodMunicipio(cep) {
        console.log("AdicionarPessoaComponent consultaCepCodMunicipio");
        cep = cep.replace(/\D/g, '');
        if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
                    .map(result => result)
                    .subscribe(result => this.endereco.codigoMunicipio = result.ibge);
            }
        }
    }

    // onError(error) {
    //     this.errors = JSON.parse(error._body).errors;
    // }

    cancelar() {
        this.router.navigate(['fornecedor/lista']);
    }


    async ConsultaEmpresa(idGrupo): Promise<void> {

        this.grupoEmpresaId = idGrupo;

        this.empresas = [];
        this.pessoaService.obterTodosEmpresaPorId(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => { });
                
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'Pessoa', this.grupoEmpresaId);

        if(this.mascSequencial != null)
        {
            if(this.mascSequencial.sequencial === 'S'){
                this.pessoaForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {
              this.pessoaForm.controls['codigo'].setValue('');
              this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
              this.maskValid = true;
            } 
        }
        else
        {
            this.pessoaForm.controls['codigo'].setValue('');
            this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
            this.maskValid = true;
        }
       
    }

    async OnChangeEmpresa(empresaId) : Promise<void> {
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Pessoa', this.grupoEmpresaId, empresaId);
        
        if(this.mascSequencial != null)
        {
            if(this.mascSequencial.sequencial === 'S'){
              this.pessoaForm.controls['codigo'].setValue('');
              this.maskValid = false;
            }
            else
            {
              this.pessoaForm.controls['codigo'].setValue('');
              this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
              this.maskValid = true;
            }
        }
        else
        {
          this.pessoaForm.controls['codigo'].setValue('');
          this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
          this.maskValid = true;
          
        }
      
    }

    limparCampoCodigo(){
        this.pessoaForm.controls['codigo'].setValue('');
        this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
      }

}

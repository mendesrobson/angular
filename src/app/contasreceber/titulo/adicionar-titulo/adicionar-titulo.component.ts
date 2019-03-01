import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TituloComponent } from '../titulo.component';

import { Titulo, Parcela, Cliente, Fornecedor, TipoDocumento, ContaCorrente, Origem, Natureza, ConfiguracaoPagamento, TituloDesconto, TituloCentro, HistoricoPadrao, TituloParcela, ParcelaDesconto, FornecedorModel } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { UtilService } from '../../../services/util.service';
import { Subscription } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { getDaysInMonth, getYear, getMonth } from 'date-fns';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-adicionar-titulo',
  templateUrl: './adicionar-titulo.component.html',
  providers: [MaskService],
  styleUrls: ['./adicionar-titulo.component.css']
})

export class AdicionarTituloComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public permiteEditarTabHistoricoPadrao: boolean = true;

  public titulo: Titulo;
  dropdownList = [];
  gridDataSource: any;
  _gridBoxValue: string = '';
  _gridSelectedRowKeys: string[];

  public tituloForm: FormGroup;
  public carregaTituloCentro: boolean = false;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public clientes: Cliente[];
  public fornecedores: Fornecedor[];
  public tipoDocumentos: TipoDocumento[];
  public naturezas: Natureza[];
  public contaCorrentes: ContaCorrente[];
  public origems: Origem[];
  public historicoPadraos: HistoricoPadrao[];
  public configuracaoPagamentos: ConfiguracaoPagamento[];
  public confPagamento: ConfiguracaoPagamento;
  public tituloDesconto: TituloDesconto;
  public tituloDescontos: TituloDesconto[];
  public tituloCentro: TituloCentro;
  public tituloCentros: TituloCentro[];
  public parcela: Parcela;
  public parcelas: Parcela[];
  public parcelaDesconto: ParcelaDesconto;
  public parcelasDesconto: ParcelaDesconto[];
  public fornecedorModel: FornecedorModel;

  public natureza: string = "";
  public tituloPagina: string;

  public sub: Subscription;


  carregarParcela: boolean = false;

  public errors: any[] = [];

  constructor(
    private tituloService: TituloService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private tituloComponent: TituloComponent,
    private datePipe: DatePipe) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      clienteId: {
        required: 'Informe o Cliente'
      },
      fornecedorId: {
        required: 'Informe o Fornecedor'
      },
      documento: {
        required: 'A Documento é requerida',
        minlength: 'A Documento precisa ter no mínimo 3 caracteres',
        maxlength: 'A Documento precisa ter no máximo 100 caracteres'
      },
      valorBruto: {
        required: 'Informe o Valor Bruto'
      },
      tipoDocumentoId: {
        required: 'Informe o Tipo Documento'
      },
      origemId: {
        required: 'Informe a Origem'
      },
      contaCorrenteId: {
        required: 'Informe a Conta'
      },
      naturezaId: {
        required: 'Informe a Natureza'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.titulo = new Titulo();
    this.swal = new SweetAlertAdviceService();

    this.tituloComponent.Titulo = new Titulo();
    this.tituloComponent.Titulo.tituloCentro = [];
    this.tituloComponent.tituloCentro = new TituloCentro();
    this.fornecedorModel = new FornecedorModel();
  }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
        if (this.natureza == "receber") {
          this.titulo.naturezaId = 1;
          this.tituloForm = this.fb.group({
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            documento: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            naturezaId: [1, [Validators.required]],
            clienteId: ['', [Validators.required]],
            fornecedorId: '',
            tipoDocumentoId: ['', [Validators.required]],
            contaCorrenteId: ['', [Validators.required]],
            origemId: [1, [Validators.required]],
            historicoPadraoId: [],
            configuracaoPagamentoId: [],
            valorBruto: [0.0, [Validators.required]],
            valorDesconto: 0.0,
            valorRetencoes: 0.0,
            valorLiquido: 0.0,
            dataPrimeiroVencimento: [],
            dataEmissao: [],
            percentualJuros: [],
            percentualMulta: [],
            numeroDiaUtil: [],
            quantidadeParcela: [],
            periodicidade: [],
            manterDiaVencimento: 'N',
            diaUtil: 'N',
            posterga: 'N',
            antecipa: 'N',
            ultimoDiaMes: 'N',
            sabadoUtil: 'N',
            domingoUtil: 'N',
            descricao: '',
            anexoFile: '',
            observacao: '',
            excluido: 'N'
          });

        } else if (this.natureza == "pagar") {
          this.titulo.naturezaId = 2;
          this.tituloForm = this.fb.group({
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            documento: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            naturezaId: [2, [Validators.required]],
            clienteId: '',
            fornecedorId: ['', [Validators.required]],
            tipoDocumentoId: ['', [Validators.required]],
            contaCorrenteId: ['', [Validators.required]],
            origemId: [1, [Validators.required]],
            historicoPadraoId: [],
            configuracaoPagamentoId: [],
            valorBruto: [0.0, [Validators.required]],
            valorDesconto: 0.0,
            valorRetencoes: 0.0,
            valorLiquido: 0.0,
            dataPrimeiroVencimento: [],
            dataEmissao: [],
            percentualJuros: [],
            percentualMulta: [],
            numeroDiaUtil: [],
            quantidadeParcela: [],
            periodicidade: [],
            manterDiaVencimento: 'N',
            diaUtil: 'N',
            posterga: 'N',
            antecipa: 'N',
            ultimoDiaMes: 'N',
            sabadoUtil: 'N',
            domingoUtil: 'N',
            descricao: '',
            anexoFile: '',
            observacao: '',
            excluido: 'N'
          });

        }
      });

    this.tituloForm.controls['valorDesconto'].disable();
    this.tituloForm.controls['valorLiquido'].disable();
    this.tituloForm.controls['naturezaId'].disable();
    this.tituloForm.controls['origemId'].disable();

    if (this.natureza == "receber")
      this.tituloPagina = "Receber"
    else
      this.tituloPagina = "Pagar";


    this.tituloService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.tituloService.obterTodosTipoDocumento()
      .subscribe(tipoDocumentos => {
        this.tipoDocumentos = tipoDocumentos
      },
        error => this.errors);

    this.tituloService.obterTodosNatureza()
      .subscribe(naturezas => {
        this.naturezas = naturezas
      },
        error => this.errors);

    this.tituloService.obterTodosOrigem()
      .subscribe(origems => {
        this.origems = origems
      },
        error => this.errors);

  }

  public selectDataVencimento = [
    { id: '01', value: '01' },
    { id: '02', value: '02' },
    { id: '03', value: '03' },
    { id: '04', value: '04' },
    { id: '05', value: '05' },
    { id: '06', value: '06' },
    { id: '07', value: '07' },
    { id: '08', value: '08' },
    { id: '09', value: '09' },
    { id: '10', value: '10' },
    { id: '11', value: '11' },
    { id: '12', value: '12' },
    { id: '13', value: '13' },
    { id: '14', value: '14' },
    { id: '15', value: '15' },
    { id: '16', value: '16' },
    { id: '17', value: '17' },
    { id: '18', value: '18' },
    { id: '19', value: '19' },
    { id: '20', value: '20' },
    { id: '21', value: '21' },
    { id: '22', value: '22' },
    { id: '23', value: '23' },
    { id: '24', value: '24' },
    { id: '25', value: '25' },
    { id: '26', value: '26' },
    { id: '27', value: '27' },
    { id: '28', value: '28' },
    { id: '29', value: '29' },
    { id: '30', value: '30' },
    { id: '31', value: '31' }
  ];

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tituloForm);
    });

  }

  popularConfiguracaoPagamento(id) {
    this.tituloService.obterConfiguracaoPagamentoId(id)
      .subscribe(
        configuracaoPagamento => this.preencherConfiguracaoPagamento(configuracaoPagamento),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherConfiguracaoPagamento(configuracaoPagamento: ConfiguracaoPagamento): void {

    this.confPagamento = configuracaoPagamento;
    let dataVencimento: string = (getYear(Date.now()) + "-0" + (parseInt(getMonth(Date.now()).toString()) + 1) + "-" + this.confPagamento.dataPrimeiroVencimento).toString();

    this.tituloForm.patchValue({
      quantidadeParcela: this.confPagamento.quantidadeParcela,
      diaUtil: this.confPagamento.diaUtil,
      manterDiaVencimento: this.confPagamento.manterDiaVencimento,
      posterga: this.confPagamento.posterga,
      antecipa: this.confPagamento.antecipa,
      ultimoDiaMes: this.confPagamento.ultimoDiaMes,
      periodicidade: this.confPagamento.periodicidade,
      sabadoUtil: this.confPagamento.sabadoUtil,
      domingoUtil: this.confPagamento.domingoUtil,
      percentualJuros: this.confPagamento.percentualJuros,
      percentualMulta: this.confPagamento.percentualMulta,
      numeroDiaUtil: this.confPagamento.numeroDiaUtil,
      dataPrimeiroVencimento: dataVencimento
    });
  }

  adicionarTitulo() {
    if (this.tituloForm.dirty && this.tituloForm.valid) {

      let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

      
      p.tituloDesconto = this.tituloComponent.Titulo.tituloDesconto;
      p.parcela = this.tituloComponent.Titulo.parcela;
      p.tituloCentro = this.tituloComponent.Titulo.tituloCentro;

      if (p.parcela != null) {
        if (p.parcela.length == p.quantidadeParcela) {

          let vTotalParcelas = 0;
          for (var i = 0; i < p.parcela.length; i++) {
            p.parcela[i].id = 0;
            vTotalParcelas = vTotalParcelas + p.parcela[i].valorLiquido;
            for (var j = 0; j < p.parcela[i].apropriacaoCentro.length; j++) {
              p.parcela[i].apropriacaoCentro[j].CentroCusto = null;
              p.parcela[i].apropriacaoCentro[j].CentroResultado = null;
              p.parcela[i].apropriacaoCentro[j].parcelaId = 0;
              p.parcela[i].apropriacaoCentro[j].tituloId = null;
            }
          }

          if (vTotalParcelas == p.valorLiquido) {

            if (p.tituloCentro != null) {
              for (var i = 0; i < p.tituloCentro.length; i++) {
                p.tituloCentro[i].centroCusto = null;
                p.tituloCentro[i].centroResultado = null;
              }
            }

            p.valorDesconto = this.tituloComponent.Titulo.valorDesconto;
            p.valorLiquido = this.tituloComponent.Titulo.valorLiquido;
            p.HistoricoPadrao = null;

            this.tituloService.AdicionarTitulo(p)
              .subscribe(
                result => {
                  this.titulo = result;
                  this.tituloComponent.Titulo = this.titulo;
                  this.tituloComponent = null;
                  this.swal.showSwalSuccess('Titulo Adicionado com Sucesso!');

                  if (result.naturezaId == 1) {
                    this.router.navigate(['titulo/lista/receber']);
                  } else if (result.naturezaId == 2) {
                    this.router.navigate(['titulo/lista/pagar']);
                  }

                },
                error => {
                  this.onError(error)
                })

          } else {
            this.swal.showSwalErro("Valor liquido do Titulo, diferente do valor total das parcelas!");
          }
        } else {
          this.swal.showSwalErro("Quantidades parcela do Titulo, diferente de número de parcelas!");
        }
      } else {
        this.swal.showSwalErro("Não existe parcela para este Titulo, favor gerar parcela!");
      }

    }
  }


  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {

    if (this.natureza == "receber") {
      this.router.navigate(['titulo/lista/receber']);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['titulo/lista/pagar']);
    }

  }

  gerarParcelas() {
    this.gerarTitulo();
    this.adicionarTituloParcela();
  }

  gerarTitulo() {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    p.parcela = [];
    p.tituloDesconto = [];
    p.tituloCentro = [];
    if (this.tituloComponent.Titulo.tituloDesconto != null) {
      p.tituloDesconto = this.tituloComponent.Titulo.tituloDesconto;
    }

    if (this.tituloComponent.Titulo.tituloCentro != null) {
      p.tituloCentro = this.tituloComponent.Titulo.tituloCentro;
    }
    this.tituloComponent.Titulo = p;
  }

  adicionarTituloParcela() {

    this.tituloService.GerarParcela(this.tituloComponent.Titulo)
      .subscribe(
        result => {

          this.tituloComponent.Titulo = result;
          for (let i = 0; i < this.tituloComponent.Titulo.parcela.length; i++) {
            this.tituloComponent.Titulo.parcela[i].id = i;
          }

          this.carregarParcela = true;

          this.tituloForm.patchValue({
            valorLiquido: this.tituloComponent.Titulo.valorLiquido,
            valorBruto: this.tituloComponent.Titulo.valorBruto,
            valorDesconto: this.tituloComponent.Titulo.valorDesconto
          });

        },
        error => {
          this.onError(error)
        })

  }

  atualizarValorDesconto(valorDesconto) {

    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());
    p.valorDesconto = p.valorDesconto + valorDesconto;
    p.valorLiquido = p.valorLiquido - valorDesconto;

    this.tituloForm.patchValue({
      valorDesconto: p.valorDesconto,
      valorLiquido: p.valorLiquido
    });

    let p2 = Object.assign({}, this.titulo, this.tituloForm.getRawValue());
    localStorage.setItem("titulo", JSON.stringify(p2));

  }

  excluirValorDesconto(valorDesconto: number) {
    console.log("Valor: " + valorDesconto);
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    p.valorDesconto = p.valorDesconto - valorDesconto;
    p.valorLiquido = p.valorLiquido + valorDesconto;

    this.tituloForm.patchValue({
      valorDesconto: p.valorDesconto,
      valorLiquido: p.valorLiquido
    });


    let p2 = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

  }

  storageTitulo() {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());
    localStorage.setItem("valorBruto", JSON.stringify(p.valorBruto));
    localStorage.setItem("valorLiquido", JSON.stringify(p.valorLiquido));
  }

  preencherValores() {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    this.tituloForm.patchValue({
      valorLiquido: p.valorBruto - p.valorDesconto - p.valorRetencoes
    });
  }

  preencherHistorico(id) {

    this.carregaTituloCentro = false;
    this.tituloComponent.Titulo.tituloCentro = new Array();
    this.tituloService.obterHistoricoPadraoCentroPorId(id)
      .subscribe(
        result => {
          let titulocentro;
          for (var i = 0; i < result.length; i++) {
            titulocentro = new TituloCentro();
            titulocentro.id = i;
            titulocentro.centroCusto = result[i].centroCusto;
            titulocentro.centroCustoId = result[i].centroCustoId;
            titulocentro.centroResultado = result[i].centroResultado;
            titulocentro.centroResultadoId = result[i].centroResultadoId;
            titulocentro.percentual = result[i].percentual;
            this.tituloComponent.Titulo.tituloCentro.push(titulocentro);
          }
          this.carregaTituloCentro = true;
        });


    for (let i = 0; i < this.historicoPadraos.length; i++) {
      if (this.historicoPadraos[i].id == id) {
        this.tituloComponent.Titulo.descricao = this.historicoPadraos[i].descricao;
      }
    }

    this.tituloForm.patchValue({
      descricao: this.tituloComponent.Titulo.descricao
    });


  }

  atualizarTitulo() {
    console.log("Entrou");
    console.log(this.tituloComponent.Titulo.valorLiquido);

    this.tituloForm.patchValue({
      valorLiquido: this.tituloComponent.Titulo.valorLiquido,
      valorBruto: this.tituloComponent.Titulo.valorBruto,
      valorDesconto: this.tituloComponent.Titulo.valorDesconto
    });
  }

  adicionarAnexo(event) {
    this.titulo.anexo = event.srcElement.files[0].name;
    this.tituloForm.patchValue({
      anexoFile: this.titulo.anexo
    });
    this._utilService.ConverterArquivoParaString(event, (result) => this.arquivoString(result));
  }

  visualizarAnexo(arquivo) {
    if (arquivo != "" && arquivo != null) {
      this._utilService.VisualizarArquivo(arquivo, "PDF");
    }
  }

  arquivoString(result) {
    this.titulo.arquivoAnexo = result;
  }

  ConsultaEmpresa(idGrupo) {
    this.fornecedorModel.grupoEmpresaId = idGrupo;
    this.empresas = [];
    this.tituloService.obterTodosEmpresaPorGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);

    this.fornecedores = [];
    this.tituloService.obterTodosFornecedorPorGrupo(idGrupo)
      .subscribe(result => {
        this.fornecedores = result;
        this.dropdownList = [];
        this.fornecedores.forEach(el => {
          this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, fornecedor: el.pessoa.nome });
        });

        this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);
      });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.tituloComponent.titulo.empresaId = idEmpresa;

    this.clientes = [];
    this.tituloService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);

    this.fornecedorModel.empresaId = idEmpresa;

    if (idEmpresa !== null) {
      this.fornecedores = [];
      this.tituloService.obterTodosFornecedorPorGrupoEmpresa(this.fornecedorModel)
        .subscribe(result => {
          this.fornecedores = result;
          this.dropdownList = [];
          this.fornecedores.forEach(el => {
            this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, fornecedor: el.pessoa.nome });
          });

          this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);
        });
    }

    this.configuracaoPagamentos = [];
    this.tituloService.obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa)
      .subscribe(configuracaoPagamentos => {
        this.configuracaoPagamentos = configuracaoPagamentos
      },
        error => this.errors);

    this.historicoPadraos = [];
    this.tituloService.obterTodosHistoricoPadraoPorEmpresa(idEmpresa)
      .subscribe(historicoPadraos => {
        this.historicoPadraos = historicoPadraos
      },
        error => this.errors);

    this.contaCorrentes = [];
    this.tituloService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

  }
  makeAsyncDataSource(clientes) {
    return new CustomStore({
      loadMode: "raw",
      key: "id",
      load: function () {
        return clientes;
      }
    });
  }

  get gridBoxValue(): string {
    return this._gridBoxValue;
  }

  set gridBoxValue(value: string) {
    this._gridBoxValue = value || '';
  }

  get gridSelectedRowKeys(): string[] {
    return this._gridSelectedRowKeys;
  }

  set gridSelectedRowKeys(value: string[]) {
    this._gridBoxValue = value.length && value[0] || null;
    this._gridSelectedRowKeys = value;
  }
}


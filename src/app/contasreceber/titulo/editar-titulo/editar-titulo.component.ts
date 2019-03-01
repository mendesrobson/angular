import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { getDaysInMonth, getYear, getMonth } from 'date-fns';

import { Titulo, Cliente, Fornecedor, TipoDocumento, ContaCorrente, Origem, Natureza, ConfiguracaoPagamento, TituloDesconto, Desconto, TituloCentro, CentroCusto, CentroResultado, HistoricoPadrao, Parcela, Faturamento } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { UtilService } from '../../../services/util.service';
import { Subscription } from 'rxjs';
import { TituloComponent } from '../titulo.component';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-editar-titulo',
  templateUrl: './editar-titulo.component.html',
  providers: [MaskService],
  styleUrls: ['./editar-titulo.component.css']
})

export class EditarTituloComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public titulo: Titulo;
  public tituloForm: FormGroup;
  public tituloId: string = "";
  public sub: Subscription;
  public permiteEditarTabHistoricoPadrao: boolean = false;
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
  public faturamento: Faturamento;
  public tituloDesconto: TituloDesconto;
  public tituloDescontos: TituloDesconto[];
  public descontos: Desconto[];
  public tituloCentros: TituloCentro[];
  public centroCustos = [];
  public centroResultados = [];
  public parcela: Parcela;
  public parcelas: Parcela[];
  public _CentroCustos: CentroCusto[];
  public _CentroResultados: CentroResultado[];

  carregarDesconto: boolean = false;
  carregarCentroCusto: boolean = false;
  carregarCentroResultado: boolean = false;
  carregarParcela: boolean = false;

  public tituloPagina: string;

  public errors: any[] = [];

  constructor(
    private tituloService: TituloService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private tituloComponent: TituloComponent) {

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
            origemId: ['', [Validators.required]],
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
            anexoFile: '',
            observacao: '',
            excluido: 'N',
            descricao: '',
            valorTotalIrrf: 0.0,
            valorTotalPis: 0.0,
            valorTotalCofins: 0.0,
            valorTotalCsll: 0.0,
            valorTotalCrf: 0.0,
            valorTotalIss: 0.0,
          });

          this.tituloPagina = "Receber";

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
            origemId: ['', [Validators.required]],
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
            anexoFile: '',
            observacao: '',
            excluido: 'N',
            descricao: ''
          });

          this.tituloPagina = "Pagar"

        }
      });

    this.sub = this.route.params.subscribe(
      params => {
        this.tituloId = params['id'];
        this.obterTitulo(this.tituloId);

      });

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

    this.tituloService.obterTodosCentroCusto()
      .subscribe(centroCustos => {
        this._CentroCustos = centroCustos
      },
        error => this.errors);

    this.tituloService.obterTodosCentroResultado()
      .subscribe(centroResultados => {
        this._CentroResultados = centroResultados
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

  preencherTituloDesconto() {
    this.tituloService.obterTituloDescontoPorTituloId(this.tituloId)
      .subscribe(
        tituloDescontos => {
          this.tituloDescontos = tituloDescontos;

          for (var i = 0; this.tituloDescontos.length > i; i++) {

            for (var y = 0; this.descontos.length > y; y++) {
              if (this.tituloDescontos[i].descontoId == this.descontos[y].id) {
                //this.tituloDescontos[i].descricao = this.descontos[y].descricao;
                //this.tituloDescontos[i].percentualValor = this.descontos[y].percentualValor;
              }
            }
          }

          localStorage.setItem("tituloDesconto", JSON.stringify(this.tituloDescontos));
          this.carregarDesconto = true;
        },

        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });

  }

  preencherTituloParcelas() {
    this.tituloService.obterParcelasPorTituloId(this.tituloId)
      .subscribe(
        parcelas => {
          this.parcelas = parcelas;
          this.tituloComponent.Titulo.parcela = this.parcelas;
          if (this.tituloComponent.Titulo.parcela != null) {
            this.carregarParcela = true;
          }
        },

        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });

  }


  preencherTituloCentro() {
    if (this.titulo.tituloCentro != null) {
      this.carregarCentroCusto = true;
      this.carregarCentroResultado = true;
    }
  }


  popularConfiguracaoPagamento(id) {
    if (id != undefined) {
      this.tituloService.obterConfiguracaoPagamentoId(id)
        .subscribe(
          configuracaoPagamento => this.preencherConfiguracaoPagamento(configuracaoPagamento),
          response => {
            if (response.status == 404) {
              this.router.navigate(['404']);
            }
          });
    }
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


  popularFaturamento(id) {
    if (id != undefined) {
      this.tituloService.obterFaturamentoId(id)
        .subscribe(
          faturamento => this.preencherFaturamento(faturamento),
          response => {
            if (response.status == 404) {
              this.router.navigate(['404']);
            }
          });
    }
  }

  preencherFaturamento(faturamento: Faturamento): void {
    this.faturamento = faturamento;

    this.tituloForm.patchValue({
      valorTotalIrrf: this.faturamento != null ? this.faturamento.valorTotalIRRF : null,
      valorTotalPis: this.faturamento != null ? this.faturamento.valorTotalPIS : null,
      valorTotalCofins: this.faturamento != null ? this.faturamento.valorTotalCOFINS : null,
      valorTotalCsll: this.faturamento != null ? this.faturamento.valorTotalCSLL : null,
      valorTotalCrf: this.faturamento != null ? this.faturamento.valorTotalCRF : null,
      valorTotalIss: this.faturamento != null ? this.faturamento.valorTotalISS : null,
    });
  }



  obterTitulo(id: string) {
    this.tituloService.obterTitulo(id)
      .subscribe(
        titulo => this.preencherFormTitulo(titulo),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormTitulo(titulo: Titulo): void {
    this.tituloComponent.Titulo = titulo;
    this.tituloComponent.Titulo.parcela = titulo.parcela;
    this.tituloComponent.Titulo.tituloDesconto = titulo.tituloDesconto;
    this.tituloComponent.Titulo.tituloCentro = titulo.tituloCentro;
    this.titulo = titulo;
    this.carregarDesconto = true;

    if (this.tituloComponent.Titulo.parcela != null) {
      this.carregarParcela = true;
    }

    this.reativarVisivel = this.titulo.excluido === 'S';
    this.removerVisivel = this.titulo.excluido === 'N';

    this.tituloForm.patchValue({
      empresaId: this.titulo.empresaId,
      grupoEmpresaId: this.titulo.grupoEmpresaId,
      documento: this.titulo.documento,
      clienteId: this.titulo.clienteId,
      fornecedorId: this.titulo.fornecedorId,
      tipoDocumentoId: this.titulo.tipoDocumentoId,
      naturezaId: this.titulo.naturezaId,
      contaCorrenteId: this.titulo.contaCorrenteId,
      origemId: this.titulo.origemId,
      historicoPadraoId: this.titulo.historicoPadraoId,
      configuracaoPagamentoId: this.titulo.configuracaoPagamentoId,
      valorBruto: this.titulo.valorBruto,
      valorDesconto: this.titulo.valorDesconto,
      valorRetencoes: this.titulo.valorRetencoes,
      valorLiquido: this.titulo.valorLiquido,
      dataPrimeiroVencimento: this._utilService.ToDate(this.titulo.dataPrimeiroVencimento),
      percentualJuros: this.titulo.percentualJuros,
      percentualMulta: this.titulo.percentualMulta,
      numeroDiaUtil: this.titulo.numeroDiaUtil,
      quantidadeParcela: this.titulo.quantidadeParcela,
      periodicidade: this.titulo.periodicidade,
      manterDiaVencimento: this.titulo.manterDiaVencimento,
      diaUtil: this.titulo.diaUtil,
      posterga: this.titulo.posterga,
      ultimoDiaMes: this.titulo.ultimoDiaMes,
      antecipa: this.titulo.antecipa,
      sabadoUtil: this.titulo.sabadoUtil,
      domingoUtil: this.titulo.domingoUtil,
      descricao: this.titulo.descricao,
      anexoFile: this.titulo.anexo,
      observacao: this.titulo.observacao,
      excluido: this.titulo.excluido,
    });

    let naoAberto: boolean;
    naoAberto = false;
    if (this.tituloComponent.Titulo.parcela != null) {
      for (var i = 0; this.tituloComponent.Titulo.parcela.length > i; i++) {
        if (this.tituloComponent.Titulo.parcela[i].situacao != 'ABR') {
          naoAberto = true;
        }
        if (this.tituloComponent.Titulo.parcela[i]._Boleto != null) {
          if (this.tituloComponent.Titulo.parcela[i]._Boleto.status != 'canceled') {
            naoAberto = true;
          }
        }
      }
    }

    if (naoAberto) {
      this.tituloForm.controls['documento'].disable();
      this.tituloForm.controls['tipoDocumentoId'].disable();
      this.tituloForm.controls['contaCorrenteId'].disable();
      this.tituloForm.controls['valorBruto'].disable();
      this.tituloForm.controls['valorRetencoes'].disable();
      this.tituloForm.controls['configuracaoPagamentoId'].disable();
      this.tituloForm.controls['dataPrimeiroVencimento'].disable();
      this.tituloForm.controls['percentualJuros'].disable();
      this.tituloForm.controls['percentualMulta'].disable();
      this.tituloForm.controls['quantidadeParcela'].disable();
      this.tituloForm.controls['periodicidade'].disable();
      this.permiteEditarTabHistoricoPadrao = true;
      this.tituloForm.controls['historicoPadraoId'].disable();
    }

    this.tituloForm.controls['grupoEmpresaId'].disable();
    this.tituloForm.controls['empresaId'].disable();
    this.tituloForm.controls['clienteId'].disable();
    this.tituloForm.controls['fornecedorId'].disable();
    this.tituloForm.controls['naturezaId'].disable();
    this.tituloForm.controls['dataEmissao'].disable();
    this.tituloForm.controls['origemId'].disable();
    this.tituloForm.controls['valorDesconto'].disable();
    this.tituloForm.controls['valorLiquido'].disable();

    this.tituloForm.controls['valorTotalIrrf'].disable();
    this.tituloForm.controls['valorTotalPis'].disable();
    this.tituloForm.controls['valorTotalCofins'].disable();
    this.tituloForm.controls['valorTotalCsll'].disable();
    this.tituloForm.controls['valorTotalCrf'].disable();
    this.tituloForm.controls['valorTotalIss'].disable();
 
    this.preencherTituloCentro();
    this.popularFaturamento(this.titulo.faturamentoId);

  }

  editarTitulo() {

    if (this.tituloForm.valid) {
      if (this.tituloComponent.dirty || this.tituloForm.dirty) {

        let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

        p.tituloDesconto = this.tituloComponent.Titulo.tituloDesconto;
        p.parcela = this.tituloComponent.Titulo.parcela;

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

              p.valorDesconto = this.tituloComponent.Titulo.valorDesconto;
              p.valorLiquido = this.tituloComponent.Titulo.valorLiquido;
              p.tituloCentro = [];
              p.HistoricoPadrao = null;

              this.tituloService.AtualizarTitulo(p)
                .subscribe(
                  result => {
                    this.swal.showSwalSuccess('Titulo Atualizado com Sucesso!');

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
  }


  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    if (p.naturezaId == 1) {
      this.router.navigate(['titulo/lista/receber']);
    } else if (p.naturezaId == 2) {
      this.router.navigate(['titulo/lista/pagar']);
    }
  }

  remover(id) {
    this.router.navigate(['titulo/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['titulo/reativar/' + id]);
  }

  adicionarAnexo(event) {
    this.titulo.anexo = event.srcElement.files[0].name;
    this.tituloForm.patchValue({
      anexoFile: this.titulo.anexo
    });
    // this._utilService.ConverterArquivoParaString(event, (result) => this.arquivoString(result));
  }

  visualizarAnexo(arquivo) {
    if (arquivo != "" && arquivo != null) {
      //this._utilService.VisualizarArquivo(arquivo, "PDF");
    }
  }

  arquivoString(result) {
    this.titulo.arquivoAnexo = result;
  }

  preencherValores() {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    this.tituloForm.patchValue({
      valorLiquido: p.valorBruto - p.valorDesconto - p.valorRetencoes
    });
  }

  excluirValorDesconto(valorDesconto: number) {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    p.valorDesconto = p.valorDesconto - valorDesconto;
    p.valorLiquido = p.valorLiquido + valorDesconto;

    this.tituloForm.patchValue({
      valorDesconto: p.valorDesconto,
      valorLiquido: p.valorLiquido
    });
  }

  async preencherHistorico(id): Promise<void> {
    this.carregaTituloCentro = false;

    if (this.tituloComponent.Titulo.tituloCentro != null) {
      if (this.tituloComponent.Titulo.historicoPadraoId != id) {

        let hist: HistoricoPadrao[];
        hist = this.historicoPadraos.filter(h => h.id == id);
        this.tituloComponent.Titulo.historicoPadraoId = id;
        this.tituloComponent.Titulo.descricao = hist[0].descricao;

        this.tituloForm.patchValue({
          descricao: this.tituloComponent.Titulo.descricao
        });

        for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
          let delTituloCentro = await this.tituloService.excluirTituloCentroAsync(this.tituloComponent.Titulo.tituloCentro[i]);
        };

        let titulocentros = [];
        this.tituloComponent.Titulo.tituloCentro = new Array();
        titulocentros = await this.tituloService.obterHistoricoPadraoCentroPorIdAsync(id);

        for (var i = 0; titulocentros.length > i; i++) {
          let titulocentro = new TituloCentro();
          titulocentro.id = 0;
          titulocentro.tituloId = this.tituloComponent.Titulo.id;
          titulocentro.centroCustoId = titulocentros[i].centroCustoId;
          titulocentro.centroResultadoId = titulocentros[i].centroResultadoId;
          titulocentro.percentual = titulocentros[i].percentual;
          let addTituloCentro = await this.tituloService.AdicionarTituloCentroAsync(titulocentro);
          addTituloCentro.centroResultado = titulocentros[i].centroResultado;
          addTituloCentro.centroCusto = titulocentros[i].centroCusto;
          this.tituloComponent.Titulo.tituloCentro.push(addTituloCentro);
        }
        this.carregaTituloCentro = true;

      } else {
        this.carregaTituloCentro = true;
      }

    }

  }

  async gerarParcelas(): Promise<void> {
    if (this.tituloForm.dirty) {
      let gerouTit = await this.gerarTitulo();
      this.adicionarTituloParcela();
    }
  }

  async gerarTitulo(): Promise<void> {
    let p = Object.assign({}, this.titulo, this.tituloForm.getRawValue());

    if (this.tituloComponent.Titulo.parcela != null) {
      for (var i = 0; i < this.tituloComponent.Titulo.parcela.length; i++) {

        if (this.tituloComponent.Titulo.parcela[i].parcelaDesconto != null) {
          for (var d = 0; d < this.tituloComponent.Titulo.parcela[i].parcelaDesconto.length; d++) {
            if (this.tituloComponent.Titulo.parcela[i].parcelaDesconto[d].parcelaId > 0) {
              let delParcelaDesconto = await this.tituloService.excluirParcelaDescontoAsync(this.tituloComponent.Titulo.parcela[i].parcelaDesconto[d]);
            }
          }
        }

        if (this.tituloComponent.Titulo.parcela[i].apropriacaoCentro != null) {
          for (var a = 0; a < this.tituloComponent.Titulo.parcela[i].apropriacaoCentro.length; a++) {
            if (this.tituloComponent.Titulo.parcela[i].apropriacaoCentro[a].parcelaId > 0) {
              let delApropriacaoCentro = await this.tituloService.excluirApropriacaoCentroAsync(this.tituloComponent.Titulo.parcela[i].apropriacaoCentro[a]);
            }
          }
        }

        if (this.tituloComponent.Titulo.parcela[i].tituloId > 0) {
          let delParcela = await this.tituloService.excluirParcelaAsync(this.tituloComponent.Titulo.parcela[i]);
        }

      };
    }

    p.parcela = [];
    p.tituloDesconto = [];
    p.tituloCentro = [];
    if (this.tituloComponent.Titulo.tituloDesconto != null) {
      p.tituloDesconto = this.tituloComponent.Titulo.tituloDesconto;
    }

    if (this.tituloComponent.Titulo.tituloCentro != null) {
      p.tituloCentro = this.tituloComponent.Titulo.tituloCentro;
    }

    this.tituloComponent.Titulo.valorBruto = p.valorBruto;
    this.tituloComponent.Titulo.valorDesconto = p.valorDesconto;
    this.tituloComponent.Titulo.valorRetencoes = p.valorRetencoes;
    this.tituloComponent.Titulo.valorLiquido = p.valorLiquido;
    this.tituloComponent.Titulo.historicoPadraoId = p.historicoPadraoId;
    this.tituloComponent.Titulo.descricao = p.descricao;

    this.tituloComponent.Titulo.parcela = p.parcela;
    this.tituloComponent.Titulo.tituloDesconto = p.tituloDesconto;
    this.tituloComponent.Titulo.tituloCentro = p.tituloCentro;

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

          if (this.tituloComponent.Titulo.parcela != null) {
            this.carregarParcela = true;
          }

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


  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tituloService.obterTodosEmpresaPorGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.tituloComponent.titulo.empresaId = idEmpresa;

    this.clientes = [];
    this.tituloService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);

    this.fornecedores = [];
    this.tituloService.obterTodosFornecedorPorEmpresa(idEmpresa)
      .subscribe(fornecedores => {
        this.fornecedores = fornecedores
      },
        error => this.errors);

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


}


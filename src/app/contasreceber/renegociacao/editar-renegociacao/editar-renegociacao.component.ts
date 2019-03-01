import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { Renegociacao, RenegociacaoParcela, FiltroRenegociacao, TipoCobranca } from '../models/renegociacao';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { RenegociacaoService } from '../renegociacao.service';
import { Subscription } from 'rxjs';
import { Parcela, ConfiguracaoPagamento, ContaCorrente, Desconto, Titulo } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ToastsManager, Toast } from 'ng2-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { RenegociacaoComponent } from '../renegociacao.component';
import { UtilService } from '../../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';


@Component({
  selector: 'app-editar-renegociacao',
  templateUrl: './editar-renegociacao.component.html',
  styleUrls: [],
  providers: [DateUtils]
})
export class EditarRenegociacaoComponent implements OnInit {

  public filtroRenegociacaoForm: FormGroup;
  public gerarRenegociacaoForm: FormGroup;
  public filtroRenegociacao: FiltroRenegociacao;
  public renegociacao: Renegociacao;

  busy: Subscription;
  public sub: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  configuracaoPagamentos: ConfiguracaoPagamento[];
  contaCorrentes: ContaCorrente[];
  descontos: Desconto[];
  tipoCobrancas: TipoCobranca[];
  titulo: Titulo;
  percOrValor = '$';

  public natureza: string = "";
  public renegociacaoId: string = "";

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  swal: SweetAlertAdviceService;
  public innerHtml: SafeHtml;

  public myDatePickerOptions = DateUtils.getMyDatePickerDefaultOptions();

  displayMessage: { [key: string]: string } = {};

  public data: any[];

  //valorRadio: string = 'parcelas';

  carregarTable: boolean = false;

  srcImagem: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];
  public modalVisible: boolean;

  selectedEntities: any[];

  myOptionsClientes: IMultiSelectOption[] = [];

  mySettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-secondary',
    containerClasses: 'dropdown-inline',
    showCheckAll: true,
    showUncheckAll: true,
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,

  };

  myTexts: IMultiSelectTexts = {
    checkAll: 'Marcar todos',
    uncheckAll: 'Desmarcar todos',
    checked: 'selecionado',
    checkedPlural: 'selecionados',
    searchPlaceholder: 'Pesquisar',
    searchEmptyResult: 'Pesquisando...',
    searchNoRenderText: 'Não encontrado',
    defaultTitle: 'Selecione',
    allSelected: 'Todos'
  };

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(private fb: FormBuilder,
    private renegociacaoService: RenegociacaoService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private renegociacaoComponent: RenegociacaoComponent,
    private _utilService: UtilService
  ) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      configuracaoPagamentoId: {
        required: 'Configuração de Pagamento é requerido.'
      },
      contaCorrenteId: {
        required: 'Conta Corrente é requerida.'
      },
      clienteId: {
        required: 'Cliente é requerido.'
      },
      fornecedorId: {
        required: 'Fornecedor é requerido.'
      },
      tipoCobrancaId: {
        required: 'Tipo de Cobrança é requerido.'
      }

    };


    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroRenegociacao = new FiltroRenegociacao();
    this.titulo = new Titulo();
    this.modalVisible = false;
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    this.srcImagem = '';
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {


    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
      }
    )

    this.sub = this.route.params.subscribe(
      params => {
        this.renegociacaoId = params['id'];
        this.obterRenegociacao(this.renegociacaoId);

      });

    this.gerarRenegociacaoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      valorDesconto: 0,
      valorAbono: 0,
      valorAcrescimo: 0,
      observacao: '',
      configuracaoPagamentoId: [0, [Validators.required]],

      quantidadeParcela: '',
      periodicidade: '',
      numeroDiaUtil: '',
      percentualJuros: [],
      percentualMulta: [],
      dataPrimeiroVencimento: [],
      manterDiaVencimento: 'N',
      diaUtil: 'N',
      ultimoDiaMes: 'N',
      posterga: 'N',
      antecipa: 'N',
      sabadoUtil: 'N',
      domingoUtil: 'N',

      contaCorrenteId: [0, [Validators.required]],
      descontoId: 0,
      tipoCobrancaId: [0, [Validators.required]],
      dataRenegociacao: '',
      clienteId: [0, [Validators.required]],
      fornecedorId: [0, [Validators.required]]
    });

    this.gerarRenegociacaoForm.controls['valorAbono'].disable();
    this.gerarRenegociacaoForm.controls['valorAcrescimo'].disable();
    this.gerarRenegociacaoForm.controls['observacao'].disable();
    this.gerarRenegociacaoForm.controls['configuracaoPagamentoId'].disable();
    this.gerarRenegociacaoForm.controls['contaCorrenteId'].disable();
    this.gerarRenegociacaoForm.controls['descontoId'].disable();
    this.gerarRenegociacaoForm.controls['tipoCobrancaId'].disable();
    this.gerarRenegociacaoForm.controls['dataRenegociacao'].disable();
    this.gerarRenegociacaoForm.controls['clienteId'].disable();
    this.gerarRenegociacaoForm.controls['fornecedorId'].disable();

    this.gerarRenegociacaoForm.controls['quantidadeParcela'].disable();
    this.gerarRenegociacaoForm.controls['periodicidade'].disable();
    this.gerarRenegociacaoForm.controls['numeroDiaUtil'].disable();
    this.gerarRenegociacaoForm.controls['percentualJuros'].disable();
    this.gerarRenegociacaoForm.controls['percentualMulta'].disable();
    this.gerarRenegociacaoForm.controls['dataPrimeiroVencimento'].disable();
    this.gerarRenegociacaoForm.controls['manterDiaVencimento'].disable();
    this.gerarRenegociacaoForm.controls['diaUtil'].disable();
    this.gerarRenegociacaoForm.controls['ultimoDiaMes'].disable();
    this.gerarRenegociacaoForm.controls['posterga'].disable();
    this.gerarRenegociacaoForm.controls['antecipa'].disable();
    this.gerarRenegociacaoForm.controls['sabadoUtil'].disable();
    this.gerarRenegociacaoForm.controls['domingoUtil'].disable();
    
    this.gerarRenegociacaoForm.controls['grupoEmpresaId'].disable();
    this.gerarRenegociacaoForm.controls['empresaId'].disable();
    this.gerarRenegociacaoForm.controls['valorDesconto'].disable();

    this.renegociacaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      () => this.errors);


    this.data = [];


  }

  obterRenegociacao(id: string) {
    this.renegociacaoService.obterRenegociacao(id)
      .subscribe(
      renegociacao => this.preencherFormGerarRenegociacao(renegociacao),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormGerarRenegociacao(renegociacao: Renegociacao): void {

    this.renegociacao = renegociacao;
console.log(this.renegociacao);

    for (let i = 0; this.renegociacao.renegociacaoParcela.length > i; i++) {
      if (this.renegociacao.renegociacaoParcela[i].parcela != null) {
        this.renegociacaoComponent.Parcelas.push(this.renegociacao.renegociacaoParcela[i].parcela);
      }
    }


    this.titulo = new Titulo();
    this.titulo = this.renegociacao.titulo;
    this.renegociacaoComponent.ParcelasRenegociadas = [];

    for (let i = 0; this.titulo.parcela.length > i; i++) {
        this.renegociacaoComponent.ParcelasRenegociadas.push( this.titulo.parcela[i]);
    }


    this.gerarRenegociacaoForm.patchValue({
      grupoEmpresaId: this.renegociacao.grupoEmpresaId,
      empresaId: this.renegociacao.empresaId,
      valorAbono: this.renegociacao.valorAbono,
      valorAcrescimo: this.renegociacao.valorAcrescimo,
      observacao: this.renegociacao.observacao,
      configuracaoPagamentoId: this.renegociacao.configuracaoPagamentoId,
      contaCorrenteId: this.renegociacao.contaCorrenteId,
      descontoId: this.renegociacao.descontoId,
      tipoCobrancaId: this.renegociacao.tipoCobrancaId,
      dataRenegociacao: this.renegociacao.dataRenegociacao,
      clienteId: this.renegociacao.clienteId,
      fornecedorId: this.renegociacao.fornecedorId,
      quantidadeParcela: this.renegociacao.quantidadeParcela,
      periodicidade: this.renegociacao.periodicidade,
      numeroDiaUtil: this.renegociacao.numeroDiaUtil,
      percentualJuros: this.renegociacao.percentualJuros,
      percentualMulta: this.renegociacao.percentualMulta,
      dataPrimeiroVencimento: this.renegociacao.dataPrimeiroVencimento,
      manterDiaVencimento: this.renegociacao.manterDiaVencimento,
      diaUtil: this.renegociacao.diaUtil,
      ultimoDiaMes: this.renegociacao.ultimoDiaMes,
      posterga: this.renegociacao.posterga,
      antecipa: this.renegociacao.antecipa,
      sabadoUtil: this.renegociacao.sabadoUtil,
      domingoUtil: this.renegociacao.domingoUtil
    });
  }

  finalizarRenegociacao(): void {

    this.renegociacao.renegociacaoParcela = new Array();

    for (let i = 0; this.renegociacaoComponent.Parcelas.length > i; i++) {
      let renegociacaoParcela = new RenegociacaoParcela();

      renegociacaoParcela.empresaId = this.renegociacao.empresaId;
      renegociacaoParcela.grupoEmpresaId = this.renegociacao.empresaId;
      renegociacaoParcela.parcelaId = this.renegociacaoComponent.Parcelas[i].id;


      this.renegociacao.renegociacaoParcela.push(renegociacaoParcela);

      this.renegociacaoComponent.Parcelas[i].situacaoId = 4;
      this.renegociacaoComponent.Parcelas[i].situacao = 'REN';
    }

    if (this.natureza == 'receber') {
      this.titulo.naturezaId = 1;
      this.titulo.fornecedorId = null;
      this.renegociacao.naturezaId = 1;
      this.renegociacao.fornecedorId = null;
    } else {
      this.titulo.naturezaId = 2;
      this.titulo.clienteId = null;
      this.renegociacao.naturezaId = 2;
      this.renegociacao.clienteId = null;
    }
    this.titulo.tipoDocumentoId = '1';
    this.titulo.origemId = '1';
    this.titulo.documento = "REN-" + this.renegociacaoComponent.Parcelas[0].documento;
    this.titulo.valorRetencoes = 0;

    let date = new Date();
    let dataAtual = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString();
    this.titulo.dataEmissao = dataAtual;

    this.busy = this.renegociacaoService.AdicionarRenegociacao(this.renegociacao)
      .subscribe(result => {

        this.busy = this.renegociacaoService.AtualizarSituacaoParcela(this.renegociacaoComponent.Parcelas)
          .subscribe(result => {

            this.busy = this.renegociacaoService.AdicionarTitulo(this.titulo)
              .subscribe(result => {


                this.swal.showSwalSuccess('Renegociação concluída com Sucesso!');


                if (this.natureza == "receber") {
                  this.router.navigate(['renegociacao/lista/receber']);
                } else if (this.natureza == "pagar") {
                  this.router.navigate(['renegociacao/lista/pagar']);
                }



              })

          })

      }
      )
  }

  gerarRenegociacao(): void {

    console.log("Form: ");
    console.log(this.gerarRenegociacaoForm.value);


    if (this.gerarRenegociacaoForm.dirty /*&& this.gerarRenegociacaoForm.valid*/) {
      let p = Object.assign({}, this.renegociacao, this.gerarRenegociacaoForm.value);

      console.log("Entrou: ");
      console.log(p);

      this.renegociacao = p;
      this.renegociacao.dataRenegociacao = this.renegociacao.dataRenegociacao;


      this.renegociacao.valorRenegociacao = 0;
      this.renegociacao.valorRenegociacao = 0;
      this.renegociacao.valorRenegociacao = 0;

      if (this.natureza == 'receber') {
        this.renegociacao.naturezaId = 1;
        this.renegociacao.fornecedorId = null;
      } else {
        this.renegociacao.naturezaId = 2;
        this.renegociacao.clienteId = null;
      }


      for (let i = 0; this.renegociacaoComponent.Parcelas.length > i; i++) {
        this.renegociacao.valorRenegociacao = this.renegociacao.valorRenegociacao + this.renegociacaoComponent.Parcelas[i].valorLiquido;
        this.renegociacao.empresaId = this.renegociacaoComponent.Parcelas[i].empresaId;
        this.renegociacao.grupoEmpresaId = this.renegociacaoComponent.Parcelas[i].empresaId;
      }




      this.busy = this.renegociacaoService.GerarTituloParcelaAngular(this.renegociacao)
        .subscribe(result => {

          this.titulo = result;
          console.log("TITULO: ");
          console.log(this.titulo);
        }
        )


      console.log("Entrou2: ");
      console.log(this.renegociacao);
    }
  }



  public toasterMensagem(msg) {
    this.toastr.success(msg, 'Sucesso', { dismiss: 'controlled' })
      .then((toast: Toast) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);
        }, 2500);
      });
  }


  selecionarParcelas() {
    if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
    }
    else {
      this.parcelas = this.selectedEntities;
    }

  }


  onItemSelect(item: any) {
    console.log('onItemSelect')
    console.log(item);
    this.selectedItems.push(item)
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log('OnItemDeSelect');
    console.log(item);
    for (var i = 0; i < this.selectedItems.length; i++) {
      if (item.id == this.selectedItems[i].id)
        this.selectedItems.splice(i, 1)
    }


    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log('onDeSelectAll')
    console.log(items);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  public setSelectedEntities($event: any) {
    this.selectedEntities = $event;
  }


  public setarValorsrcImagem(caminho: string): void {

    this.srcImagem = caminho + '.png';

    console.log(this.srcImagem)
  }

  public showModal(modal: string): void {
    if (modal == 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    }
    else if (modal == 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }


  editarParcela(parcela) {
    this.renegociacaoComponent.ParcelaRenegociada = parcela;
    this.showModal('modalEditar');
  }

  cancelar() {
    if (this.natureza == "receber") {
      this.router.navigate(['renegociacao/lista/receber']);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['renegociacao/lista/pagar']);
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.renegociacaoComponent.renegociacao.empresaId = undefined;
    this.empresas = [];

    this.renegociacaoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

  }

  ConsultaSelectEmpresa(idEmpresa) {

    this.renegociacaoComponent.renegociacao.empresaId = idEmpresa;

    this.contaCorrentes = [];
    this.renegociacaoService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

    this.configuracaoPagamentos = [];
    this.renegociacaoService.obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa)
      .subscribe(configuracaoPagamentos => {
        this.configuracaoPagamentos = configuracaoPagamentos
      },
        error => this.errors);

    this.descontos = [];
    this.renegociacaoService.obterTodosDescontoPorEmpresa(idEmpresa)
      .subscribe(descontos => {
        this.descontos = descontos
      },
        error => this.errors);


  }

  onChange_Desconto(DescID) {

    this.renegociacaoService.obterDescontoPorId(DescID)
      .subscribe(
        result => {

          if (result.percentualValor == '$') {
            this.percOrValor = '$';
          } else {
            this.percOrValor = '%';
          }
          this.gerarRenegociacaoForm.get('valorDesconto').setValue(result.valorAplicar);
          //this.calcValorDesconto();
        },
        error => {
          this.errors;
        });
  }

}

import { Component, OnInit, ViewContainerRef, Input, ElementRef, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControlName } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { DateUtils } from '../../../utils/date.utils';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { Subscription, Observable } from 'rxjs';
import { Parcela, ConfiguracaoPagamento, ContaCorrente } from '../../titulo/models/titulo';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
//import { ToastsManager, Toast } from 'ng2-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { UtilService } from '../../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaixaPagarReceber, FiltroBaixa, ParcelasPagasBaixa, HistoricoPadrao } from '../models/tituloparcelabaixa';
import { Cliente } from '../../../cadastros/cliente/models/cliente';
import { Fornecedor } from '../../../cadastros/fornecedor/models/fornecedor';
import { ChequeFolha } from '../../../cadastros/chequeproprio/models/chequeproprio';
import { ToastsManager, Toast } from '../../../../../node_modules/ng2-toastr';
import { Mascara } from '../../../cadastros/mascara/models/mascara';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-baixa',
  templateUrl: './adicionar-baixa.component.html',
  styleUrls: ['./adicionar-baixa.component.css'],
  providers: [DateUtils]
})
export class AdicionarBaixaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public filtroBaixaForm: FormGroup;
  public gerarBaixaForm: FormGroup;
  public filtroBaixa: FiltroBaixa;
  public baixa: BaixaPagarReceber;
  //public dataAtual: string;

  busy: Subscription;
  public sub: Subscription;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  parcelas: Parcela[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  contaCorrentes: ContaCorrente[];
  habilitar: boolean = false;

  public historicoPadraos: HistoricoPadrao[];
  public configuracaoPagamentos: ConfiguracaoPagamento[];

  public natureza: string = "";

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  swal: SweetAlertAdviceService;
  public innerHtml: SafeHtml;

  public myDatePickerOptions = DateUtils.getMyDatePickerDefaultOptions();

  displayMessage: { [key: string]: string } = {};

  public data: any[];
  public codMask = [];

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
    private tituloParcelaBaixaService: TituloParcelaBaixaService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    public tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
    private _utilService: UtilService,
    private renderer: Renderer,
    private _maskService: MaskService,) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      condigo: {
        required: 'Codigo é requerido.'
      },
      data: {
        required: 'Data Baixa é requerida.'
      },
      contaCorrenteId: {
        required: 'Conta Caixa é requerido.'
      },
      valor: {
        required: 'Valor Baixa é requerido.'
      }

    };


    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroBaixa = new FiltroBaixa();
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
    );

    this.gerarBaixaForm = this.fb.group({
      empresaId: [0, [Validators.required]],
      grupoEmpresaId: [0, [Validators.required]],
      contaCorrenteId: [0, [Validators.required]],
      valorPago: [],
      clienteId: 0,
      fornecedorId: 0,
      codigo: ['', [Validators.required]],
      data: ['', [Validators.required]],
      valor: [0, [Validators.required]],
      observacao: '',
      flagPagarReceber: 'N',
      excluido: 'N',

    });

    this.tituloParcelaBaixaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => { });

    this.data = [];
    this.tituloParcelaBaixaComponent.Habilitar = false;
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.gerarBaixaForm);
    });
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'BaixaPagarReceber', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.gerarBaixaForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.gerarBaixaForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.gerarBaixaForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.tituloParcelaBaixaComponent.BaixaPagarReceber.empresaId = undefined;
    this.empresas = [];
    this.tituloParcelaBaixaService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);

  }

  valorPagoParcelaParcial(event) {

    for (var i = 0; i < this.tituloParcelaBaixaComponent.Parcelas.length; i++) {

      if (this.tituloParcelaBaixaComponent.Parcelas[i].id == event.target.id) {
        let valor = (this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquido - this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquidado);

        if (valor >= parseFloat(event.target.value)) {

          for (let i = 0; this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.length > 0; i++) {
            this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.splice(i, 1);
          }

          this.tituloParcelaBaixaComponent.Parcelas[i].valorPago = parseFloat(event.target.value);

        } else {
          this.swal.showSwalErro("O valor Pago não pode ser maior que o Valor Liquido.");

          event.target.value = '';
        }
      }
    }
  }

  // convertValor(event) {
  //   console.log("Convert valor");
  //   var strVal = event.target.value.replace(/\.,/g, '');
  //   var intVal = parseInt(strVal);
  //   var decVal = intVal / 100;
  //   var newVal = decVal.toLocaleString('de-DE');
  //   var newVal = (parseInt(event.target.value.replace(/\.,/g, '')) / 100).toLocaleString('de-DE');
  //   event.target.value = newVal;
  // }

  async ConsultaSelectEmpresa(idEmpresa): Promise<void> {

    this.tituloParcelaBaixaComponent.BaixaPagarReceber.empresaId = idEmpresa;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'BaixaPagarReceber', this.grupoEmpresaId, idEmpresa);

    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === 'S')
        {
            this.gerarBaixaForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {   this.gerarBaixaForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
      this.gerarBaixaForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
    }


    this.historicoPadraos = [];
    this.tituloParcelaBaixaService.obterTodosHistoricoPadraoPorEmpresa(idEmpresa)
      .subscribe(historicoPadraos => {
        this.historicoPadraos = historicoPadraos
      },
        () => { });

    this.contaCorrentes = [];
    this.tituloParcelaBaixaService.obterTodosContaCaixaPorEmpresaId(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        () => { });

  }

  async gerarBaixa(): Promise<void> {

    if (this.gerarBaixaForm.dirty && this.gerarBaixaForm.valid) {

      let p = Object.assign({}, this.baixa, this.gerarBaixaForm.value);

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
          //#region gerar baixa

      let valorTotal = 0;
      let valorPagoTotal = 0;

      for (var i = 0; this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.length > i; i++) {
        valorTotal += this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos[i].valor;
      }

      for (var i = 0; this.tituloParcelaBaixaComponent.Parcelas.length > i; i++) {
        valorPagoTotal += this.tituloParcelaBaixaComponent.Parcelas[i].valorPago;
      }

      if (valorTotal == valorPagoTotal) {
        if (this.natureza == 'receber') {
          p.flagPagarReceber = 'R';
          p.fornecedorId = null;
        } else {
          p.flagPagarReceber = 'P';
          p.clienteId = null;
        }

        p.parcelasPagasBaixa = new Array();

        for (let i = 0; i < this.tituloParcelaBaixaComponent.Parcelas.length; i++) {
          let parcelaBaixa = new ParcelasPagasBaixa();
          
          parcelaBaixa.parcelaId = this.tituloParcelaBaixaComponent.Parcelas[i].id;
          parcelaBaixa.percentualJuros = this.tituloParcelaBaixaComponent.Parcelas[i].percentualJuros;
          //parcelaBaixa.valorJuros = this.tituloParcelaBaixaComponent.Parcelas[i].valorJuros;
          parcelaBaixa.percentualMulta = this.tituloParcelaBaixaComponent.Parcelas[i].percentualMulta;
          //parcelaBaixa.valorMulta = this.tituloParcelaBaixaComponent.Parcelas[i].valorMulta;
          //parcelaBaixa.percentualDesconto = this.tituloParcelaBaixaComponent.Parcelas[i].parcelaDesconto[i].percentualDesconto;
          parcelaBaixa.valorDesconto = this.tituloParcelaBaixaComponent.Parcelas[i].valorDesconto;
          parcelaBaixa.valorPago = this.tituloParcelaBaixaComponent.Parcelas[i].valorPago;
          parcelaBaixa.valorParcela = this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquido;
          parcelaBaixa.empresaId = p.empresaId;
          parcelaBaixa.grupoEmpresaId = p.grupoEmpresaId;
          parcelaBaixa.excluido = 'N';
          //parcelaBaixa.natureza = 
          p.parcelasPagasBaixa.push(parcelaBaixa);
        }

        p.baixaPagarReceberPgto = this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos;
        this.tituloParcelaBaixaComponent.baixaPagarReceberPgto = p;

        for (let i = 0; p.baixaPagarReceberPgto.length > i; i++) {
          p.valor = p.valor + p.baixaPagarReceberPgto[i].valor;
          p.baixaPagarReceberPgto[i].id = 0;
          p.baixaPagarReceberPgto[i].HistoricoPadrao = null;
          p.baixaPagarReceberPgto[i].ContaCorrente = null;
          p.baixaPagarReceberPgto[i].ControleCartao = null;

          if (p.baixaPagarReceberPgto[i].chequeFolha != null && p.baixaPagarReceberPgto[i].chequeFolha != "") {
            let chequeFolha = new ChequeFolha();

            chequeFolha = p.baixaPagarReceberPgto[i].chequeFolha;

            let chequeF = await this.tituloParcelaBaixaService.adicionarChequeFolha(chequeFolha);
            p.baixaPagarReceberPgto[i].chequeFolhaId = chequeF.id;
            p.baixaPagarReceberPgto[i].chequeFolha = null;

          };

        };
        //this.baixa.parcelasPagasBaixa
        this.baixa = p;

        this.tituloParcelaBaixaService.adicionarBaixaPagarReceber(this.baixa)
          .subscribe(() => {
            this.swal.showSwalSuccess('Baixa concluída com Sucesso!');

            if (this.natureza == "receber") {
              this.router.navigate(['tituloparcelabaixa/lista/receber']);
            } else if (this.natureza == "pagar") {
              this.router.navigate(['tituloparcelabaixa/lista/pagar']);
            }
          });
      } else {
        this.swal.showSwalErro("O valor é abaixo do valor total.");
      }

      //#endregion
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let baixaPagarReceber = await this.tituloParcelaBaixaService.ObterBaixaPagarReceberPorCodigo(codigo).toPromise();

          if(baixaPagarReceber != null)
          {
              var self = this;
                      this.swal.showSwalErrorCodigo('Informe um código que não esteja cadastrado!', function (isConfirmed) {
                          if (isConfirmed) {
                            self.limparCampoCodigo();
                          }
                          else {
                            
                          }
                      });
          }
          else
          {
            //#region gerar baixa

      let valorTotal = 0;
      let valorPagoTotal = 0;

      for (var i = 0; this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos.length > i; i++) {
        valorTotal += this.tituloParcelaBaixaComponent.BaixaPagarReceberPgtos[i].valor;
      }

      for (var i = 0; this.tituloParcelaBaixaComponent.Parcelas.length > i; i++) {
        valorPagoTotal += this.tituloParcelaBaixaComponent.Parcelas[i].valorPago;
      }

      if (valorTotal == valorPagoTotal) {
        if (this.natureza == 'receber') {
          p.flagPagarReceber = 'R';
          p.fornecedorId = null;
        } else {
          p.flagPagarReceber = 'P';
          p.clienteId = null;
        }

        p.parcelasPagasBaixa = new Array();

        for (let i = 0; i < this.tituloParcelaBaixaComponent.Parcelas.length; i++) {
          let parcelaBaixa = new ParcelasPagasBaixa();
          
          parcelaBaixa.parcelaId = this.tituloParcelaBaixaComponent.Parcelas[i].id;
          parcelaBaixa.percentualJuros = this.tituloParcelaBaixaComponent.Parcelas[i].percentualJuros;
          //parcelaBaixa.valorJuros = this.tituloParcelaBaixaComponent.Parcelas[i].valorJuros;
          parcelaBaixa.percentualMulta = this.tituloParcelaBaixaComponent.Parcelas[i].percentualMulta;
          //parcelaBaixa.valorMulta = this.tituloParcelaBaixaComponent.Parcelas[i].valorMulta;
          //parcelaBaixa.percentualDesconto = this.tituloParcelaBaixaComponent.Parcelas[i].parcelaDesconto[i].percentualDesconto;
          parcelaBaixa.valorDesconto = this.tituloParcelaBaixaComponent.Parcelas[i].valorDesconto;
          parcelaBaixa.valorPago = this.tituloParcelaBaixaComponent.Parcelas[i].valorPago;
          parcelaBaixa.valorParcela = this.tituloParcelaBaixaComponent.Parcelas[i].valorLiquido;
          parcelaBaixa.empresaId = p.empresaId;
          parcelaBaixa.grupoEmpresaId = p.grupoEmpresaId;
          parcelaBaixa.excluido = 'N';
          //parcelaBaixa.natureza = 
          p.parcelasPagasBaixa.push(parcelaBaixa);
        }

        p.baixaPagarReceberPgto = this.tituloParcelaBaixaComponent.baixaPagarReceberPgtos;
        this.tituloParcelaBaixaComponent.baixaPagarReceberPgto = p;

        for (let i = 0; p.baixaPagarReceberPgto.length > i; i++) {
          p.valor = p.valor + p.baixaPagarReceberPgto[i].valor;
          p.baixaPagarReceberPgto[i].id = 0;
          p.baixaPagarReceberPgto[i].HistoricoPadrao = null;
          p.baixaPagarReceberPgto[i].ContaCorrente = null;
          p.baixaPagarReceberPgto[i].ControleCartao = null;

          if (p.baixaPagarReceberPgto[i].chequeFolha != null && p.baixaPagarReceberPgto[i].chequeFolha != "") {
            let chequeFolha = new ChequeFolha();

            chequeFolha = p.baixaPagarReceberPgto[i].chequeFolha;

            let chequeF = await this.tituloParcelaBaixaService.adicionarChequeFolha(chequeFolha);
            p.baixaPagarReceberPgto[i].chequeFolhaId = chequeF.id;
            p.baixaPagarReceberPgto[i].chequeFolha = null;

          };

        };
        //this.baixa.parcelasPagasBaixa
        this.baixa = p;

        this.tituloParcelaBaixaService.adicionarBaixaPagarReceber(this.baixa)
          .subscribe(() => {
            this.swal.showSwalSuccess('Baixa concluída com Sucesso!');

            if (this.natureza == "receber") {
              this.router.navigate(['tituloparcelabaixa/lista/receber']);
            } else if (this.natureza == "pagar") {
              this.router.navigate(['tituloparcelabaixa/lista/pagar']);
            }
          });
      } else {
        this.swal.showSwalErro("O valor é abaixo do valor total.");
      }

      //#endregion
          }
      }

      

    } else {
      this.swal.showSwalErro("Preencha os campos obrigatórios antes de Gerar Baixa");
    }
  }

  limparCampoCodigo(){
    this.gerarBaixaForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  public toasterMensagem(msg) {
    // this.toastr.success(msg, 'Sucesso', { dismiss: 'controlled' })
    //   .then((toast: Toast) => {
    //     setTimeout(() => {
    //       this.toastr.dismissToast(toast);

    //     }, 2500);
    //   });
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item)
  }

  OnItemDeSelect(item: any) {
    for (var i = 0; i < this.selectedItems.length; i++) {
      if (item.id == this.selectedItems[i].id)
        this.selectedItems.splice(i, 1)
    }
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

  ngOnDestroy() {
    // this.busy.unsubscribe();
  }

  public setarValorsrcImagem(caminho: string): void {
    this.srcImagem = caminho + '.png';
  }

  public showModal(modal: string): void {
    if (this.tituloParcelaBaixaComponent.BaixaPagarReceber.empresaId != undefined
      && this.tituloParcelaBaixaComponent.BaixaPagarReceber.grupoEmpresaId != undefined) {
      if (modal == 'modalEditar') {
        this.modalEditVisible = true;
        this.modalAddVisible = false;
      }
      else if (modal == 'modalAdicionar') {
        this.modalEditVisible = false;
        this.modalAddVisible = true;
      }
    } else {
      this.swal.showSwalErro("Grupo e Empresa, é requerido.");
    }
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
    console.log("Valor A Baixar: " + this.baixa.valor);
  }

  cancelar() {
    if (this.natureza == "receber") {
      this.router.navigate(['tituloparcelabaixa/lista/receber']);
    } else if (this.natureza == "pagar") {
      this.router.navigate(['tituloparcelabaixa/lista/pagar']);
    }
  }

}


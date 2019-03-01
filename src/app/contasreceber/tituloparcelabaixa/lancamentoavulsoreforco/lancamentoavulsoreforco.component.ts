import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { MaskService } from '../../../services/mask.service';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { MovimentoConta, HistoricoPadrao, MovimentoContaCentro, TipoOperacao } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { UtilService } from '../../../services/util.service';
import { ContaCorrente } from '../../../cadastros/contacorrente/models/contacorrente';
import { Mascara } from '../../../cadastros/mascara/models/mascara';

@Component({
    selector: 'app-lancamentoavulsoreforco',
    templateUrl: './lancamentoavulsoreforco.component.html',
    styleUrls: ['./lancamentoavulsoreforco.component.css'],
    providers: [MaskService]
})
export class LancamentoAvulsoReforcoComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @Input() visible: boolean;
    @Input() closable = true;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('focusCodigo') focusCodigo: ElementRef;

    public maskValid: boolean;
    public mascSequencial: Mascara;

    public grupoEmpresaId: number;

    public movimentoConta: MovimentoConta;

    public movimentoContaForm: FormGroup;

    swal: SweetAlertAdviceService;
    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public historicosPadrao: HistoricoPadrao[];
    public contasCorrente: ContaCorrente[];
    public tiposOperacao: TipoOperacao[];

    public carregarMovimentoContaCentro: boolean = true;

    public centroTotalizado: boolean = false;

    public errors: any[] = [];
    public codMask = [];

    public dataAtual;


    constructor(
        private tituloParcelaBaixaService: TituloParcelaBaixaService,
        private fb: FormBuilder,
        private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
        private _maskService: MaskService,
        private _utilService: UtilService,
        private renderer: Renderer) {

        this.validationMessages = {
            grupoEmpresaId: {
                required: 'Informe o Grupo'
            },
            empresaId: {
                required: 'Informe a Empresa'
            },
            contaCorrenteId: {
                required: 'Informe a Conta'
            },
            valor: {
                required: 'Informe o Valor',
                min: 'Valor deve ser maior que 0'
            },
            codigo: {
                required: 'Informe o Código'
            }
        };

        this.maskValid = true;
        this.mascSequencial = new Mascara();
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.movimentoConta = new MovimentoConta();
        this.swal = new SweetAlertAdviceService();

    }

    ngOnInit() {
        let date = new Date();
        let mes;
        let dia;
        if ((date.getMonth() + 1) > 0 && (date.getMonth() + 1) < 10)
            mes = 0 + (date.getMonth() + 1).toString();
        else
            mes = (date.getMonth() + 1).toString();

        if ((date.getDate() > 0) && (date.getDate() < 10))
            dia = 0 + (date.getDate().toString());
        else
            dia = (date.getDate()).toString()

        this.dataAtual = date.getFullYear().toString() + "-" + mes + "-" + dia;

        this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro = [];

        this.movimentoContaForm = this.fb.group({
            empresaId: ['', [Validators.required]],
            grupoEmpresaId: ['', [Validators.required]],
            documento: '',
            codigo: ['', [Validators.required]],
            contaCorrenteId: ['', [Validators.required]],
            siglaDebitoCredito: 'D',
            valor: [0.0, [Validators.required, Validators.min(0.01)]],
            dataEmissao: this._utilService.ToDate(this.dataAtual),
            dataCompensacao: this._utilService.ToDate(this.dataAtual),
            siglaTipoOperacao: 'AV',
            historicoPadraoId: '',
            descricaoHistoricoPadrao: '',
            excluido: 'N'
        })

        this.tituloParcelaBaixaService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
            () => this.errors);

        this.tiposOperacao = [
            {
                "id": "ABE",
                "valor": "Abertura"
            },
            {
                "id": "REC",
                "valor": "Recebimento"
            },
            {
                "id": "SAN",
                "valor": "Sangria"
            },
            {
                "id": "REF",
                "valor": "Reforço"
            },
            {
                "id": "AV",
                "valor": "Avulso"
            },
            {
                "id": "FEC",
                "valor": "Fechamento"
            },
            {
                "id": "SAL",
                "valor": "Saldo"
            },
            {
                "id": "MOV",
                "valor": "Movimento"
            },
            {
                "id": "PAG",
                "valor": "Pagamento"
            },
            {
                "id": "CNAB",
                "valor": "Recebimento CNAB"
            },
            {
                "id": "CHQ",
                "valor": "Cheque"
            },
            {
                "id": "ACE",
                "valor": "Acerto de Contas"
            },
            {
                "id": "CART",
                "valor": "Cartão de Crédito/Débito"
            },
            {
                "id": "DEPCC",
                "valor": "Depósito em Conta Corrente"
            },
            {
                "id": "TRANSF",
                "valor": "Transferência"
            },
            {
                "id": "DEPO",
                "valor": "Depósito de Cheque"
            },
            {
                "id": "BXCART",
                "valor": "Baixa de Cartão de Crédito/Débito"
            },
            {
                "id": "SANCHQ",
                "valor": "Sangria de Cheque"
            },
            {
                "id": "SANCART",
                "valor": "Sangria de Cartão de Crédito/Débito"
            },
            {
                "id": "REAP",
                "valor": "Reapresentação de Cheque"
            },
            {
                "id": "PDEV",
                "valor": "Primeira Devolução de Cheque"
            },
            {
                "id": "SDEV",
                "valor": "Segunda Devolução de Cheque"
            },
            {
                "id": "ENTR",
                "valor": "Entrada de Cheque"
            },
            {
                "id": "CANC",
                "valor": "Cancelamento de Cheque"
            },
            {
                "id": "LANC",
                "valor": "Lançamento Manual"
            }
        ];

    }

    close() {
        console.log("Close lancamentos");
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        Observable.merge(...controlBlurs).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.movimentoContaForm);
        });

    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

    async adicionarMovimentoConta(): Promise<void> {
        if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length > 0) {
            let movimentoContaCentroCusto = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null);
            // movimentoContaCentroCusto.filter(c => c.centroCusto != null);
            var percentual = 0;

            for (var i = 0; i < movimentoContaCentroCusto.length; i++) {
                percentual = percentual + movimentoContaCentroCusto[i].percentual;
            }

            if (movimentoContaCentroCusto.length > 0 && percentual < 100) {
                this.centroTotalizado = true;
                //   this.movimentoContaForm.status = INVALID;
            }
            else
                this.centroTotalizado = false;

        }

        if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length > 0 && !this.centroTotalizado) {
            let movimentoContaCentroResultado = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null);
            var percentual = 0;

            for (var i = 0; i < movimentoContaCentroResultado.length; i++) {
                percentual = percentual + movimentoContaCentroResultado[i].percentual;
            }

            if (movimentoContaCentroResultado.length > 0 && percentual < 100) {
                this.centroTotalizado = true;
            }
            else
                this.centroTotalizado = false;

        }
        if (this.movimentoContaForm.dirty && this.movimentoContaForm.valid && !this.centroTotalizado) {

            let p = Object.assign({}, this.movimentoConta, this.movimentoContaForm.value);

            p.movimentoContaCentro = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro;
            for (var i = 0; i < p.movimentoContaCentro.length; i++) {
                p.movimentoContaCentro[i].centroCusto = null;
                p.movimentoContaCentro[i].centroResultado = null;
            }

            p.descricaoHistoricoPadrao = this.movimentoConta.descricaoHistoricoPadrao;

            if(this.mascSequencial == null){
                this.mascSequencial = new Mascara();
                this.mascSequencial.sequencial = 'N';
            }

            if(this.mascSequencial.sequencial === 'S')
            {
                this.tituloParcelaBaixaService.adicionarMovimentoConta(p)
                .subscribe(
                    result => {
                        this.movimentoConta = result;

                        //adiciona movimento para o caixa principal
                        if (this.movimentoConta.siglaDebitoCredito == 'D') {
                            p.siglaDebitoCredito = 'C';
                            p.siglaTipoOperacao = 'AV';
                            p.descricaoHistoricoPadrao = 'Lançamento Avulso';
                            p.codigo = null;
                            p.documento = null;

                        }
                        else {
                            p.siglaDebitoCredito = 'D';
                            p.siglaTipoOperacao = 'REF';
                            p.descricaoHistoricoPadrao = 'Lançamento Reforço';
                            p.codigo = null;
                            p.documento = null;
                            p.contaCorrenteId = null;
                        }

                        this.tituloParcelaBaixaService.adicionarMovimentoContaCaixaPrincipal(p)
                            .subscribe(
                                () => {
                                },
                                error => {
                                    this.onError(error)
                                }
                            )

                        this.tituloParcelaBaixaComponent.MovimentoConta = this.movimentoConta;
                        this.swal.showSwalSuccess('Lançamento Adicionado com Sucesso!');
                        this.close();
                    },
                    error => {
                        this.onError(error)
                    })
            }
            else
            {
                let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
                let movimentacaoConta = await this.tituloParcelaBaixaService.ObterMovimentoContaPorCodigo(codigo).toPromise();

                if(movimentacaoConta != null)
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
                    this.tituloParcelaBaixaService.adicionarMovimentoConta(p)
                    .subscribe(
                        result => {
                            this.movimentoConta = result;
    
                            //adiciona movimento para o caixa principal
                            if (this.movimentoConta.siglaDebitoCredito == 'D') {
                                p.siglaDebitoCredito = 'C';
                                p.siglaTipoOperacao = 'AV';
                                p.descricaoHistoricoPadrao = 'Lançamento Avulso';
                                p.codigo = null;
                                p.documento = null;
    
                            }
                            else {
                                p.siglaDebitoCredito = 'D';
                                p.siglaTipoOperacao = 'REF';
                                p.descricaoHistoricoPadrao = 'Lançamento Reforço';
                                p.codigo = null;
                                p.documento = null;
                                p.contaCorrenteId = null;
                            }
    
                            this.tituloParcelaBaixaService.adicionarMovimentoContaCaixaPrincipal(p)
                                .subscribe(
                                    () => {
                                    },
                                    error => {
                                        this.onError(error)
                                    }
                                )
    
                            this.tituloParcelaBaixaComponent.MovimentoConta = this.movimentoConta;
                            this.swal.showSwalSuccess('Lançamento Adicionado com Sucesso!');
                            this.close();
                        },
                        error => {
                            this.onError(error)
                        })
                }

            }
            
        }

    }

    preencherHistorico(id) {
        this.carregarMovimentoContaCentro = false;

        this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro = new Array();
        this.tituloParcelaBaixaService.obterHistoricoPadraoCentroPorId(id)
            .subscribe(
                result => {
                    let movimentoContacentro;
                    for (var i = 0; i < result.length; i++) {
                        movimentoContacentro = new MovimentoContaCentro();
                        movimentoContacentro.id = i;
                        movimentoContacentro.centroCusto = result[i].centroCusto;
                        movimentoContacentro.centroCustoId = result[i].centroCustoId;
                        movimentoContacentro.centroResultado = result[i].centroResultado;
                        movimentoContacentro.centroResultadoId = result[i].centroResultadoId;
                        movimentoContacentro.percentual = result[i].percentual;
                        //movimentoContacentro.movimentoContaId = 0;

                        this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.push(movimentoContacentro);
                    }
                    this.carregarMovimentoContaCentro = true;

                });

        for (let i = 0; this.historicosPadrao.length; i++) {
            if (this.historicosPadrao[i].id == id) {
                this.movimentoConta.descricaoHistoricoPadrao = this.historicosPadrao[i].descricao;
            }
        }
    }

    async ConsultaEmpresa(idGrupo): Promise<void> {

        this.grupoEmpresaId = idGrupo;
        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'MovimentoConta', this.grupoEmpresaId);

        if(this.mascSequencial != null)
        {   
            if(this.mascSequencial.sequencial === "S")
            {
                this.movimentoContaForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {
                this.movimentoContaForm.controls['codigo'].setValue('');
                this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
                this.maskValid = true;
            }

        }
        else
        {
            this.movimentoContaForm.controls['codigo'].setValue('');
            this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
            this.maskValid = true;
        }

        this.empresas = [];
        this.tituloParcelaBaixaService.obterTodosEmpresaPorId(idGrupo)
          .subscribe(empresas => {
            this.empresas = empresas
          },
            () => { });
      }


      async ConsultaSelectEmpresa(idEmpresa): Promise<void> {

        this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'MovimentoConta', this.grupoEmpresaId, idEmpresa);
        
        if(this.mascSequencial != null)
        {
            if(this.mascSequencial.sequencial === 'S')
            {
                this.movimentoContaForm.controls['codigo'].setValue('');
                this.maskValid = false;
            }
            else
            {   
                this.movimentoContaForm.controls['codigo'].setValue('');
                this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
                this.maskValid = true;
            }
        }
        else
        {
          this.movimentoContaForm.controls['codigo'].setValue('');
          this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
          this.maskValid = true;
          
        }

        this.historicosPadrao = [];
        this.tituloParcelaBaixaService.obterTodosHistoricoPadraoPorEmpresa(idEmpresa)
          .subscribe(historicoPadraos => {
            this.historicosPadrao = historicoPadraos
          },
            () => {});
    
        this.contasCorrente = [];
        this.tituloParcelaBaixaService.obterTodosContaCaixaPorEmpresaId(idEmpresa)
          .subscribe(contaCorrentes => {
            this.contasCorrente = contaCorrentes
          },
            () => {});
    
      }

    valorSiglaDebitoCredito(tipoOperacao: string) {
        if (tipoOperacao == 'REF')
            this.movimentoContaForm.controls['siglaDebitoCredito'].setValue('C')
        else
            this.movimentoContaForm.controls['siglaDebitoCredito'].setValue('D')
    }

    limparCampoCodigo(){
        this.movimentoContaForm.controls['codigo'].setValue('');
        this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
    }
}

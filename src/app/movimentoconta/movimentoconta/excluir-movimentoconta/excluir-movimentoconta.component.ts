import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Input } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MovimentoConta, HistoricoPadrao, ContaCorrente, MovimentoContaCentro, TipoOperacao } from '../models/movimentoconta';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { MovimentoContaService } from '../movimentoconta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MovimentoContaComponent } from '../movimentoconta.component';
import { ListaMovimentoContaCentroCustoComponent } from '../lista-movimentocontacentrocusto/lista-movimentocontacentrocusto.component';
import { ListaMovimentoContaCentroResultadoComponent } from '../lista-movimentocontacentroresultado/lista-movimentocontacentroresultado.component';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';

@Component({
    selector: 'app-excluir-movimentoconta',
    templateUrl: './excluir-movimentoconta.component.html'
})
export class ExcluirMovimentoContaComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public movimentoConta: MovimentoConta;

    public movimentoContaForm: FormGroup;

    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public historicosPadrao: HistoricoPadrao[];
    public contasCorrente: ContaCorrente[];
    public permiteIncluirEditar: boolean = false;
    public tiposOperacao: TipoOperacao[];
    swal: SweetAlertAdviceService;

    movimentoContaId: number;

    public sub: Subscription;

    public errors: any[] = [];

    public carregarMovimentoContaCentro: boolean = false;

    public removerVisivel: boolean = false;


    constructor(
        private movimentoContaService: MovimentoContaService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private movimentoContaComponent: MovimentoContaComponent,
        private _utilService: UtilService) {

        this.movimentoConta = new MovimentoConta();
        this.swal = new SweetAlertAdviceService();
    }


    ngOnInit(): void {
        this.movimentoContaForm = this.fb.group({
            empresaId: ['', [Validators.required]],
            grupoEmpresaId: ['', [Validators.required]],
            documento: '',
            codigo: ['', [Validators.required]],
            contaCorrenteId: ['', [Validators.required]],
            siglaDebitoCredito: ['', [Validators.required]],
            valor: [0.0, [Validators.required]],
            dataEmissao: ['', [Validators.required]],
            siglaTipoOperacao: '',
            descricaoFornecedor: '',
            historicoPadraoId: '',
            descricaoHistoricoPadrao: '',
            excluido: 'N',
            flagCreditoNaoIdentificado: 'N'
        });

        this.sub = this.route.params.subscribe(
            params => {
                this.movimentoContaId = params['id'];
                this.obterMovimentoConta(this.movimentoContaId);
            }
        )

        this.movimentoContaService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                error => this.errors);

        this.movimentoContaService.obterTodosEmpresa()
            .subscribe(empresas => {
                this.empresas = empresas
            },
                error => this.errors);
        //

        this.movimentoContaService.obterTodosContaCorrenteCaixa()
            .subscribe(contasCorrente => {
                this.contasCorrente = contasCorrente
            },
                error => this.errors);

        this.movimentoContaService.obterTodosHistoricoPadrao()
            .subscribe(historicosPadrao => {
                this.historicosPadrao = historicosPadrao
            },
                error => this.errors);

        // this.movimentoContaService.getTipoOperacao()
        //     .subscribe(tiposOperacao => {
        //         console.log(tiposOperacao)
        //         this.tiposOperacao = tiposOperacao
        //     },
        //         error => this.errors);
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


    obterMovimentoConta(id: number) {
        this.movimentoContaService.obterMovimentoContaPorId(id)
            .subscribe(

                movimentoConta => {
                    this.preencherFormMovimentoConta(movimentoConta);
                    console.log(movimentoConta)
                },

                response => {
                    if (response.status == 404) {
                        this.router.navigate(['404']);
                    }
                });
    }

    preencherFormMovimentoConta(movimentoConta: MovimentoConta): void {

        console.log(movimentoConta)
        this.movimentoConta = movimentoConta;
        this.movimentoContaComponent.MovimentoConta = movimentoConta;
        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = [];

        this.movimentoContaForm.controls['codigo'].disable();

        this.movimentoContaForm.patchValue({
            empresaId: this.movimentoConta.empresaId,
            grupoEmpresaId: this.movimentoConta.grupoEmpresaId,
            documento: this.movimentoConta.documento,
            codigo: this.movimentoConta.codigo,
            contaCorrenteId: this.movimentoConta.contaCorrenteId,
            siglaDebitoCredito: this.movimentoConta.siglaDebitoCredito,
            valor: this.movimentoConta.valor,
            dataEmissao: this._utilService.ToDate(this.movimentoConta.dataEmissao),
            siglaTipoOperacao: this.movimentoConta.siglaTipoOperacao,
            descricaoFornecedor: this.movimentoConta.descricaoFornecedor,
            historicoPadraoId: this.movimentoConta.historicoPadraoId,
            descricaoHistoricoPadrao: this.movimentoConta.descricaoHistoricoPadrao,
            excluido: this.movimentoConta.excluido,
            flagCreditoNaoIdentificado: this.movimentoConta.flagCreditoNaoIdentificado

        });

        this.movimentoContaForm.disable();
        if ((this.movimentoConta.movimentoContaPaiId == null) &&
            (this.movimentoConta.baixaPagarReceberPgtoId == null) &&
            (this.movimentoConta.controleCartaoBaixaId == null) &&
            (this.movimentoConta.controleChequeBaixaId == null))
            this.removerVisivel = true


        this.preencherMovimentoContaCentro();
    }

    preencherMovimentoContaCentro() {
        this.carregarMovimentoContaCentro = false;

        this.movimentoContaService.obterMovimentosContaCentro(this.movimentoContaId.toString())
            .subscribe(
                result => {
                    console.log(result);

                    for (var i = 0; i < result.length; i++) {
                        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.push(result[i]);
                    }
                    this.carregarMovimentoContaCentro = true;




                }
            )


    }

    ngAfterViewInit(): void {

        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        var self = this;
        this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
            if (isConfirmed) {
                self.removerMovimentoConta();
            }
            else {
                self.cancelar();
            }
        });
    }


    removerMovimentoConta() {
        this.movimentoContaService.removerMovimentoConta(this.movimentoConta)
            .subscribe(
                result => {
                    this.swal.showSwalSuccess('Movimento de Conta Removido com Sucesso');
                    this.router.navigate(['movimentoconta/lista']);
                },
                error => {
                    error => this.errors;
                });

    }

    cancelar() {
        this.router.navigate(['movimentoconta/consultar/' + this.movimentoContaId])
    }



}
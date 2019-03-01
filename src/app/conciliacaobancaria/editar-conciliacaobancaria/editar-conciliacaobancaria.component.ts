import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { MovimentoConta, ContaCorrente, TipoOperacao } from '../models/movimentoconta';
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { Subscription } from 'rxjs';
import { ConciliacaoBancariaService } from '../conciliacaobancaria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConciliacaoBancariaComponent } from '../conciliacaobancaria.component';
import { UtilService } from '../../services/util.service';
import { DisableControlDirective } from '../../diretivas/disablecontrol.directive';
import { disableDebugTools } from '@angular/platform-browser';
import { SweetAlertAdviceService } from '../../services/sweetalert.advice.service';
import { CustomValidators } from 'ng2-validation';

@Component({
    selector: 'app-editar-conciliacaobancaria',
    templateUrl: './editar-conciliacaobancaria.component.html',
    styleUrls: []
})

export class EditarConciliacaoBancariaComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public movimentoConta: MovimentoConta;

    public movimentoContaForm: FormGroup;

    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public contasCorrente: ContaCorrente[];

    swal: SweetAlertAdviceService;

    public tiposOperacao: TipoOperacao[];

    movimentoContaId: number;

    public sub: Subscription;

    public errors: any[] = [];


    constructor(
        private conciliacaoBancariaService: ConciliacaoBancariaService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private conciliacaoBancariaComponent: ConciliacaoBancariaComponent,
        private _utilService: UtilService
    ) {

        this.movimentoConta = new MovimentoConta();
        this.swal = new SweetAlertAdviceService();
    }



    ngOnInit(): void {

        this.movimentoContaForm = this.fb.group({
            codigo: [{ value: '', disabled: true }],
            grupoEmpresaId: [{ value: '', disabled: true }],
            empresaId: [{ value: '', disabled: true }],
            contaCorrenteId: [{ value: '', disabled: true }],
            documento: [{ value: '', disabled: true }],
            dataEmissao: [{ value: '', disabled: true }],
            dataCompensacao: [null, Validators.required],
            valor: [{ value: null, disabled: true }],
            siglaDebitoCredito: [{ value: '', disabled: true }],
            siglaTipoOperacao: [{ value: '', disabled: true }],
            descricaoFornecedor: [{ value: '', disabled: true }],
            flagCreditoNaoIdentificado: [{ value: 'N', disabled: true }],
        });

        this.sub = this.route.params.subscribe(
            params => {
                this.movimentoContaId = params['id'];
                this.obterMovimentoConta(this.movimentoContaId);
            }
        )

        this.conciliacaoBancariaService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                error => this.errors);

        this.conciliacaoBancariaService.obterTodosEmpresa()
            .subscribe(empresas => {
                this.empresas = empresas
            },
                error => this.errors);

        this.conciliacaoBancariaService.obterTodosContaCorrente()
            .subscribe(contasCorrente => {
                this.contasCorrente = contasCorrente
            },
                error => this.errors);

        //   this.conciliacaoBancariaService.getTipoOperacao()
        //       .subscribe(tiposOperacao => {
        //           this.tiposOperacao = tiposOperacao
        //       },
        //           error => this.errors);
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
        this.conciliacaoBancariaService.obterMovimentoContaPorId(id)
            .subscribe(

                movimentoConta => {
                    this.preencherFormMovimentoConta(movimentoConta);
                   
                },

                response => {
                    if (response.status == 404) {
                        this.router.navigate(['404']);
                    }
                });
    }

    preencherFormMovimentoConta(movimentoConta: MovimentoConta): void {

        this.movimentoConta = movimentoConta;

        this.movimentoContaForm.patchValue({
            codigo: this.movimentoConta.codigo,
            grupoEmpresaId: this.movimentoConta.grupoEmpresaId,
            empresaId: this.movimentoConta.empresaId,
            contaCorrenteId: this.movimentoConta.contaCorrenteId,
            documento: this.movimentoConta.documento,
            dataEmissao: this._utilService.ToDate(this.movimentoConta.dataEmissao),
            dataCompensacao: null,
            valor: this.movimentoConta.valor,
            siglaDebitoCredito: this.movimentoConta.siglaDebitoCredito,
            siglaTipoOperacao: this.movimentoConta.siglaTipoOperacao,
            descricaoFornecedor: this.movimentoConta.descricaoFornecedor,
            flagCreditoNaoIdentificado: this.movimentoConta.flagCreditoNaoIdentificado
        });

    }

    voltar() {
        this.router.navigate(['conciliacaobancaria/lista'])
    }


    editarMovimentoConta() {
        if (this.movimentoContaForm.dirty && this.movimentoContaForm.valid) {

            let p = Object.assign({}, this.movimentoConta, this.movimentoContaForm.getRawValue());

            this.conciliacaoBancariaService.AtualizarMovimento(p)
                .subscribe(
                    result => {
                        this.swal.showSwalSuccess('Movimento Conciliado com Sucesso!');
                        this.router.navigate(['conciliacaobancaria/lista']);
                    },
                    error => {
                        this.onError(error)
                    })
        }
    }

    onError(error) {
        this.errors = JSON.parse(error._body).errors;
    }

}

import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MovimentoConta, HistoricoPadrao, MovimentoContaCentro, ContaCorrente } from '../models/movimentoconta';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { MovimentoContaService } from '../movimentoconta.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MovimentoContaComponent } from '../movimentoconta.component';
import { MaskService } from '../../../services/mask.service';
import { Mascara } from '../../../cadastros/mascara/models/mascara';

@Component({
    selector: 'app-adicionar-movimentoconta',
    providers: [MaskService],
    templateUrl: './adicionar-movimentoconta.component.html'
})
export class AdicionarMovimentoContaComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    @ViewChild('focusCodigo') focusCodigo: ElementRef;

    public maskValid: boolean;
    public mascSequencial: Mascara;

    public grupoEmpresaId: number;

    public movimentoConta: MovimentoConta;
    private idEmpresa:string;
    public aPagar: boolean = true;

    public movimentoContaForm: FormGroup;

    swal: SweetAlertAdviceService;
    displayMessage: { [key: string]: string } = {};

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public historicosPadrao: HistoricoPadrao[];
    public contasCorrente: ContaCorrente[];
    public contas: ContaCorrente[];

    public carregarMovimentoContaCentro: boolean = true;
    public permiteIncluirEditar: boolean = true;
    public centroTotalizado: boolean = false;

    public errors: any[] = [];
    public codMask = [];

    constructor(
        private movimentoContaService: MovimentoContaService,
        private fb: FormBuilder,
        private router: Router,
        private _maskService: MaskService,
        private movimentoContaComponent: MovimentoContaComponent,
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
            siglaDebitoCredito: {
                required: 'Informe se é Débito ou Crédito'
            },
            dataEmissao: {
                required: 'Informe a Data de Emissão'
            }
        };

        this.maskValid = true;
        this.mascSequencial = new Mascara();
        this.genericValidator = new GenericValidator(this.validationMessages);
        this.movimentoConta = new MovimentoConta();
        this.swal = new SweetAlertAdviceService();
    }

    ngOnInit(): void {
        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = [];
        this.movimentoContaComponent.MovimentoConta.apropriacaoCentro = [];

        this.movimentoContaForm = this.fb.group({
            empresaId: ['', [Validators.required]],
            grupoEmpresaId: ['', [Validators.required]],
            documento: '',
            codigo: ['', [Validators.required]],
            contaCorrenteId: ['', [Validators.required]],
            siglaDebitoCredito: ['', [Validators.required]],
            valor: [0.0, [Validators.required, Validators.min(0.01)]],
            dataEmissao: ['', [Validators.required]],
            siglaTipoOperacao: '',
            descricaoFornecedor: '',
            historicoPadraoId: '',
            descricaoHistoricoPadrao: '',
            excluido: 'N',
            flagCreditoNaoIdentificado: 'N'
        })

        this.movimentoContaService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                error => this.errors);
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

    cancelar() {
        this.router.navigate(['movimentoconta/lista']);

    }

    async adicionarMovimentoConta(): Promise<void> {
        if (this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length > 0) {
            let movimentoContaCentroCusto = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null);
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

        if (this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length > 0 && !this.centroTotalizado) {
            let movimentoContaCentroResultado = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null);
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

            if(this.mascSequencial.sequencial === 'S')
            {
                //#region  add

                p.movimentoContaCentro = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro;
            for (var i = 0; i < p.movimentoContaCentro.length; i++) {
                p.movimentoContaCentro[i].centroCusto = null;
                p.movimentoContaCentro[i].centroResultado = null;
            }

            this.gerarApropriacoes();

            p.apropriacaoCentro = this.movimentoContaComponent.MovimentoConta.apropriacaoCentro;
            for (var i = 0; i < p.apropriacaoCentro.length; i++) {
                p.apropriacaoCentro[i].centroCusto = null;
                p.apropriacaoCentro[i].centroResultado = null;
            }

            p.siglaTipoOperacao = "LANC";
            p.descricaoHistoricoPadrao = this.movimentoConta.descricaoHistoricoPadrao;

            this.movimentoContaService.adicionarMovimentoConta(p)
                .subscribe(
                    result => {
                        this.movimentoConta = result;

                        this.movimentoContaComponent.MovimentoConta = this.movimentoConta;
                        this.swal.showSwalSuccess('Movimento de Conta Adicionado com Sucesso!');
                        this.router.navigate(['movimentoconta/lista']);
                    },
                    error => {
                        this.onError(error)
                    });
            //#endregion
            }
            else
            {
                let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
                let movimentoConta = await this.movimentoContaService.ObterMovimentoContaPorCodigo(codigo).toPromise();

                if(movimentoConta != null)
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
                    //#region  add

                p.movimentoContaCentro = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro;
                for (var i = 0; i < p.movimentoContaCentro.length; i++) {
                    p.movimentoContaCentro[i].centroCusto = null;
                    p.movimentoContaCentro[i].centroResultado = null;
                }
    
                this.gerarApropriacoes();
    
                p.apropriacaoCentro = this.movimentoContaComponent.MovimentoConta.apropriacaoCentro;
                for (var i = 0; i < p.apropriacaoCentro.length; i++) {
                    p.apropriacaoCentro[i].centroCusto = null;
                    p.apropriacaoCentro[i].centroResultado = null;
                }
    
                p.siglaTipoOperacao = "LANC";
                p.descricaoHistoricoPadrao = this.movimentoConta.descricaoHistoricoPadrao;
    
                this.movimentoContaService.adicionarMovimentoConta(p)
                    .subscribe(
                        result => {
                            this.movimentoConta = result;
    
                            this.movimentoContaComponent.MovimentoConta = this.movimentoConta;
                            this.swal.showSwalSuccess('Movimento de Conta Adicionado com Sucesso!');
                            this.router.navigate(['movimentoconta/lista']);
                        },
                        error => {
                            this.onError(error)
                        });
                //#endregion
                }
            }
            
        }

    }

    preencherHistorico(id) {
        this.carregarMovimentoContaCentro = false;


        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = new Array();
        this.movimentoContaService.obterHistoricoPadraoCentroPorId(id)
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
                        //  movimentoContacentro.movimentoContaId = 0;

                        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.push(movimentoContacentro);

                    }
                    this.carregarMovimentoContaCentro = true;
                    this.gerarApropriacoes();


                });

        for (let i = 0; this.historicosPadrao.length; i++) {
            if (this.historicosPadrao[i].id == id) {
                this.movimentoConta.descricaoHistoricoPadrao = this.historicosPadrao[i].descricao;
            }
        }
    }

    limparCampoCodigo(){
        this.movimentoContaForm.controls['codigo'].setValue('');
        this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
      }

    apagarOuAreceber(event) {
        this.aPagar = event == "D" ? true : false;
        this.movimentoContaForm.get("descricaoFornecedor").setValue("");
        this.contasCorrente = new Array();
        if (this.aPagar) {
            for(var i = 0;this.contas.length > i ;i++){
                if(this.contas[i].tipoContaId != 25 && this.contas[i].empresaId.toString() == this.idEmpresa){
                    this.contasCorrente.push(this.contas[i]);
                }
            }
            this.movimentoContaForm.get("siglaTipoOperacao").enable();
            this.movimentoContaForm.get("contaCorrenteId").enable();
        }else{
            for(var i = 0;this.contas.length > i ;i++){
                if(this.contas[i].tipoContaId == 25 && this.contas[i].empresaId.toString() == this.idEmpresa){
                    this.contasCorrente.push(this.contas[i]);
                }
            }
        }
    }

    habilitar() {
        this.movimentoContaForm.get("siglaDebitoCredito").setValue("");
        this.movimentoContaForm.get("siglaDebitoCredito").enable();
    }

    desabilitar() {
        this.movimentoContaForm.get("siglaDebitoCredito").disable();
        this.movimentoContaForm.get("siglaTipoOperacao").disable();
        this.movimentoContaForm.get("contaCorrenteId").disable();
    }

    gerarApropriacoes() {
        let p = Object.assign({}, this.movimentoConta, this.movimentoContaForm.value);

        p.descricaoHistoricoPadrao = this.movimentoConta.descricaoHistoricoPadrao;
        p.movimentoContaCentro = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro

        this.carregarMovimentoContaCentro = true;
        this.movimentoContaService.gerarApropriacaoCentroMovimentoConta(p)
            .subscribe(
                result => {
                    this.movimentoContaComponent.MovimentoConta.apropriacaoCentro = result;
                }
            );
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
        this.movimentoContaForm.get("descricaoFornecedor").setValue("");
        this.movimentoContaService.obterTodosEmpresaPorId(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => { });

        if (this.empresas.length > 0) {
            this.habilitar();
        } else {
            this.desabilitar();
            this.cleanDebitoCredito();
        }
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
        this.idEmpresa = idEmpresa;
        this.cleanDebitoCredito();
        this.movimentoContaService.obterTodosHistoricoPadraoPorEmpresa(idEmpresa)
          .subscribe(historicoPadraos => {
            this.historicosPadrao = historicoPadraos
          },
            () => {});

        this.movimentoContaService.obterTodosContasPorEmpresaId(idEmpresa)
        .subscribe(contasCorrente => {
            this.contas = contasCorrente
        },
            () => {});
      }

    tiposOperacao = [
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

    private cleanDebitoCredito() {
        this.movimentoContaForm.get("siglaDebitoCredito").setValue("");
        this.contasCorrente = [];
        this.movimentoContaForm.get("siglaTipoOperacao").disable();
        this.movimentoContaForm.get("siglaTipoOperacao").setValue("");
        this.movimentoContaForm.get("contaCorrenteId").setValue("");
        this.movimentoContaForm.get("contaCorrenteId").disable();
    }
}

import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ChequeProprioService } from '../chequeproprio.service';
import { ChequeTalao, ChequeFolha, ChequeFolhaHistorico, ContaCorrente, SituacaoCheque } from '../models/chequeproprio';
import { ChequeproprioComponent } from '../chequeproprio.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-adicionar-chequetalao',
  templateUrl: './adicionar-chequetalao.component.html',
  styleUrls: []
})
export class AdicionarChequetalaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public chequeTalao: ChequeTalao;
  public chequeTalaoForm: FormGroup;
  public chequeFolha: ChequeFolha;
  public chequeFolhaHistorico: ChequeFolhaHistorico;



  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public contaCorrentes: ContaCorrente[];
  public chequeTaloes: ChequeTalao[];
  public situacaoCheques: SituacaoCheque[];

  public errors: any[] = [];

  constructor(private chequeProprioService: ChequeProprioService,
    private fb: FormBuilder,
    private router: Router,
    private utilService: UtilService,
    private chequeproprioComponent: ChequeproprioComponent) {
    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      contaCorrenteId: {
        required: 'Informe a Conta Corrente'
      },
      numFolhaInicial: {
        required: 'Informe a Folha Inicial'
      },
      numFolhaFinal: {
        required: 'Informe a Folha Final'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.chequeTalao = new ChequeTalao();
    this.swal = new SweetAlertAdviceService();
    this.chequeproprioComponent.chequeTalao.chequeFolha = new Array();
  }

  ngOnInit() {
    this.chequeTalaoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      contaCorrenteId: ['', [Validators.required]],
      numFolhaInicial: ['', [Validators.required]],
      numFolhaFinal: ['', [Validators.required]]
    });

    this.chequeProprioService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.chequeProprioService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

    this.chequeProprioService.obterTodosContaCorrente()
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
      error => this.errors);

    this.chequeProprioService.obterTodosSituacaoCheque()
      .subscribe(situacaoCheques => {
        this.situacaoCheques = situacaoCheques
      },
      error => this.errors);



  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.chequeTalaoForm);
    });

  }

  gerarFolhas() {

    if (this.chequeTalaoForm.dirty && this.chequeTalaoForm.valid) {

      let p = Object.assign({}, this.chequeTalao, this.chequeTalaoForm.value);

      this.chequeproprioComponent.ChequeTalao.chequeFolha = new Array();

      for (let i = 0; this.contaCorrentes.length > i; i++) {
        if (this.contaCorrentes[i].id == p.contaCorrenteId) {
          p.contaCorrente = this.contaCorrentes[i];
        }
      }

      let qtdFolha = p.numFolhaFinal - p.numFolhaInicial + 1;

      for (let i = 0; qtdFolha > i; i++) {

        this.chequeFolha = new ChequeFolha();
        this.chequeFolha.chequeFolhaHistorico = new Array();
        this.chequeFolha.id = i;
        this.chequeFolha.empresaId = p.empresaId;
        this.chequeFolha.grupoEmpresaId = p.grupoEmpresaId;
        this.chequeFolha.numCheque = p.numFolhaInicial + i;
        this.chequeFolha.banco = p.contaCorrente.banco.descricao;
        this.chequeFolha.agencia = p.contaCorrente.agencia.descricao;
        this.chequeFolha.conta = p.contaCorrente.descricao;
        this.chequeFolha.situacao = 'Emitido';

        this.chequeFolhaHistorico = new ChequeFolhaHistorico();
        this.chequeFolhaHistorico.id = i;
        this.chequeFolhaHistorico.situacaoChequeId = 21;
        let date = new Date();
        let dataAtual = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString();
        this.chequeFolhaHistorico.dataEmissao = dataAtual;  //this.utilService.ToDate('12-03-2018');
        
        for (let i = 0; this.situacaoCheques.length > i; i++) {
           
           if (this.situacaoCheques[i].id == this.chequeFolhaHistorico.situacaoChequeId) {
             this.chequeFolhaHistorico.situacaoCheque = this.situacaoCheques[i];
           }
        }

        this.chequeFolha.chequeFolhaHistorico.push(this.chequeFolhaHistorico);
        this.chequeproprioComponent.ChequeTalao.chequeFolha.push(this.chequeFolha);

      }

    }

  }

  adicionarChequeTalao() {

    if (this.chequeTalaoForm.dirty && this.chequeTalaoForm.valid) {

      let p = Object.assign({}, this.chequeTalao, this.chequeTalaoForm.value);

      for(let i = 0; i < this.chequeproprioComponent.chequeTalao.chequeFolha.length; i++){

            switch(this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao){

                  case 'Emitido':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'EMI';
                  break;

                  case 'Cancelado':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'CAN';
                  break;

                  case 'Acordo':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'ACR';
                  break;

                  case 'Compensado':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'COM';
                  break;

                  case 'Contrato':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'CON';
                  break;

                  case 'Depósito':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'DEP';
                  break;

                  case 'Disponível':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'DIS';
                  break;

                  case 'Em Cobrança':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'COB';
                  break;

                  case 'Sangria':
                  this.chequeproprioComponent.chequeTalao.chequeFolha[i].situacao = 'SAN';
                  break;
            }

      }

      p.chequeFolha = this.chequeproprioComponent.ChequeTalao.chequeFolha;

      this.chequeProprioService.AdicionarChequeTalao(p)
        .subscribe(
        result => {

          this.chequeTalao = result;

          this.chequeproprioComponent = null;

          this.swal.showSwalSuccess('Talão Cheque Adicionado com Sucesso!');
          this.router.navigate(['chequeproprio/lista']);
        },
        error => {
          this.onError(error)
        })

    }

  }


  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['chequeproprio/lista']);
  }


}

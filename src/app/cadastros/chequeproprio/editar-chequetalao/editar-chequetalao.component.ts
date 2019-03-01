import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ChequeProprioService } from '../chequeproprio.service';
import { ChequeTalao, ChequeFolha, ContaCorrente } from '../models/chequeproprio';
import { ChequeproprioComponent } from '../chequeproprio.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-chequetalao',
  templateUrl: './editar-chequetalao.component.html',
  styleUrls: []
})
export class EditarChequetalaoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public chequeTalao: ChequeTalao;
  public chequeTalaoForm: FormGroup;
  public chequeFolha: ChequeFolha;

  public chequeTalaoId: string = "";

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public contaCorrentes: ContaCorrente[];
  public chequeTaloes: ChequeTalao[];

  carregaChequeFolha: boolean = false;

  public errors: any[] = [];
  public sub: Subscription;

  constructor(private chequeProprioService: ChequeProprioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
    this.chequeproprioComponent.dirty = false;
  }

  ngOnInit() {
    this.chequeTalaoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      contaCorrenteId: ['', [Validators.required]],
      numFolhaInicial: ['', [Validators.required]],
      numFolhaFinal: ['', [Validators.required]]
    });

    this.chequeTalaoForm.controls['grupoEmpresaId'].disable();
    this.chequeTalaoForm.controls['empresaId'].disable();
    this.chequeTalaoForm.controls['contaCorrenteId'].disable();
    this.chequeTalaoForm.controls['numFolhaInicial'].disable();
    this.chequeTalaoForm.controls['numFolhaFinal'].disable();

    this.chequeProprioService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      () => this.errors);

    this.chequeProprioService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      () => this.errors);

    this.chequeProprioService.obterTodosContaCorrente()
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
      () => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.chequeTalaoId = params['id'];
        this.obterChequeTalao(this.chequeTalaoId);
      });
  }

  obterChequeTalao(id: string) {
    this.chequeProprioService.obterChequeTalao(id)
      .subscribe(
      chequeTalao => this.preencherFormChequeTalao(chequeTalao),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormChequeTalao(chequeTalao: ChequeTalao): void {
    this.chequeTalao = chequeTalao;
    this.chequeproprioComponent.ChequeTalao.chequeFolha = chequeTalao.chequeFolha;

    this.chequeTalaoForm.patchValue({
      grupoEmpresaId: this.chequeTalao.grupoEmpresaId,
      empresaId: this.chequeTalao.empresaId,
      contaCorrenteId: this.chequeTalao.contaCorrenteId,
      numFolhaInicial: this.chequeTalao.numFolhaInicial,
      numFolhaFinal: this.chequeTalao.numFolhaFinal
    });

    this.carregaChequeFolha = true;
  }

  editarChequeTalao() {
    if (this.chequeproprioComponent.dirty){
      this.router.navigate(['chequeproprio/lista']);
    }     
  }

  onError(error) {
    this.errors = JSON.parse(error).errors;
  }

  cancelar() {
    this.router.navigate(['chequeproprio/lista']);
  }

}

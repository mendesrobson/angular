import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { ConfiguracaopagamentoService } from '../configuracaopagamento.service';
import { MaskService } from '../../../services/mask.service';
import { ConfiguracaoPagamento } from '../models/configuracaopagamento';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';


@Component({
  selector: 'app-adicionar-configuracaopagamento',
  templateUrl: './adicionar-configuracaopagamento.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class AdicionarConfiguracaopagamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public configuracaoPagamento: ConfiguracaoPagamento;
  public configuracaoPagamentoForm: FormGroup;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private configuracaoPagamentoService: ConfiguracaopagamentoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router,
    private renderer: Renderer) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla:{
        maxlength: 'A Sigla deve ter no máximo 10 caracteres!'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      quantidadeParcela : {
        required: 'Quantidade Parcela requerida.'
      },
      periodicidade: {
        required: 'Periodicidade requerida.'
      },
      numeroDiaUtil: {
        required: 'Qtd. Dia Útil requerida.'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.configuracaoPagamento = new ConfiguracaoPagamento();
    this.swal = new SweetAlertAdviceService();
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

  ngOnInit(): void {
    this.configuracaoPagamentoForm = this.fb.group({  
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      quantidadeParcela: ['', [Validators.required]],
      periodicidade: ['', [Validators.required]],
      numeroDiaUtil: ['', [Validators.required]],
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
      excluido: 'N'
    });

    this.configuracaoPagamentoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
    error => this.errors);

    this.configuracaoPagamentoService.obterTodosEmpresa()
    .subscribe(empresas => {
      this.empresas = empresas
    },
    error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.configuracaoPagamentoForm);
    });

  }

  async adicionarConfiguracaoPagamento(): Promise<void> {
    if (this.configuracaoPagamentoForm.dirty && this.configuracaoPagamentoForm.valid) {

      let p = Object.assign({}, this.configuracaoPagamento, this.configuracaoPagamentoForm.getRawValue());

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
        this.configuracaoPagamentoService.AdicionarConfiguracaoPagamento(p).subscribe(
          () => {
            this.swal.showSwalSuccess('Configuração Pagamento Adicionado com Sucesso!');
            this.router.navigate(['configuracaopagamento/lista']);
          },
          error => {
            this.onError(error)
          });    
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let configuracaoPagamento = await this.configuracaoPagamentoService.ObterConfiguracaoPagamentoPorCodigo(codigo).toPromise();

          if(configuracaoPagamento != null)
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
            this.configuracaoPagamentoService.AdicionarConfiguracaoPagamento(p).subscribe(
              result => {
                this.swal.showSwalSuccess('Configuração Pagamento Adicionado com Sucesso!');
                this.router.navigate(['configuracaopagamento/lista']);
              },
              error => {
                this.onError(error)
              });   
          }
      }
         
    }
  }

  limparCampoCodigo(){
    this.configuracaoPagamentoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['configuracaopagamento/lista']);
  }


  // marcarCheckManterVencimento(check) {    
  //   if (check) {
  //     this.configuracaoPagamentoForm.patchValue({
  //       manterDiaVencimento: 'S',
  //       diaUtil: 'N',
  //       ultimoDiaMes: 'N'
  //     })
  //   } else {
  //     this.configuracaoPagamentoForm.patchValue({
  //       manterDiaVencimento: 'N'
  //     })  
  //   }
  // }

  // marcarCheckUltimoDiaMes(check) {
  //   if (check) {
  //     this.configuracaoPagamentoForm.patchValue({
  //       manterDiaVencimento: 'N',
  //       diaUtil: 'N',
  //       ultimoDiaMes: 'S'
  //     })
  //   } else {
  //     this.configuracaoPagamentoForm.patchValue({
  //       ultimoDiaMes: 'N'
  //     })  
  //   }
  // }

  // marcarCheckDiaUtil(check) {
  //   if (check) {
  //     this.configuracaoPagamentoForm.patchValue({
  //       manterDiaVencimento: 'N',
  //       diaUtil: 'S',
  //       ultimoDiaMes: 'N'
  //     })
  //   } else {
  //     this.configuracaoPagamentoForm.patchValue({
  //       diaUtil: 'N'
  //     })  
  //   }
  // }

  // marcarCheckPosterga(check) {
  //   if (check) {
  //       this.configuracaoPagamento.posterga = 'S';
  //       this.configuracaoPagamento.antecipa = 'N';
  //   } else {
  //       this.configuracaoPagamento.posterga = 'N';
  //   }
  // }

  // marcarCheckAntecipa(check) {
  //   if (check) {
  //       this.configuracaoPagamento.antecipa = 'S';
  //       this.configuracaoPagamento.posterga = 'N';
  //   } else {
  //       this.configuracaoPagamento.antecipa = 'N';
  //   }
  // }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'ConfiguracaoPagamento', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.configuracaoPagamentoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.configuracaoPagamentoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.configuracaoPagamentoForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.configuracaoPagamentoService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

async OnChangeEmpresa(empresaId) : Promise<void> {
        
  this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'ConfiguracaoPagamento', this.grupoEmpresaId, empresaId);
  
  if(this.mascSequencial != null)
  {
      if(this.mascSequencial.sequencial === 'S')
      {
          this.configuracaoPagamentoForm.controls['codigo'].setValue('');
          this.maskValid = false;
      }
      else
      {
          this.configuracaoPagamentoForm.controls['codigo'].setValue('');
          this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
          this.maskValid = true;
      }
  }
  else
  {
    this.configuracaoPagamentoForm.controls['codigo'].setValue('');
    this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    this.maskValid = true;
    
  }

}


}




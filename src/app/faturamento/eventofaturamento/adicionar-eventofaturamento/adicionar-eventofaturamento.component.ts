import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventoFaturamento, HistoricoPadrao, ParametroFaturamento, TipoVencimento, TipoMesVencimento, UnidadeEvento } from '../models/eventofaturamento';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EventoFaturamentoService } from '../eventofaturamento.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Mascara } from '../../../cadastros/mascara/models/mascara';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-eventofaturamento',
  templateUrl: './adicionar-eventofaturamento.component.html',
  styleUrls: []
})

export class AdicionarEventoFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public eventoFaturamento: EventoFaturamento;
  public parametroFaturamento: ParametroFaturamento;
  public eventoFaturamentoForm: FormGroup;

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public historicoPadrao: HistoricoPadrao[];

  public tipoMesVencimento: TipoMesVencimento[];
  public tipoVencimento: TipoVencimento[];
  public unidadeEvento: UnidadeEvento[];

  public errors: any[] = [];
  public codMask = [];


  constructor(
        private eventoFaturamentoService: EventoFaturamentoService,
        private fb: FormBuilder,
        private router: Router,
        private renderer: Renderer,
        private _maskService: MaskService,) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      codigo: {
        required: 'Codigo requerido.'
      },
      descricao: {
        required: 'Descricao requerido.'
      },
      historicoPadraoId: {
        required: 'Histórico Padrão requerido.'
      },
      diaVencimento: {
        required: 'Dia Vencimento requerido.'
      },
      mesVencimento: {
        required: 'Mês Vencimento requerido.'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.eventoFaturamento = new EventoFaturamento();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.eventoFaturamentoForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      unidade: '',
      valorReferencia: 0,
      historicoPadraoId: ['', [Validators.required]],
      irrf: 'N',
      aliquotaIRRF: 0,
      iss: 'N',
      aliquotaISS: 0,
      retencaoFonte: 'N',
      aliquotaRetencaoFonte: 0,
      inssRetido: 'N',
      aliquotaINSSRetido: 0,
      issRetido: 'N',
      aliquotaISSRetido: 0,
      // lancamentoMensal: 'N',
      faturarContrato: 'N',
      vencimento: '',
      diaVencimento: [0, [Validators.required]],
      mesVencimento: ['', [Validators.required]],
      excluido: 'N',
      diaVencimentoContrato: 'N',
      valorContrato: 'N',
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });

    //this.parametroFaturamento = { crf: null, pis: null, cofins: null, csll: null, aliquotaRetencaoFonte: 0 };

    this.eventoFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors);

    this.eventoFaturamentoService.obterTodosHistoricoPadrao()
      .subscribe(historicoPadrao => {
        this.historicoPadrao = historicoPadrao
      },
        () => this.errors);

    // this.eventoFaturamentoService.getUnidadeEvento()
    //   .subscribe(unidadeEvento => {
    //     this.unidadeEvento = unidadeEvento

    //   },
    //     () => this.errors);
    this.unidadeEvento = [{
      "id": "",
      "valor": ""
    },
    {
      "id": "VLR",
      "valor": "Valor"
    },
    {
      "id": "QTD",
      "valor": "Quantidade"
    },
    {
      "id": "PRC",
      "valor": "Percentual"
    }];


    // this.eventoFaturamentoService.getTipoMesVencimento()
    // .subscribe(tipoMesVencimento => {
    //   this.tipoMesVencimento = tipoMesVencimento

    // },
    // () => this.errors);
    this.tipoMesVencimento = [
      {
        "id": "",
        "valor": ""
      },
      {
        "id": "MSM",
        "valor": "No mesmo"
      },
      {
        "id": "APO",
        "valor": "Após"
      },
      {
        "id": "SEG",
        "valor": "No segundo"
      }
    ];

    // this.eventoFaturamentoService.getTipoVencimento()
    //   .subscribe(tipoVencimento => {
    //     this.tipoVencimento = tipoVencimento

    //   },
    //     () => this.errors);
    this.tipoVencimento = [{
      "id": "",
      "valor": ""
    },
    {
      "id": "FX",
      "valor": "Fixo"
    },
    {
      "id": "CNT",
      "valor": "Conforme Contrato"
    }];
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.eventoFaturamentoForm);
    });
  }

  async adicionarEventoFaturamento(): Promise<void> {
    if (this.eventoFaturamentoForm.dirty && this.eventoFaturamentoForm.valid) {
      let p = Object.assign({}, this.eventoFaturamento, this.eventoFaturamentoForm.value);

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
          this.eventoFaturamentoService.adicionarEventoFaturamento(p)
          .subscribe(
            () => {
              this.swal.showSwalSuccess('Evento adicionado com sucesso!');
              this.router.navigate(['eventofaturamento/lista']);
            },
            (error) => {
              this.onError(error)
            });
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let eventoFaturamento = await this.eventoFaturamentoService.ObterEventoFaturamentoPorCodigo(codigo).toPromise();

          if(eventoFaturamento != null)
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
                this.eventoFaturamentoService.adicionarEventoFaturamento(p)
                .subscribe(
                  () => {
                    this.swal.showSwalSuccess('Evento adicionado com sucesso!');
                    this.router.navigate(['eventofaturamento/lista']);
                  },
                  (error) => {
                    this.onError(error)
                  });
          }
      }

      
    }
  }

  onError(error) {
    console.log("onError" + error);
    this.errors = JSON.parse(error._body).errors;
  }


  cancelar() {
    this.router.navigate(['eventofaturamento/lista']);
  }

  limparCampoCodigo(){
    this.eventoFaturamentoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  habilitarAliquotaRetencao(event) {
    if (this.eventoFaturamento.retencaoFonte == 'S') {
      this.eventoFaturamento.aliquotaRetencaoFonte = this.parametroFaturamento.aliquotaRetencaoFonte;
    } else {
      this.eventoFaturamentoForm.controls['aliquotaRetencaoFonte'].reset();
    }


  }

  async selecionarParametroEmpresa(id): Promise<void> {

    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'EventoFaturamento', this.grupoEmpresaId, id);

    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === 'S')
        {
            this.eventoFaturamentoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {   
            this.eventoFaturamentoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
      this.eventoFaturamentoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }

    if (this.eventoFaturamentoForm.controls['irrf'].value == 'S'){
      this.eventoFaturamentoForm.controls['irrf'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaIRRF'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['iss'].value == 'S'){
      this.eventoFaturamentoForm.controls['iss'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaISS'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['retencaoFonte'].value == 'S'){
      this.eventoFaturamentoForm.controls['retencaoFonte'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaRetencaoFonte'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['inssRetido'].value == 'S'){
      this.eventoFaturamentoForm.controls['inssRetido'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaINSSRetido'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['issRetido'].value == 'S'){
      this.eventoFaturamentoForm.controls['issRetido'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaISSRetido'].clearValidators();
    }

    this.eventoFaturamentoService.obterParametroPorEmpresaId(id)
      .subscribe(parametroFaturamento => {
        this.parametroFaturamento = parametroFaturamento        
        
        if (this.parametroFaturamento != null){

          if (this.parametroFaturamento.aliquotaISS != null){
            this.eventoFaturamentoForm.controls['iss'].patchValue(this.parametroFaturamento.iss);
            this.eventoFaturamentoForm.controls['aliquotaISS'].patchValue(this.parametroFaturamento.aliquotaISS);
            this.eventoFaturamentoForm.controls['issRetido'].patchValue(this.parametroFaturamento.iss);
            this.eventoFaturamentoForm.controls['aliquotaISSRetido'].patchValue(this.parametroFaturamento.aliquotaISS);
          }

          if (this.parametroFaturamento.aliquotaRetencaoFonte != null){
            this.eventoFaturamentoForm.controls['irrf'].patchValue('S');
            this.eventoFaturamentoForm.controls['aliquotaIRRF'].patchValue(this.parametroFaturamento.aliquotaRetencaoFonte);
            this.eventoFaturamentoForm.controls['retencaoFonte'].patchValue("S");
            this.eventoFaturamentoForm.controls['aliquotaRetencaoFonte'].patchValue(this.parametroFaturamento.aliquotaRetencaoFonte);
          }

          if (this.parametroFaturamento.aliquotaINSS != null){
            this.eventoFaturamentoForm.controls['inssRetido'].patchValue(this.parametroFaturamento.inss);
            this.eventoFaturamentoForm.controls['aliquotaINSSRetido'].patchValue(this.parametroFaturamento.aliquotaINSS);
          }

        }

      },
        () => this.errors);
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'EventoFaturamento', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.eventoFaturamentoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.eventoFaturamentoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.eventoFaturamentoForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.eventoFaturamentoService.obterTodosEmpresaGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}

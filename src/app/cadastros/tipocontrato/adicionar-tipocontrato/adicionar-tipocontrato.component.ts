import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';

import { TipoContrato, Periodicidade, TipoReajuste, Indice, Mes, Indexador } from '../models/tipocontrato';
import { TipoContratoService } from '../tipocontrato.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';


@Component({
  selector: 'app-adicionar-tipocontrato',
  templateUrl: './adicionar-tipocontrato.component.html',
  styleUrls: []
})

export class AdicionarTipoContratoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public tipoContrato: TipoContrato;
  public tipoContratoForm: FormGroup;

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public periodicidades: Periodicidade[];
  public tipoReajustes: TipoReajuste[];
  public indices: Indice[];
  public meses: Mes[];
  public indexadores: Indexador[];

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private tipoContratoService: TipoContratoService,
    private fb: FormBuilder,
    private router: Router,
    private _maskService: MaskService,
    private renderer: Renderer) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 1 caracter',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoContrato = new TipoContrato();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.tipoContratoForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      proporcionalDataInicio: 'N',
      indexadorSigla: '',
      periodicidadeSigla: '',
      tipoReajusteSigla: '',
      mesBaseSigla: [{ value: '' }],
      indiceId: '',
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]]
    });

    this.tipoContratoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.tipoContratoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.tipoContratoService.obterTodosIndice()
      .subscribe(indices => {
        this.indices = indices
      },
        error => this.errors);

    // this.tipoContratoService.getPeriodicidade()
    //   .subscribe(periodicidades => {
    //     this.periodicidades = periodicidades
    //   },
    //     error => this.errors);
    this.periodicidades = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "B",
      "valor": "Bimestral"
    },
    {
      "id": "T",
      "valor": "Trimestral"
    },
    {
      "id": "S",
      "valor": "Semestral"
    },
    {
      "id": "A",
      "valor": "Anual"
    }];

    // this.tipoContratoService.getTipoReajuste()
    //   .subscribe(tipoReajustes => {
    //     this.tipoReajustes = tipoReajustes
    //   },
    //     error => this.errors);
    this.tipoReajustes = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "B",
      "valor": "Bimestral"
    },
    {
      "id": "T",
      "valor": "Trimestral"
    },
    {
      "id": "S",
      "valor": "Semestral"
    },
    {
      "id": "A",
      "valor": "Anual"
    },
    {
      "id": "DT",
      "valor": "Data Base"
    }];


    // this.tipoContratoService.getMes()
    //   .subscribe(meses => {
    //     this.meses = meses
    //   },
    //     error => this.errors);
    this.meses = [{
      "id": "JAN",
      "valor": "Janeiro"
    },
    {
      "id": "FEV",
      "valor": "Fevereiro"
    },
    {
      "id": "MAR",
      "valor": "Março"
    },
    {
      "id": "ABR",
      "valor": "Abril"
    },
    {
      "id": "MAI",
      "valor": "Maio"
    },
    {
      "id": "JUN",
      "valor": "Junho"
    },
    {
      "id": "JUL",
      "valor": "Julho"
    },
    {
      "id": "AGO",
      "valor": "Agosto"
    },
    {
      "id": "SET",
      "valor": "Setembro"
    },
    {
      "id": "OUT",
      "valor": "Outubro"
    },
    {
      "id": "NOV",
      "valor": "Novembro"
    },
    {
      "id": "DEZ",
      "valor": "Dezembro"
    }];


    // this.tipoContratoService.getIndexador()
    //   .subscribe(indexadores => {
    //     this.indexadores = indexadores
    //   },
    //   error => this.errors);
    this.indexadores = [{
      "id": "IND",
      "valor": "Índice"
    },
    {
      "id": "MOE",
      "valor": "Moeda Corrente"
    }];

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoContratoForm);
    });



  }



  async adicionarTipoContrato(): Promise<void> {
    if (this.tipoContratoForm.dirty && this.tipoContratoForm.valid) {

      let p = Object.assign({}, this.tipoContrato, this.tipoContratoForm.value);

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
          this.tipoContratoService.adicionarTipoContrato(p)
          .subscribe(
            result => {
              this.swal.showSwalSuccess('Tipo de Contrato Adicionado com Sucesso!');
              this.router.navigate(['tipocontrato/lista']);
            },
            error => {
              this.onError(error)
            });
      }
      else
      {
            let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
            let tipoContrato = await this.tipoContratoService.ObterTipoContratoPorCodigo(codigo).toPromise();

            if(tipoContrato != null)
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
              this.tipoContratoService.adicionarTipoContrato(p)
              .subscribe(
                result => {
                  this.swal.showSwalSuccess('Tipo de Contrato Adicionado com Sucesso!');
                  this.router.navigate(['tipocontrato/lista']);
                },
                error => {
                  this.onError(error)
                });
            }
      }

      
    }
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'TipoContrato', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.tipoContratoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.tipoContratoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.tipoContratoForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.tipoContratoService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

async OnChangeEmpresa(empresaId) : Promise<void> {
        
  this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'TipoContrato', this.grupoEmpresaId, empresaId);
  
  if(this.mascSequencial != null)
  {
      if(this.mascSequencial.sequencial === 'S')
      {
          this.tipoContratoForm.controls['codigo'].setValue('');
          this.maskValid = false;
      }
      else
      {   
          this.tipoContratoForm.controls['codigo'].setValue('');
          this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
          this.maskValid = true;
      }
  }
  else
  {
    this.tipoContratoForm.controls['codigo'].setValue('');
    this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    this.maskValid = true;
    
  }

}

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipocontrato/lista']);
  }

  limparCampoCodigo(){
    this.tipoContratoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

}

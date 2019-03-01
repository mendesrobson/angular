import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, Renderer, ViewChild } from '@angular/core';

import * as _ from 'lodash';
import { MaskService } from '../../../services/mask.service';
import { TestemunhaService } from '../testemunha.service';
import { Uf, Testemunha } from '../models/testemunha';
import { FormGroup, Validators, FormBuilder, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';

@Component({
  selector: 'app-adicionar-testemunha',
  templateUrl: './adicionar-testemunha.component.html',
  styleUrls: [],
  providers: [MaskService]
})

export class AdicionarTestemunhaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  cpfMask = this._maskService.Cpf();
  rgMask = this._maskService.Rg();
  cpfPattern = this._maskService.cpfPattern;

  public testemunha: Testemunha;
  public testemunhaForm: FormGroup;

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};
  
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;   
  public grupoEmpresas: GrupoEmpresa[];
  public empresas : Empresa [];
  public ufs : Uf [];

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private _maskService: MaskService,
    private testemunhaService: TestemunhaService,
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer) {

    this.validationMessages = {
        codigo: {
          required: 'O Código é requerido.',
          minlength: 'O Código precisa ter no mínimo 2 caracteres',
          maxlength: 'O Código precisa ter no máximo 20 caracteres'
        },
        nome: {
            required: 'O Nome é requerido.',
            minlength: 'O Nome precisa ter no mínimo 3 caracteres',
            maxlength: 'O Nome precisa ter no máximo 120 caracteres'
          },
        cpf: {
            required: 'O CPF é requerido.',
            minlength: 'O CPF precisa ter no mínimo 11 caracteres',
            maxlength: 'O CPF precisa ter no máximo 11 caracteres',
            pattern: 'Formato de CPF inválido'
          },
        rg: {
            required: 'O RG é requerido'
          },
        orgaoEmissor : {
          required: 'O Órgão Emissor é requerido',
          minlength: 'O Orgão Emissor precisa ter no mínimo 2 caracteres',
          maxlength: 'O Orgão Emissor precisa ter no máximo 5 caracteres'
        },
        empresaId: {
          required: 'Informe a Empresa'
        },  
        grupoEmpresaId: {
          required: 'Informe o Grupo'
        },  
        ufId: {
          required: 'Informe a UF'
        }  
      };

      this.maskValid = true;
      this.mascSequencial = new Mascara();
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.testemunha = new Testemunha();
      this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.testemunhaForm = this.fb.group({
      codigo: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
      nome: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120)]],
      cpf:  ['', [Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.pattern(this.cpfPattern)]],
      rg:  ['', [Validators.required]],
      orgaoEmissor: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(5)]],
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]],
      ufId: ['', [Validators.required]] });

      this.testemunhaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
          this.grupoEmpresas = grupoEmpresas
          }, 
       error => this.errors);
  
       this.testemunhaService.obterTodosEmpresa()
       .subscribe(empresas => {
           this.empresas = empresas
           }, 
        error => this.errors);
  
        this.testemunhaService.obterTodosUf()
        .subscribe(ufs => {
            this.ufs = ufs
            }, 
         error => this.errors);
    }

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.testemunhaForm);
      });

    }  


  async adicionarTestemunha(): Promise<void> {
    if (this.testemunhaForm.dirty && this.testemunhaForm.valid) {
      let p = Object.assign({}, this.testemunha, this.testemunhaForm.value);

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
            this.testemunhaService.adicionarTestemunha(p)
            .subscribe(
            result => { 
              this.swal.showSwalSuccess('Testemunha Adicionada com Sucesso!');
              this.router.navigate(['testemunha/lista']);
            },
            error => {
              this.onError(error)
            });
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let testemunha = await this.testemunhaService.ObterTestemunhaPorCodigo(codigo).toPromise();

          if(testemunha != null)
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
              this.testemunhaService.adicionarTestemunha(p)
              .subscribe(
              result => { 
                this.swal.showSwalSuccess('Testemunha Adicionada com Sucesso!');
                this.router.navigate(['testemunha/lista']);
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
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'Testemunha', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.testemunhaForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.testemunhaForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.testemunhaForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.testemunhaService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

async OnChangeEmpresa(empresaId) : Promise<void> {
        
      this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Testemunha', this.grupoEmpresaId, empresaId);
      
      if(this.mascSequencial != null)
      {
          if(this.mascSequencial.sequencial === 'S')
          {
              this.testemunhaForm.controls['codigo'].setValue('');
              this.maskValid = false;
          }
          else
          {   
              this.testemunhaForm.controls['codigo'].setValue('');
              this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
              this.maskValid = true;
          }
      }
      else
      {
        this.testemunhaForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
        
      }

}

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  } 


  cancelar() {
    this.router.navigate(['testemunha/lista']);
}

limparCampoCodigo(){
  this.testemunhaForm.controls['codigo'].setValue('');
  this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
}
 
}

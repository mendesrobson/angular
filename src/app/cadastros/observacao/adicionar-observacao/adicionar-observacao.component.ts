import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observacao } from '../models/observacao';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ObservacaoService } from '../observacao.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-observacao',
  templateUrl: './adicionar-observacao.component.html',
  styleUrls: []
})

export class AdicionarObservacaoComponent  implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public observacao: Observacao;
  public observacaoForm: FormGroup;

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};
  
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;   
  public grupoEmpresas: GrupoEmpresa[];
  public empresas : Empresa [];

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private observacaoService: ObservacaoService,
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
      this.observacao = new Observacao();
      this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.observacaoForm = this.fb.group({
      codigo: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
      observacaoComplementar : '',  
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]] });

      this.observacaoService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                () => { });

    }

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.observacaoForm);
      });

    }  

  async adicionarObservacao(): Promise<void> {
    if (this.observacaoForm.dirty && this.observacaoForm.valid) {
      let p = Object.assign({}, this.observacao, this.observacaoForm.value);

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
          this.observacaoService.adicionarObservacao(p)
          .subscribe(
          () => { 
            this.swal.showSwalSuccess('Observação Adicionada com Sucesso!');
            this.router.navigate(['observacao/lista']);
          },
          error => {
            this.onError(error)
          });
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let observacao = await this.observacaoService.ObterObservacaoPorCodigo(codigo).toPromise();
          
          if(observacao != null)
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
              this.observacaoService.adicionarObservacao(p)
              .subscribe(
              () => { 
                this.swal.showSwalSuccess('Observação Adicionada com Sucesso!');
                this.router.navigate(['observacao/lista']);
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
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'Observacao', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.observacaoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.observacaoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.observacaoForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.observacaoService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

async OnChangeEmpresa(empresaId) : Promise<void> {
        
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Observacao', this.grupoEmpresaId, empresaId);
    
    if(this.mascSequencial != null)
    {
        if(this.mascSequencial.sequencial === 'S')
        {
            this.observacaoForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {   
            this.observacaoForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }
    }
    else
    {
      this.observacaoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }

}

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  } 


  cancelar() {
    this.router.navigate(['observacao/lista']);
}

limparCampoCodigo(){
  this.observacaoForm.controls['codigo'].setValue('');
  this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
}
 
}

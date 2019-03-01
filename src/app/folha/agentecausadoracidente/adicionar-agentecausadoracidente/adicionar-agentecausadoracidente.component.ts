import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgenteCausadorAcidente } from '../models/agentecausadosacidente';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AgenteCausadorAcidenteService } from '../agentecausadoracidente.service';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Mascara } from '../../../cadastros/mascara/models/mascara';

@Component({
  selector: 'app-adicionar-agentecausadoracidente',
  templateUrl: './adicionar-agentecausadoracidente.component.html',
  styleUrls: []
})
export class AdicionarAgentecausadoracidenteComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public agenteCausadorAcidente: AgenteCausadorAcidente;
  public agenteCausadorAcidenteForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private genericValidator: GenericValidator;
  
  public errors: any[] = [];
  public codMask = [];

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  constructor(
    private agenteCausadorAcidenteService: AgenteCausadorAcidenteService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router,
    private renderer: Renderer
  ) {

    this.validationMessages = {
      codigo: {
          required: 'O Código é requerido.',
          minlength: 'O Código precisa ter no mínimo 2 caracteres',
          maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
          required: 'A Sigla é requerida.',
          minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
          maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
      },
      descricao: {
          required: 'A Descrição é requerida.',
          minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
          maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.agenteCausadorAcidente = new AgenteCausadorAcidente();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.agenteCausadorAcidenteForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.agenteCausadorAcidenteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.agenteCausadorAcidenteForm);
    });
  }

  async adicionarAgenteCausadorAcidente(): Promise<void> {
    if (this.agenteCausadorAcidenteForm.dirty && this.agenteCausadorAcidenteForm.valid) {

      const p = Object.assign({}, this.agenteCausadorAcidente, this.agenteCausadorAcidenteForm.getRawValue());

      if(this.mascSequencial.sequencial === "S"){

            this.agenteCausadorAcidenteService.AdicionarAgenteCausador(p)
            .subscribe(
              result => {
                  if (result) {
                      this.swal.showSwalSuccess('Agente Causador Acidente, Adicionado com Sucesso!');
                      this.router.navigate(['agentecausadoracidente/lista']);
                  } else {
                      this.swal.showSwalErro('Ocorreu um erro ao gravar!');
                  }
              },
              error => {
                console.error(error);
            });

      }
      else{

        let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
        let agenteCausador = await this.agenteCausadorAcidenteService.ObterAgenteCausadorPorCodigo(codigo).toPromise();

        if(agenteCausador != null){

            var self = this;
            this.swal.showSwalErrorCodigo('Informe um código que não esteja cadastrado!', function (isConfirmed) {
                if (isConfirmed) {
                  self.limparCampoCodigo();
                }
                else {
                  
                }
            });

        }
        else{

            this.agenteCausadorAcidenteService.AdicionarAgenteCausador(p)
            .subscribe(
              result => {
                  if (result) {
                      this.swal.showSwalSuccess('Agente Causador Acidente, Adicionado com Sucesso!');
                      this.router.navigate(['agentecausadoracidente/lista']);
                  } else {
                      this.swal.showSwalErro('Ocorreu um erro ao gravar!');
                  }
              },
              error => {
                console.error(error);
            });

        }

      }

      
    }
  }

  limparCampoCodigo(){
    this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['agentecausadoracidente/lista']);
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'AgenteCausadorAcidente', this.grupoEmpresaId);

    if(this.mascSequencial != null){

        if(this.mascSequencial.sequencial === 'S'){
            this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
          this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
          this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
          this.maskValid = true;
        } 
    }
    else{
      this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
    }

    this.empresas = [];
    this.agenteCausadorAcidenteService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  async OnChangeEmpresa(empresaId) : Promise<void> {
    
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'AgenteCausadorAcidente', this.grupoEmpresaId, empresaId);
    
    if(this.mascSequencial != null){
      
        if(this.mascSequencial.sequencial === 'S'){
          this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
          this.maskValid = false;
        }
        else{
          this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
          this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
          this.maskValid = true;
          
        }
    }
    else{
      this.agenteCausadorAcidenteForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }
  
  }

}


import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { DescontoService } from '../desconto.service';
import { MaskService } from '../../../services/mask.service';
import { Desconto, GrupoDesconto, TipoDesconto, Tarefa } from '../models/desconto';
import { Mascara } from '../../mascara/models/mascara';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-adicionar-desconto',
  templateUrl: './adicionar-desconto.component.html',
  styleUrls: []
})

export class AdicionarDescontoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public desconto: Desconto;
  public descontoForm: FormGroup;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public grupoDescontos: GrupoDesconto[];
  public tipoDescontos: TipoDesconto[];
  public tarefas: Tarefa[];
  public mascara: Mascara;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private descontoService: DescontoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router,
    private renderer: Renderer) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
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
      // grupoDescontoId:
      // {
      //   required: 'Grupo Desconto requerido.'
      // },
      tipoDescontoId:
      {
        required: 'Tipo Desconto requerido.'
      },
      percentualValor:
      {
        required: 'Percentual/Valor requerido.'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.desconto = new Desconto();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.descontoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: [''],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      grupoDescontoId: null,
      tipoDescontoId: ['', [Validators.required]],
      ordemCalculo: [],
      quantidadeDiasAposVencimento: [],
      percentualValor: ['', [Validators.required]],
      valorAplicar: [],
      progressivoFatorTempo: [],
      progressivoDias: 0,
      progressivoDiaUtil: 'N',
      progressivoMesAnterior: 'N',
      exigeLiberacao: 'N',
      perdeAposVencimento: 'N',
      cumulativo: 'N',
      consideraCalculoDescCumulativo: 'N',
      excluido: 'N'
    });

    this.descontoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        errerror => this.errors);

    // this.descontoService.obterTodosGrupoDesconto()
    //   .subscribe(grupoDescontos => {
    //     this.grupoDescontos = grupoDescontos
    //   },
    //     error => this.errors);

    this.descontoService.obterTodosTipoDesconto()
      .subscribe(tipoDescontos => {
        this.tipoDescontos = tipoDescontos
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.descontoForm);
    });
  }

   async adicionarDesconto() : Promise<void>{
    if (this.descontoForm.dirty && this.descontoForm.valid) {

      let p = Object.assign({}, this.desconto, this.descontoForm.getRawValue());

      let codigoSequencialPronto = await this._maskService.GerarCodigoSequencial(this.mascSequencial, 3);
      
      console.log(codigoSequencialPronto);

      //console.log(this.mascSequencial);

      // if(this.mascSequencial == null){
      //   this.mascSequencial = new Mascara();
      //   this.mascSequencial.sequencial = 'N';
      // }

      // if(this.mascSequencial.sequencial === 'S'){
        
      //   this.descontoService.AdicionarDesconto(p).subscribe(
      //     result => {
      //       this.swal.showSwalSuccess('Desconto Adicionado com Sucesso!');
      //       this.router.navigate(['desconto/lista']);
      //     },
      //     error => {
      //       this.onError(error)
      //     });
        
      // }
      // else{

      //   let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
      //   let desconto = await this.descontoService.ObterDescontoPorCodigo(codigo).toPromise();

      //   if(desconto.length > 0){
          
      //     var self = this;
      //     this.swal.showSwalErrorCodigo('Informe um código que não esteja cadastrado!', function (isConfirmed) {
      //         if (isConfirmed) {
      //           self.limparCampoCodigo();
      //         }
      //         else {
                
      //         }
      //     });
            
      //   }
      //   else{

      //     this.descontoService.AdicionarDesconto(p).subscribe(
      //       result => {
      //         this.swal.showSwalSuccess('Desconto Adicionado com Sucesso!');
      //         this.router.navigate(['desconto/lista']);
      //       },
      //       error => {
      //         this.onError(error)
      //       });

      //   }
      // }

      
    }
  }

  limparCampoCodigo(){
    this.descontoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['desconto/lista']);
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'Desconto', this.grupoEmpresaId);

    if(this.mascSequencial != null){

      if(this.mascSequencial.sequencial === 'S'){
          this.descontoForm.controls['codigo'].setValue('');
          this.maskValid = false;
      }
      else{
        this.descontoForm.controls['codigo'].setValue('');
        this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
        this.maskValid = true;
      } 
    }
    else{
      this.descontoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
    }
    
    this.empresas = [];
    this.descontoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  async OnChangeEmpresa(empresaId) : Promise<void> {
    
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Desconto', this.grupoEmpresaId, empresaId);
    
    if(this.mascSequencial != null){
      
        if(this.mascSequencial.sequencial === 'S'){
          this.descontoForm.controls['codigo'].setValue('');
          this.maskValid = false;
        }
        else{
          this.descontoForm.controls['codigo'].setValue('');
          this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
          this.maskValid = true;
          
        }
    }
    else{
      this.descontoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
      
    }
  
  }

}
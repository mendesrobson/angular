import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaContaReceber, TipoCategoria, ClassificacaoCategoria, CategoriaContaReceberPai } from "../models/categoriacontareceber";
import { SweetAlertAdviceService } from "../../../services/sweetalert.advice.service";
import { GenericValidator } from "../../../validation/generic-form-validator";
import { CategoriaContaReceberService } from "../categoriacontareceber.service";
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-categoriacontareceber',
  templateUrl: './adicionar-categoriacontareceber.component.html'
})
export class AdicionarCategoriaContaReceberComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public categoriaContaReceber: CategoriaContaReceber;
  public categoriaContaReceberForm: FormGroup;

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tiposCategoria: TipoCategoria[];
  public classificacaoCategorias: ClassificacaoCategoria[];
  public categoriaContaReceberPai: CategoriaContaReceberPai[];

  public errors: any[] = [];
  public codMask = [];

  constructor(
    private categoriaContaReceberService: CategoriaContaReceberService,
    private fb: FormBuilder,
    private router: Router,
    private _maskService: MaskService,
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
        required: 'Código requerido.'
      },
      descricao: {
        required: 'Descrição requerida.'
      },
      tipo: {
        required: 'Tipo requerido.'
      },
      classificacao: {
        required: 'Classificação requerida.'
      }
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.categoriaContaReceber = new CategoriaContaReceber();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit(): void {
    this.categoriaContaReceberForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      excluido: 'N',
      codigo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      categoriaContaReceberPaiId: [{ value: '' }],
      classificacao: ['', [Validators.required]],
      considerarContratos: 'N',
      considerarEventosFixos: 'N',
      considerarEventosMensais: 'N',
      considerarAdicionalAnual: 'N',
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });

    this.categoriaContaReceberService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    // this.categoriaContaReceberService.getTipoCategoria()
    //   .subscribe(tiposCategoria => {
    //     this.tiposCategoria = tiposCategoria

    //   },
    //     error => this.errors);
    this.tiposCategoria = [
      {
        "id": "TOT",
        "valor": "Totalizadora"
      },
      {
        "id": "NTOT",
        "valor": "Não Totalizadora"
      }
    ];

    // this.categoriaContaReceberService.getClassificacaoCategoria()
    //   .subscribe(classificacaoCategorias => {
    //     this.classificacaoCategorias = classificacaoCategorias
    //   },
    //   error => this.errors) ;

    this.classificacaoCategorias = [
      {
        "id": "REC",
        "valor": "Receitas"
      },
      {
        "id": "ODES",
        "valor": "Outras Despesas"
      },
      {
        "id": "IMP",
        "valor": "Impostos"
      },
      {
        "id": "TAX",
        "valor": "Taxas"
      },
      {
        "id": "OUT",
        "valor": "Outros"
      }
    ];

    this.categoriaContaReceberService.obterTodosCategoriaContaReceberPai()
      .subscribe(categoriaContaReceberPai => {
        this.categoriaContaReceberPai = categoriaContaReceberPai
      },
        error => this.errors);


  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.categoriaContaReceberForm);
    });
  }

  async adicionarCategoriaContaReceber(): Promise<void> {

    if (this.categoriaContaReceberForm.dirty && this.categoriaContaReceberForm.valid) {
      let p = Object.assign({}, this.categoriaContaReceber, this.categoriaContaReceberForm.value);

      if(this.mascSequencial == null){
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if(this.mascSequencial.sequencial === 'S')
      {
          this.categoriaContaReceberService.adicionarCategoriaContaReceber(p)
          .subscribe(
            result => {
              this.swal.showSwalSuccess('Categoria de Conta a Receber Adicionada com Sucesso!');
              this.router.navigate(['categoriacontareceber/lista']);
            },
            error => {
              this.onError(error)
            });
      }
      else
      {
          let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
          let categoriaContaReceber = await this.categoriaContaReceberService.ObterCategoriaContaReceberPorCodigo(codigo).toPromise();

          if(categoriaContaReceber != null)
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
            this.categoriaContaReceberService.adicionarCategoriaContaReceber(p)
            .subscribe(
              result => {
                this.swal.showSwalSuccess('Categoria de Conta a Receber Adicionada com Sucesso!');
                this.router.navigate(['categoriacontareceber/lista']);
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
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'CategoriaContaReceber', this.grupoEmpresaId);

    if(this.mascSequencial != null)
    {   
        if(this.mascSequencial.sequencial === "S")
        {
            this.categoriaContaReceberForm.controls['codigo'].setValue('');
            this.maskValid = false;
        }
        else
        {
            this.categoriaContaReceberForm.controls['codigo'].setValue('');
            this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
            this.maskValid = true;
        }

    }
    else
    {
        this.categoriaContaReceberForm.controls['codigo'].setValue('');
        this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.maskValid = true;
    }

    this.empresas = [];
    this.categoriaContaReceberService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

async OnChangeEmpresa(empresaId) : Promise<void> {
        
  this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'CategoriaContaReceber', this.grupoEmpresaId, empresaId);
  
  if(this.mascSequencial != null)
  {
      if(this.mascSequencial.sequencial === 'S')
      {
          this.categoriaContaReceberForm.controls['codigo'].setValue('');
          this.maskValid = false;
      }
      else
      {   
          this.categoriaContaReceberForm.controls['codigo'].setValue('');
          this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
          this.maskValid = true;
      }
  }
  else
  {
    this.categoriaContaReceberForm.controls['codigo'].setValue('');
    this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    this.maskValid = true;
    
  }

}

limparCampoCodigo(){
  this.categoriaContaReceberForm.controls['codigo'].setValue('');
  this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
}

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['categoriacontareceber/lista']);
  }

}

import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TipoCategoria, ClassificacaoCategoria, CategoriaContaReceberPai, CategoriaContaReceber } from '../models/categoriacontareceber';
import { CategoriaContaReceberService } from '../categoriacontareceber.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';


@Component({
  selector: 'app-excluir-categoriacontareceber',
  templateUrl: './excluir-categoriacontareceber.component.html'
})
export class ExcluirCategoriaContaReceberComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public categoriaContaReceber : CategoriaContaReceber;
  public categoriaContaReceberForm : FormGroup;
  public sub: Subscription;

  public categoriaContaReceberId: string = "";

  swal: SweetAlertAdviceService;
  
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tiposCategoria: TipoCategoria[];
  public classificacaoCategorias: ClassificacaoCategoria[];
  public categoriaContaReceberPai: CategoriaContaReceberPai[];

  
  public errors: any[] = [];

  constructor(
    private categoriaContaReceberService: CategoriaContaReceberService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaContaReceber = new CategoriaContaReceber();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit(): void {
    this.categoriaContaReceberForm = this.fb.group({
      grupoEmpresaId: '',
      empresaId: '',
      excluido: 'N',
      codigo: '',
      descricao: '',
      tipo: '',
      categoriaContaReceberPaiId: [{value: ''}],
      classificacao: '',
      considerarContratos: false,
      considerarEventosFixos: false,
      considerarEventosMensais: false,
      considerarAdicionalAnual: false,
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });


    this.sub = this.route.params.subscribe(
      params => {
        this.categoriaContaReceberId = params['id'];
        this.obterCategoriaContaReceber(this.categoriaContaReceberId);
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
    //   error => this.errors);
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

      var self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
          self.removerCategoriaContaReceber();
          }
      else {
          self.cancelar();
        }});  
  }

  obterCategoriaContaReceber(id: string) {
    this.categoriaContaReceberService.obterCategoriaContaReceber(id)
      .subscribe(            
        CategoriaContaReceber => this.preencherFormCategoriaContaReceber(CategoriaContaReceber),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
 }
 
 preencherFormCategoriaContaReceber(categoriaContaReceber : CategoriaContaReceber): void {
   this.categoriaContaReceber = categoriaContaReceber;

   this.categoriaContaReceberForm.controls['codigo'].disable();

   this.categoriaContaReceberForm.patchValue({
    id: this.categoriaContaReceber.id, 
    codigo: this.categoriaContaReceber.codigo,
    descricao: this.categoriaContaReceber.descricao,
    tipo: this.categoriaContaReceber.tipo,
    categoriaContaReceberPaiId: this.categoriaContaReceber.categoriaContaReceberPaiId,            
    grupoEmpresaId: this.categoriaContaReceber.grupoEmpresaId,
    empresaId: this.categoriaContaReceber.empresaId,
    classificacao: this.categoriaContaReceber.classificacao,
    considerarContratos: this.categoriaContaReceber.considerarContratos,
    considerarEventosFixos: this.categoriaContaReceber.considerarEventosFixos,
    considerarEventosMensais: this. categoriaContaReceber.considerarEventosMensais,
    considerarAdicionalAnual: this.categoriaContaReceber.considerarAdicionalAnual,
     });

 }

 ConsultaEmpresa(idGrupo) {
  this.empresas = [];
  this.categoriaContaReceberService.obterTodosEmpresaPorGrupo(idGrupo)
      .subscribe(empresas => {
          this.empresas = empresas
      },
          () => this.errors);
}

 cancelar() {
  this.router.navigate(['categoriacontareceber/editar/'+ this.categoriaContaReceberId]);
}

removerCategoriaContaReceber() {
  this.categoriaContaReceberService.removerCategoriaContaReceber(this.categoriaContaReceber)
  .subscribe(
  result => { 
    this.swal.showSwalSuccess('Categoria de Contas a Receber Removida com Sucesso');
    this.router.navigate(['categoriacontareceber/lista']);
  },
  error => { 
    error => this.errors;
  });
}


}

import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { CategoriaContaPagar, TipoCategoria } from '../models/categoriacontapagar';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { CategoriaContaPagarService } from '../categoriacontapagar.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-categoriacontapagar',
  templateUrl: './editar-categoriacontapagar.component.html',
  styleUrls: []
})
export class EditarCategoriaContaPagarComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public categoriaContaPagar: CategoriaContaPagar;
  public categoriaContaPagarForm: FormGroup;
  public categoriaContaPagarId: string = "";
  public tiposCategoria: TipoCategoria[];

  public categoriaContaPagarPai: CategoriaContaPagar[];

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;

  private result = {};
  public errors: any[] = [];

  constructor(
    private categoriaContaPagarService: CategoriaContaPagarService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

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
        required: 'Descrição requerido.'
      },
      tipo: {
        required: 'Tipo requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.categoriaContaPagar = new CategoriaContaPagar();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.categoriaContaPagarForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      excluido: 'N',
      codigo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      categoriaContaPagarPaiId: null,
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.categoriaContaPagarId = params['id'];
        this.obterCategoriaContaPagar(this.categoriaContaPagarId);
      });


    this.categoriaContaPagarService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.categoriaContaPagarService.obterTodosCategoriaContaPagarPai()
      .subscribe(categoriaContaPagarPai => {
        this.categoriaContaPagarPai = categoriaContaPagarPai
      },
        error => this.errors);

    // this.categoriaContaPagarService.buscaTipoCategoria()
    // .subscribe(tiposCategoria => {
    //   this.tiposCategoria = tiposCategoria
    // },
    // error => this.errors);
    this.tiposCategoria = [
      {
        "sigla": "TOT",
        "descricao": "Totalizadora"
      },
      {
        "sigla": "NTOT",
        "descricao": "Não Totalizadora"
      }
    ];
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.categoriaContaPagarForm);
    });
  }

  obterCategoriaContaPagar(id: string) {
    this.categoriaContaPagarService.obterCategoriaContaPagar(id)
      .subscribe(
        categoriaContaPagar => this.preencherCategoriaContaPagarForm(categoriaContaPagar),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherCategoriaContaPagarForm(categoriaContaPagar: CategoriaContaPagar): void {
    this.categoriaContaPagar = categoriaContaPagar;

    this.reativarVisivel = this.categoriaContaPagar.excluido === 'S';
    this.removerVisivel = this.categoriaContaPagar.excluido === 'N';

    this.categoriaContaPagarForm.controls['codigo'].disable();

    this.categoriaContaPagarForm.patchValue({
      id: this.categoriaContaPagar.id,
      codigo: this.categoriaContaPagar.codigo,
      descricao: this.categoriaContaPagar.descricao,
      tipo: this.categoriaContaPagar.tipo,
      categoriaContaPagarPaiId: this.categoriaContaPagar.categoriaContaPagarPaiId,
      grupoEmpresaId: this.categoriaContaPagar.grupoEmpresaId,
      empresaId: this.categoriaContaPagar.empresaId
    });
  }

  editarCategoriaContaPagar() {
    if (this.categoriaContaPagarForm.dirty && this.categoriaContaPagarForm.valid) {
      let p = Object.assign({}, this.categoriaContaPagar, this.categoriaContaPagarForm.value);

      this.categoriaContaPagarService.atualizarCategoriaContaPagar(p)
        .subscribe(
          result => {
            console.log(result);
            this.swal.showSwalSuccess('Categoria atualizada com Sucesso');
            this.router.navigate(['categoriacontapagar/lista']);
          },
          error => {
            this.errors;
          })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.categoriaContaPagarService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

  cancelar() {
    this.router.navigate(['categoriacontapagar/lista']);
  }

  remover(id) {
    this.router.navigate(['categoriacontapagar/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['categoriacontapagar/reativar/' + id]);
  }

}

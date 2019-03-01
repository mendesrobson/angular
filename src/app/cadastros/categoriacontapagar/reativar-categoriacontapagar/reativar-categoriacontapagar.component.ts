import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { CategoriaContaPagar, TipoCategoria } from '../models/categoriacontapagar';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription } from 'rxjs';
import { CategoriaContaPagarService } from '../categoriacontapagar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-reativar-categoriacontapagar',
  templateUrl: './reativar-categoriacontapagar.component.html',
  styleUrls: []

})
export class ReativarCategoriaContaPagarComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  swal: SweetAlertAdviceService;

  private sub: Subscription;
  public categoriaContaPagar: CategoriaContaPagar;
  private categoriaContaPagarId: string;
  public errors: any[] = [];
  public categoriaContaPagarForm: FormGroup;
  public tiposCategoria: TipoCategoria[];

  public categoriaContaPagarPai: CategoriaContaPagar[];
  public selectTipo = [{ id: 'S', value: 'Totalizadora ' }, { id: 'N', value: 'Nao Totalizadora' }];

  constructor(
    private categoriaContaPagarService: CategoriaContaPagarService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
    this.swal = new SweetAlertAdviceService();
    this.categoriaContaPagar = new CategoriaContaPagar();
  }


  ngOnInit() {

    this.categoriaContaPagarForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: '',
      empresaId: '',
      excluido: 'N',
      codigo: '',
      descricao: '',
      tipo: '',
      categoriaContaPagarPaiId: '',
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

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarCategoriaContaPagar();
      }
      else {
        self.cancelar();
      }
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

  cancelar() {
    this.router.navigate(['categoriacontapagar/editar/' + this.categoriaContaPagarId]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.categoriaContaPagarService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}

  reativarCategoriaContaPagar() {
    this.categoriaContaPagarService.reativarCategoriaContaPagar(this.categoriaContaPagar)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Categoria reativada com sucesso')
        this.router.navigate(['categoriacontapagar/lista']);
      },
      error => {
        this.errors;
      });
  }

}

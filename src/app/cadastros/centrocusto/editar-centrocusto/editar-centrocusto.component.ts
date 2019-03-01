import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { CentroCusto, CentroCustoPai, ClassificacaoCentroCusto, TipoCentro } from '../models/centrocusto';
import { CentroCustoService } from '../centrocusto.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';



@Component({
  selector: 'app-editar-centrocusto',
  templateUrl: './editar-centrocusto.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class EditarCentrocustoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public centroCusto: CentroCusto;
  public centroCustoForm: FormGroup;
  public centroCustoId: string = "";
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  temCodigoCentroCusto: Boolean;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public centroCustoPais: CentroCustoPai[];
  public classificacaoCentroCustos: ClassificacaoCentroCusto[];
  public tipoCentros: TipoCentro[];

  public errors: any[] = [];

  constructor(
    private centroCustoService: CentroCustoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      classificacaoCentroCustoId: {
        required: 'Informe a Classificação'
      },
      tipoCentroId: {
        required: 'Informe o Tipo de Centro'
      },
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 1 caracter',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.centroCusto = new CentroCusto();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {

    this.centroCustoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      centroCustoPaiId: [],
      codigo: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)]],
      sigla: [],
      classificacaoCentroCustoId: ['', [Validators.required]],
      tipoCentroId: ['', [Validators.required]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]]
    });

    this.centroCustoForm.controls['centroCustoPaiId'].disable();
    this.centroCustoForm.controls['codigo'].disable();

    this.sub = this.route.params.subscribe(
      params => {
        this.centroCustoId = params['id'];
        this.obterCentroCusto(this.centroCustoId);
      });

    this.centroCustoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.centroCustoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.centroCustoService.obterTodosCentroCustoPai()
      .subscribe(centroCustoPais => {
        this.centroCustoPais = centroCustoPais
      },
        error => this.errors);

    this.centroCustoService.obterTodosClassificacaoCentroCusto()
      .subscribe(classificacaoCentroCustos => {
        this.classificacaoCentroCustos = classificacaoCentroCustos
      },
        error => this.errors);

    this.centroCustoService.obterTodosTipoCentro()
      .subscribe(tipoCentros => {
        this.tipoCentros = tipoCentros
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.centroCustoForm);
    });
  }

  obterCentroCusto(id: string) {
    this.centroCustoService.obterCentroCusto(id)
      .subscribe(
        centroCusto => this.preencherFormCentroCusto(centroCusto),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormCentroCusto(centroCusto: CentroCusto): void {
    this.centroCusto = centroCusto;

    this.reativarVisivel = this.centroCusto.excluido === 'S';
    this.removerVisivel = this.centroCusto.excluido === 'N';

    this.centroCustoForm.patchValue({
      codigo: this.centroCusto.codigo,
      sigla: this.centroCusto.sigla,
      descricao: this.centroCusto.descricao,
      empresaId: this.centroCusto.empresaId,
      grupoEmpresaId: this.centroCusto.grupoEmpresaId,
      centroCustoPaiId: this.centroCusto.centroCustoPaiId,
      classificacaoCentroCustoId: this.centroCusto.classificacaoCentroCustoId,
      tipoCentroId: this.centroCusto.tipoCentroId
    });
  }

  editarCentroCusto() {
    if (this.centroCustoForm.dirty && this.centroCustoForm.valid) {

      let p = Object.assign({}, this.centroCusto, this.centroCustoForm.getRawValue());

      //p.
      this.centroCustoService.ObterCodigoCentroCusto(p.codigo)
        .subscribe(result => {
          console.log(result);
        });
      // this.centroCustoService.ObterCodigoCentroCusto(p.codigo)
      //   .subscribe(
      //   result => {
      //     if (result[0] != undefined) {
      //       if (result[0].id != p.id) {
      //         this.displayMessage.codigo = 'Código Existente já Adicionado!';
      //         this.router.navigate(['centrocusto/editar/' + p.id]);
      //       } else {
      this.centroCustoService.AtualizarCentroCusto(p).subscribe(
        result => {
          this.swal.showSwalSuccess('Centro Custo, Atualizado com Sucesso!');
          this.router.navigate(['centrocusto/lista']);
        },
        error => {
          this.onError(error)
        })
      //     }
      //   }
      // })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['centrocusto/lista']);
  }

  remover(id) {
    this.router.navigate(['centrocusto/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['centrocusto/reativar/' + id]);
  }
  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.centroCustoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }
}

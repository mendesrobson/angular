import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { CentroResultado, CentroResultadoPai, ClassificacaoCentroResultado, TipoCentro } from '../models/centroresultado';
import { CentroResultadoService } from '../centroresultado.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-centroresultado',
  templateUrl: './editar-centroresultado.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class EditarCentroresultadoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public centroResultado: CentroResultado;
  public centroResultadoForm: FormGroup;
  public centroResultadoId: string = "";
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  temCodigoCentroResultado: Boolean;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public centroResultadoPais: CentroResultadoPai[];
  public classificacaoCentroResultados: ClassificacaoCentroResultado[];
  public tipoCentros: TipoCentro[];

  public errors: any[] = [];

  constructor(
    private centroResultadoService: CentroResultadoService,
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
      classificacaoCentroResultadoId: {
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
    this.centroResultado = new CentroResultado();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {

    this.centroResultadoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      centroResultadoPaiId: [],
      codigo: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)]],
      sigla: [],
      classificacaoCentroResultadoId: ['', [Validators.required]],
      tipoCentroId: ['', [Validators.required]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]]
    });

    this.centroResultadoForm.controls['centroResultadoPaiId'].disable();
    this.centroResultadoForm.controls['codigo'].disable();

    this.sub = this.route.params.subscribe(
      params => {
        this.centroResultadoId = params['id'];
        this.obterCentroResultado(this.centroResultadoId);
      });

    this.centroResultadoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.centroResultadoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.centroResultadoService.obterTodosCentroResultadoPai()
      .subscribe(centroResultadoPais => {
        this.centroResultadoPais = centroResultadoPais
      },
        error => this.errors);

    this.centroResultadoService.obterTodosClassificacaoCentroResultado()
      .subscribe(classificacaoCentroResultados => {
        this.classificacaoCentroResultados = classificacaoCentroResultados
      },
        error => this.errors);

    this.centroResultadoService.obterTodosTipoCentro()
      .subscribe(tipoCentros => {
        this.tipoCentros = tipoCentros
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.centroResultadoForm);
    });
  }

  obterCentroResultado(id: string) {
    this.centroResultadoService.obterCentroResultado(id)
      .subscribe(
        centroResultado => this.preencherFormCentroResultado(centroResultado),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormCentroResultado(centroResultado: CentroResultado): void {
    this.centroResultado = centroResultado;

    this.reativarVisivel = this.centroResultado.excluido === 'S';
    this.removerVisivel = this.centroResultado.excluido === 'N';

    this.centroResultadoForm.patchValue({
      codigo: this.centroResultado.codigo,
      sigla: this.centroResultado.sigla,
      descricao: this.centroResultado.descricao,
      empresaId: this.centroResultado.empresaId,
      grupoEmpresaId: this.centroResultado.grupoEmpresaId,
      centroResultadoPaiId: this.centroResultado.centroResultadoPaiId,
      classificacaoCentroResultadoId: this.centroResultado.classificacaoCentroResultadoId,
      tipoCentroId: this.centroResultado.tipoCentroId
    });
  }

  editarCentroResultado() {

    if (this.centroResultadoForm.dirty && this.centroResultadoForm.valid) {

      let p = Object.assign({}, this.centroResultado, this.centroResultadoForm.getRawValue());

      this.centroResultadoService.ObterCodigoCentroResultado(p.codigo)
        .subscribe(
          result => {
            if (result[0] != undefined) {
              if (result[0].id != p.id) {
                this.displayMessage.codigo = 'Código Existente já Adicionado!';
                this.router.navigate(['centroresultado/editar/' + p.id]);
              } else {
                this.centroResultadoService.AtualizarCentroResultado(p).subscribe(
                  result => {
                    this.swal.showSwalSuccess('Centro Resultado, Atualizado com Sucesso!');
                    this.router.navigate(['centroresultado/lista']);
                  },
                  error => {
                    this.onError(error)
                  })
              }
            }
          })
    }

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['centroresultado/lista']);
  }

  remover(id) {
    this.router.navigate(['centroresultado/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['centroresultado/reativar/' + id]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.centroResultadoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

}

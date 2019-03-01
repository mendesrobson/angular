import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { MaskService } from '../../../services/mask.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CentroResultado, CentroResultadoPai, ClassificacaoCentroResultado, TipoCentro } from '../models/centroresultado';
import { CentroResultadoService } from '../centroresultado.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { DxTreeViewComponent } from 'devextreme-angular';


@Component({
  selector: 'app-adicionar-centroresultado',
  templateUrl: './adicionar-centroresultado.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class AdicionarCentroresultadoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  @ViewChild(DxTreeViewComponent) treeView;

  treeBoxValue: string;
  public centroResultado: CentroResultado;
  public centroResultadoForm: FormGroup;

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

  public codMask = [];

  constructor(
    private centroResultadoService: CentroResultadoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router) {

    this.codMask = this._maskService.CodigoMaskNivel(1, "CentroResultado", "");

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

    this.centroResultadoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
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

  adicionarCentroResultado() {
    if (this.centroResultadoForm.dirty && this.centroResultadoForm.valid) {

      let p = Object.assign({}, this.centroResultado, this.centroResultadoForm.value);

      if (p.centroResultadoPaiId != null) {
        if (p.centroResultadoPaiId[0] != null) {
          p.centroResultadoPaiId = p.centroResultadoPaiId[0];
        }
      }

      this.centroResultadoService.ObterCodigoCentroResultado(p.codigo)
        .subscribe(
          result => {
            if (result[0] != undefined) {
              this.displayMessage.codigo = 'Código Existente já Adicionado!';
              this.router.navigate(['centroresultado/adicionar']);
            } else {
              this.centroResultadoService.AdicionarCentroResultado(p).subscribe(
                result => {
                  this.swal.showSwalSuccess('Centro Resultado, Adicionado com Sucesso!');
                  this.router.navigate(['centroresultado/lista']);
                },
                error => {
                  this.onError(error)
                })
            }
          })

    }
  }

  preencherCodigoPai(id) {
    let centroPai: CentroResultadoPai;
    for (let i = 0; this.centroResultadoPais.length > i; i++) {
      if (this.centroResultadoPais[i].id == id) {
        centroPai = this.centroResultadoPais[i];
      }
    }
    this.centroResultado.codigo = centroPai.codigo + ".__";

    this.codMask = this._maskService.CodigoMaskNivel(1, "CentroResultado", centroPai.codigo);

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['centroresultado/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.centroResultadoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });

  }

  treeView_itemSelectionChanged(e) {
    this.treeBoxValue = e.component.getSelectedNodesKeys();
    this.preencherCodigoPai(this.treeBoxValue);
  }
  syncTreeViewSelection() {
    if (!this.treeView) return;

    if (!this.treeBoxValue) {
      this.treeView.instance.unselectAll();
    } else {
      this.treeView.instance.selectItem(this.treeBoxValue);
    }
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.centroResultadoPais = [];
    this.centroResultadoService.obterTodosCentroResultadoPaiPorEmpresaId(idEmpresa)
      .subscribe(centroResultadoPais => {
        this.centroResultadoPais = centroResultadoPais
      },
        () => { });
  }
}









import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { MaskService } from '../../../services/mask.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CentroCusto, CentroCustoPai, ClassificacaoCentroCusto, TipoCentro } from '../models/centrocusto';
import { CentroCustoService } from '../centrocusto.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import {
  DxDropDownBoxModule,
  DxTreeViewModule,
  DxDataGridModule,
  DxTreeViewComponent
} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-adicionar-centrocusto',
  templateUrl: './adicionar-centrocusto.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class AdicionarCentrocustoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  @ViewChild(DxTreeViewComponent) treeView;

  treeBoxValue: string;
  public centroCusto: CentroCusto;
  public centroCustoForm: FormGroup;

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

  public codMask = [];

  public errors: any[] = [];

  //treeBoxValue: string;

  constructor(
    private centroCustoService: CentroCustoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router) {

    this.codMask = this._maskService.CodigoMaskNivel(1, "CentroCusto", "");

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

    this.centroCustoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
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

  adicionarCentroCusto() {
    if (this.centroCustoForm.dirty && this.centroCustoForm.valid) {

      let p = Object.assign({}, this.centroCusto, this.centroCustoForm.value);

      if (p.centroCustoPaiId != null) {
        if (p.centroCustoPaiId[0] != null) {
          p.centroCustoPaiId = p.centroCustoPaiId[0];
        }
      }

      this.centroCustoService.ObterCodigoCentroCusto(p.codigo)
        .subscribe(result => {
          console.log(result);
        });

      this.centroCustoService.AdicionarCentroCusto(p).subscribe(
        result => {
          this.swal.showSwalSuccess('Centro Custo, Adicionado com Sucesso!');
          this.router.navigate(['centrocusto/lista']);
        },
        error => {
          this.onError(error)
        });

      //   }
      // })
    }
  }


  preencherCodigoPai(id) {
    let centroPai: CentroCustoPai;
    for (let i = 0; this.centroCustoPais.length > i; i++) {
      if (this.centroCustoPais[i].id == id) {
        centroPai = this.centroCustoPais[i];
      }
    }
    this.centroCusto.codigo = centroPai.codigo + ".__";

    this.codMask = this._maskService.CodigoMaskNivel(1, "CentroCusto", centroPai.codigo);

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

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['centrocusto/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.centroCustoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.centroCustoPais = [];
    this.centroCustoService.obterTodosCentroCustoPaiPorEmpresaId(idEmpresa)
      .subscribe(centroCustoPais => {
        this.centroCustoPais = centroCustoPais
      },
        () => { });
  }
}










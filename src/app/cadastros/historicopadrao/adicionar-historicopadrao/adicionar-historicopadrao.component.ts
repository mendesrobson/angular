import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, ViewContainerRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { HistoricoPadraoService } from '../historicopadrao.service';
import { HistoricoPadrao } from '../models/historicopadrao';
import { HistoricopadraoComponent } from '../historicopadrao.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { ToastsManager, Toast } from 'ng2-toastr';
import { DxTreeViewComponent } from 'devextreme-angular';

@Component({
  selector: 'app-adicionar-historicopadrao',
  templateUrl: './adicionar-historicopadrao.component.html',
  styleUrls: []
})
export class AdicionarHistoricopadraoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  @ViewChild(DxTreeViewComponent) treeView;

  public historicoPadrao: HistoricoPadrao;
  public historicoPadraoForm: FormGroup;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  treeBoxValue: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public historicosPadroes: HistoricoPadrao[];

  public errors: any[] = [];

  constructor(
    private historicoPadraoService: HistoricoPadraoService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private historicoPadraoComponent: HistoricopadraoComponent) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
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
      }
    };

    this.toastr.setRootViewContainerRef(vcr);
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.historicoPadrao = new HistoricoPadrao();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.historicoPadraoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      historicoPadraoPaiId: '',
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    this.historicoPadraoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.historicoPadraoForm);
    });

  }

  adicionarHistoricoPadrao() {
    if (this.historicoPadraoForm.dirty && this.historicoPadraoForm.valid) {

      let p = Object.assign({}, this.historicoPadrao, this.historicoPadraoForm.value);

      for (let i = 0; this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length > i; i++) {
        this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].id = 0;
        // this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].centroCusto = null;
        // this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].centroResultado = null;
      }

      p.historicoPadraoCentro = this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro;

      let somaCusto = 0;
      let somaResultado = 0;
      for (let i = 0; p.historicoPadraoCentro.length > i; i++) {
        if (p.historicoPadraoCentro[i].centroCustoId != null) {
          somaCusto += p.historicoPadraoCentro[i].percentual;
        }
        if (p.historicoPadraoCentro[i].centroResultadoId != null) {
          somaResultado += p.historicoPadraoCentro[i].percentual;
        }

      }

      if (somaCusto < 100) {
        this.historicoPadraoErro('A soma dos centros de custo não totalizam 100%');
      } else if (somaResultado < 100) {
        this.historicoPadraoErro('A soma dos centros de resultado não totalizam 100%');
      } else {
        this.historicoPadraoService.AdicionarHistoricoPadrao(p)
          .subscribe(
            result => {

              this.historicoPadrao = result;

              this.historicoPadraoComponent = null;

              this.swal.showSwalSuccess('Histórico Padrão Adicionado com Sucesso!');
              this.router.navigate(['historicopadrao/lista']);
            },
            error => {
              this.onError(error)
            })
      }

    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['historicopadrao/lista']);
  }

  public historicoPadraoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public historicoPadraoErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.historicoPadraoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }
  
  ConsultaSelectEmpresa(idEmpresa) {
    this.historicosPadroes = [];
    this.historicoPadraoComponent.HistoricoPadrao.empresaId = idEmpresa;

     this.historicoPadraoService.obterTodosHistoricoPadraoPaiPorEmpresaId(idEmpresa)
      .subscribe(historicosPadroes => {
        this.historicosPadroes = historicosPadroes
      },
        error => this.errors);
  }

  treeView_itemSelectionChanged(e) {
    this.treeBoxValue = e.component.getSelectedNodesKeys();
   // this.preencherCodigoPai(this.treeBoxValue);
  }
  syncTreeViewSelection() {
    if (!this.treeView) return;

    if (!this.treeBoxValue) {
      this.treeView.instance.unselectAll();
    } else {
      this.treeView.instance.selectItem(this.treeBoxValue);
    }
  }
}

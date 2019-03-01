
import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Titulo, TituloDesconto, Desconto } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { ListaTitulodescontoComponent } from '../lista-titulodesconto/lista-titulodesconto.component';
import { AdicionarTituloComponent } from '../adicionar-titulo/adicionar-titulo.component';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-editar-titulodesconto',
  templateUrl: './editar-titulodesconto.component.html',
  styleUrls: ['./editar-titulodesconto.component.css']
})
export class EditarTitulodescontoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tituloDesconto: TituloDesconto;
  public tituloDescontos = [];
  public tituloDescontoForm: FormGroup;
  public tituloId = 0;

  percOrValor = '$';

  public descontos: Desconto[];

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];


  constructor(private tituloService: TituloService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private listDesconto: ListaTitulodescontoComponent,
    private addTitulo: AdicionarTituloComponent,
    private tituloComponent: TituloComponent) {

    this.validationMessages = {
      descontoId: {
        required: 'Informe o desconto'
      },
      valorDesconto: {
        required: 'Informe o valor'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tituloDesconto = new TituloDesconto();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    this.tituloDescontoForm = this.fb.group({
      descontoId: 0,
      valorDesconto: 0
    });

    this.tituloService.obterTodosDescontoPorEmpresa(this.tituloComponent.titulo.empresaId)
    .subscribe(descontos => {
      this.descontos = descontos
    },
    error => this.errors);

    this.preencherTituloDescontoForm(this.tituloComponent.TituloDesconto);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

    });
  }

  editarDesconto() {

    this.addTitulo.excluirValorDesconto(this.tituloComponent.TituloDesconto.valorDesconto);

    if (this.tituloDescontoForm.dirty && this.tituloDescontoForm.valid) {

      let p = Object.assign({}, this.tituloDesconto, this.tituloDescontoForm.value);

      this.tituloComponent.dirty = true;
      
      for (var i = 0; i < this.descontos.length; i++) {
        if (p.descontoId == this.descontos[i].id) {
          p.desconto = this.descontos[i];
        }
      }

      let valorDesconto = 0;
      let valorLiquido = this.tituloComponent.Titulo.valorLiquido;
      let valorBruto = this.tituloComponent.Titulo.valorBruto;

      if (p.desconto.percentualValor == '$') {
        valorDesconto = p.valorDesconto;
      } else if (p.desconto.percentualValor == '%') {
        valorDesconto = (valorBruto * p.valorDesconto) / 100;
      }

      let valorAtual = valorLiquido - valorDesconto;

      if (valorAtual < 0) {

        this.listDesconto.descontoNaoGravado('Desconto ultrapassa o valor do título!');
        this.close();

      } else {

        this.listDesconto.atualizaStorage();

        if (this.tituloId > 0) {

          p.tituloId = this.tituloId;

          this.tituloService.AtualizarTituloDesconto(p)
            .subscribe(
            result => {
              this.listDesconto.atualizaStorage();
              this.listDesconto.descontoGravado('Desconto atualizado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
        } else {

          for (var i = 0; i < this.tituloComponent.Titulo.tituloDesconto.length; i++) {
            if (this.tituloComponent.TituloDesconto.id == this.tituloComponent.Titulo.tituloDesconto[i].id) {
              this.tituloComponent.Titulo.tituloDesconto[i] = p;
            }
          }

          this.addTitulo.atualizarValorDesconto(valorDesconto);
          this.listDesconto.descontoGravado('Desconto atualizado com sucesso!');
          this.close();

        }

      }

    }

  }

  preencherTituloDescontoForm(tituloDesconto: TituloDesconto): void {

    this.tituloDesconto = tituloDesconto;

    this.tituloDescontoForm.patchValue({
      descontoId: this.tituloDesconto.descontoId,
      valorDesconto: this.tituloDesconto.valorDesconto
    })

  }

  onChange_Desconto(DescID) {
    
    this.tituloService.obterDescontoPorId(DescID)
      .subscribe(
      result => {

        if (result.percentualValor == '$') {
          this.percOrValor = '$';
        } else {
          this.percOrValor = '%';
        }

      },
      error => {
        this.errors;
      });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

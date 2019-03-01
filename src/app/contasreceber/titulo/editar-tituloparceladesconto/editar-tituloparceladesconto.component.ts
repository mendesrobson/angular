
import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Titulo, TituloDesconto, Desconto, ParcelaDesconto } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-editar-tituloparceladesconto',
  templateUrl: './editar-tituloparceladesconto.component.html',
  styleUrls: ['./editar-tituloparceladesconto.component.css']
})
export class EditarTituloparceladescontoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() ind: number = 0;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public parcelaDesconto: ParcelaDesconto;
  public parcelaDescontos = [];
  public parcelaDescontoForm: FormGroup;
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
    this.parcelaDesconto = new ParcelaDesconto();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    this.parcelaDescontoForm = this.fb.group({
      descontoId: 0,
      valorDesconto: 0
    });

    this.tituloService.obterTodosDescontoPorEmpresa(this.tituloComponent.titulo.empresaId)
      .subscribe(descontos => {
        this.descontos = descontos
      },
      error => this.errors);

    this.preencherParcelaDescontoForm(this.tituloComponent.ParcelaDesconto);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.parcelaDescontoForm);

    });
  }

  preencherParcelaDescontoForm(parcelaDesconto: ParcelaDesconto): void {

    this.parcelaDesconto = parcelaDesconto;

    let valor = 0;
    if (this.parcelaDesconto.desconto.percentualValor == '%') {
      valor = this.parcelaDesconto.percentualDesconto;
    } else {
      valor = this.parcelaDesconto.valorDesconto;
    }

    this.parcelaDescontoForm.patchValue({
      descontoId: this.parcelaDesconto.descontoId,
      valorDesconto: valor
    })

  }

  editarParcelaDesconto() {

    if (this.parcelaDescontoForm.dirty && this.parcelaDescontoForm.valid) {

      let p = Object.assign({}, this.parcelaDesconto, this.parcelaDescontoForm.value);
      p.parcela = this.tituloComponent.Titulo.parcela[this.ind];

      this.tituloComponent.dirty = true;

      if (this.tituloId > 0) {

        this.tituloService.GerarParcelaDescontosAngular(p)
          .subscribe(parcelaDesconto => {
            this.parcelaDesconto = parcelaDesconto;
            this.tituloComponent.Titulo.parcela[this.ind].valorDesconto = this.parcelaDesconto.valorDesconto;

            this.tituloService.AtualizarParcelaDesconto(this.parcelaDesconto)
              .subscribe(
              result => {

                this.tituloComponent.Titulo.parcela = [];
                this.tituloComponent.Titulo.tituloDesconto = [];
                this.tituloComponent.Titulo.tituloCentro = [];

                this.tituloService.AtualizarTitulo(this.tituloComponent.Titulo)
                  .subscribe(result => {
                    this.tituloComponent.Titulo = result;

                    this.tituloService.obterTituloPorId(this.tituloComponent.Titulo.id)
                    .subscribe(result => {
                      this.tituloComponent.Titulo = result;

                    },
                    error => {
                      this.onError(error)
                    });

                  },
                  error => {
                    this.onError(error)
                  });

              },
              error => {
                this.onError(error)
              });

          },
          error => this.errors);

      } else {

        this.tituloService.obterTodosDescontoPorEmpresa(this.tituloComponent.titulo.empresaId)
          .subscribe(descontos => {
            this.descontos = descontos;

            for (var i = 0; i < this.descontos.length; i++) {

              if (p.descontoId == this.descontos[i].id) {
                p.desconto = this.descontos[i];
                p.parcela = this.tituloComponent.Titulo.parcela[this.ind];
              }
            }

          },
          error => this.errors);

        p.parcela = this.tituloComponent.Titulo.parcela[this.ind];

        this.tituloService.GerarParcelaDescontosAngular(p)
          .subscribe(parcelaDesconto => {
            this.parcelaDesconto = parcelaDesconto;

            this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto[p.id] = this.parcelaDesconto;

            this.tituloComponent.Titulo.parcela[this.ind].valorDesconto = this.parcelaDesconto.valorDesconto;

          },
          error => this.errors);
      }

      this.close();

    }
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
    //this.router.navigate(['banco/lista']);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

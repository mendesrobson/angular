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
//import { ListaTitulodescontoComponent } from '../lista-titulodesconto/lista-titulodesconto.component';
//import { AdicionarTituloComponent } from '../adicionar-titulo/adicionar-titulo.component';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-adicionar-tituloparceladesconto',
  templateUrl: './adicionar-tituloparceladesconto.component.html',
  styleUrls: ['./adicionar-tituloparceladesconto.component.css']
})
export class AdicionarTituloparceladescontoComponent implements OnInit {
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
  public desconto: Desconto;

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
    //private listDesconto: ListaTitulodescontoComponent,
    //private addTitulo: AdicionarTituloComponent,
    private tituloComponent: TituloComponent) {

    this.validationMessages = {
      // descontoId: {
      //   required: 'Informe o desconto'
      // },
      // valorDesconto: {
      //   required: 'Informe o valor'
      // }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.parcelaDesconto = new ParcelaDesconto();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] === undefined) {
      this.tituloId = 0;
    } else {
      this.tituloId = this.route.snapshot.params['id'];
    }

    this.parcelaDescontoForm = this.fb.group({
      descontoId: 0,
      valorDesconto: 0,
      percentualDesconto: 0,
      dataLimiteDesconto: '',
      dataPrevisaoDesconto: ''
    });

    this.tituloService.obterTodosDescontoPorEmpresa(this.tituloComponent.titulo.empresaId)
      .subscribe(descontos => {
        this.descontos = descontos;
      },
      error => this.errors);
  }

  adicionarParcelaDesconto() {

    if (this.parcelaDescontoForm.dirty && this.parcelaDescontoForm.valid) {
      const p = Object.assign({}, this.parcelaDesconto, this.parcelaDescontoForm.value);
      const num = this.tituloComponent.Titulo.tituloDesconto.length;

      if (this.tituloComponent.Titulo.tituloDesconto.length === 0) {
        this.swal.showSwalError('Titulo Adicionado com Sucesso!', function(){});
        this.close();
        return;
      }

      p.tituloId = 0;

      this.tituloService.obterTodosDescontoPorEmpresa(this.tituloComponent.titulo.empresaId)
        .subscribe(descontos => {
          this.descontos = descontos;
          console.log("obterTodosDesconto");
          for (let i = 0; i < this.descontos.length; i++) {
            if (p.descontoId === this.descontos[i].id) {
              p.desconto = this.descontos[i];
              p.parcela = this.tituloComponent.Titulo.parcela[this.ind];
              p.parcelaId = this.tituloComponent.Titulo.parcela[this.ind].id;
            }
          }
        },
        error => this.errors);

      p.parcela = this.tituloComponent.Titulo.parcela[this.ind];
      p.parcelaId = this.tituloComponent.Titulo.parcela[this.ind].id;
      // p.id = this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto.length + 1;

      if (this.tituloId > 0) {

        this.tituloService.GerarParcelaDescontosAngular(p)
          .subscribe(parcelaDesconto => {
            this.parcelaDesconto = parcelaDesconto;

            this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto.push(this.parcelaDesconto);

            this.tituloComponent.Titulo.parcela[this.ind].valorDesconto += this.parcelaDesconto.valorDesconto;
            this.tituloComponent.Titulo.parcela[this.ind].valorLiquido -= this.parcelaDesconto.valorDesconto;

            this.tituloComponent.Titulo.valorDesconto += this.parcelaDesconto.valorDesconto;
            this.tituloComponent.Titulo.valorLiquido -= this.parcelaDesconto.valorDesconto;



            this.tituloService.AdicionarParcelaDesconto(this.parcelaDesconto)
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
                      this.onError(error);
                    });

                  },
                  error => {
                    this.onError(error);
                  });
              },
              error => {
                this.onError(error);
              });
          },
          error => this.errors);
        this.close();

      } else {

        this.tituloService.GerarParcelaDescontosAngular(p)
          .subscribe(parcelaDesconto => {
            this.parcelaDesconto = parcelaDesconto;

            this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto.push(this.parcelaDesconto);

            this.tituloComponent.Titulo.parcela[this.ind].valorDesconto += this.parcelaDesconto.valorDesconto;
            this.tituloComponent.Titulo.parcela[this.ind].valorLiquido -= this.parcelaDesconto.valorDesconto;

            this.tituloComponent.Titulo.valorDesconto += this.parcelaDesconto.valorDesconto;
            this.tituloComponent.Titulo.valorLiquido -= this.parcelaDesconto.valorDesconto;

          },
          error => this.errors);

        this.close();

      }

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
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

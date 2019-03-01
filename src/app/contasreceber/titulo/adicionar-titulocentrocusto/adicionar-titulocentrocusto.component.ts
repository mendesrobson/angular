import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Titulo, TituloCentro, CentroCusto } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { ListaTitulocentrocustoComponent } from '../lista-titulocentrocusto/lista-titulocentrocusto.component';
import { TituloComponent } from '../titulo.component';


@Component({
  selector: 'app-adicionar-titulocentrocusto',
  templateUrl: './adicionar-titulocentrocusto.component.html',
  styleUrls: ['./adicionar-titulocentrocusto.component.css']
})
export class AdicionarTitulocentrocustoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tituloCentro: TituloCentro;
  public tituloCentros = [];
  public listaTituloCentroCusto = [];
  public tituloCentroCustoForm: FormGroup;
  public tituloId = 0;

  public centroCustos: CentroCusto[];

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
    private listCentroCusto: ListaTitulocentrocustoComponent,
    private tituloComponent: TituloComponent,) {

    this.validationMessages = {
      centroCustoId: {
        required: 'Centro Custo requerido.'
      },
      percentual: {
        required: 'Percentual requerido.',
        min: 'Valor mínimo deve ser maior que 0',
        max: 'Valor máximo deve ser menor ou igual 100'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tituloCentro = new TituloCentro();
    this.swal = new SweetAlertAdviceService();
    // this.tituloComponent.Titulo.tituloCentro = [];
    //  this.listaTituloCentroCusto = [];

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    this.tituloCentroCustoForm = this.fb.group({
      centroCustoId: ['', [Validators.required]],
      centroResultadoId: 0,
      //codigo: '',
      //descricao: '',
      percentual: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.tituloService.obterTodosCentroCusto()
      .subscribe(centroCustos => {
        this.centroCustos = centroCustos
      },
      error => this.errors);

    //  this.tituloCentros = JSON.parse(localStorage.getItem("tituloCentroCusto"));
    if (this.tituloCentros == null) {
      this.tituloCentros = [];
    }

  }


  adicionarCentroCusto() {
    if (this.tituloComponent.Titulo.tituloCentro == undefined)
      this.tituloComponent.Titulo.tituloCentro = []

    if (this.tituloCentroCustoForm.dirty && this.tituloCentroCustoForm.valid) {
      let p = Object.assign({}, this.tituloCentro, this.tituloCentroCustoForm.getRawValue());


      for (var i = 0; i < this.centroCustos.length; i++) {
        if (p.centroCustoId == this.centroCustos[i].id) {
          p.centroCusto = this.centroCustos[i];
        }
      }
      p.centroResultado = null;


      let num = this.tituloComponent.Titulo.tituloCentro.length;

      p.id = num + 1;
      p.tituloId = this.tituloId;

      // this.listaTituloCentroCusto.push(p);



      if (this.tituloId > 0) {

        this.tituloComponent.Titulo.tituloCentro.push(p);
        if (!this.tituloService.validarPercentual(this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroCusto != null))) {

          this.listCentroCusto.centroCustoErro('O Centro de Custo não foi gravado! Os valores excedem 100%.');
          for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
            if (p.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
              this.tituloComponent.Titulo.tituloCentro.splice(i, 1);
            }
          }
          this.listCentroCusto.atualizaStorage();
          this.close()

        } else {
          this.listCentroCusto.atualizaStorage();

          p.centroCusto = null;

          this.tituloService.AdicionarTituloCentro(p)
            .subscribe(
            result => {
              // this.tituloComponent.Titulo.tituloCentro.push(p)



              this.tituloService.gerarApropriacaoCentroAngular(this.tituloComponent.titulo)
                .subscribe(
                result => {

                  for (var i = 0; i < this.tituloComponent.titulo.parcela.length; i++) {
                    this.tituloComponent.titulo.parcela[i].apropriacaoCentro = result;

                  }

                  this.listCentroCusto.centroCustoGravado('Centro Custo, Adicionado com Sucesso!');
                  this.close();

                }
                )



            },
            error => {
              this.errors;
            });
        }
      } else {
        // this.tituloCentros.push(p);


        this.tituloComponent.Titulo.tituloCentro.push(p)
        if (!this.tituloService.validarPercentual(this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroCusto != null))) {

          this.listCentroCusto.centroCustoErro('Centro de Custo não gravado, os valores excedem 100%');
          for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
            if (p.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
              this.tituloComponent.Titulo.tituloCentro.splice(i, 1);
            }
          }

          this.listCentroCusto.atualizaStorage();
          this.close()

        } else {
          this.listCentroCusto.atualizaStorage();
          this.listCentroCusto.centroCustoGravado('Centro Custo, Adicionado com Sucesso!');
          this.close();
        }
      }

    }
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


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tituloCentroCustoForm);
    });

  }
}







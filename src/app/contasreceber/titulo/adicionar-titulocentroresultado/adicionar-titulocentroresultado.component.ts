import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Titulo, TituloCentro, CentroResultado } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { ListaTitulocentroresultadoComponent } from '../lista-titulocentroresultado/lista-titulocentroresultado.component';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-adicionar-titulocentroresultado',
  templateUrl: './adicionar-titulocentroresultado.component.html',
  styleUrls: ['./adicionar-titulocentroresultado.component.css']
})
export class AdicionarTitulocentroresultadoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tituloCentro: TituloCentro;
  public tituloCentros = [];
  public tituloCentroResultadoForm: FormGroup;
  public tituloId = 0;

  public centroResultados: CentroResultado[];

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
    private listCentroResultado: ListaTitulocentroresultadoComponent,
    private tituloComponent: TituloComponent) {

    this.validationMessages = {
      centroResultadoId: {
        required: 'Centro Resultado requerido.'
      },
      percentual: {
        required: 'Percentual requerido.',
        min: 'Valor mínimo deve ser maior que 0',
        max: 'Valor máximo deve ser menor ou igual a 100'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tituloCentro = new TituloCentro();
    this.swal = new SweetAlertAdviceService();
    // this.tituloComponent.Titulo.tituloCentro = [];

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    this.tituloCentroResultadoForm = this.fb.group({
      centroResultadoId: ['', [Validators.required]],
      centroCustoId: 0,
      //codigo: '',
      //descricao: '',
      percentual: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.tituloService.obterTodosCentroResultado()
      .subscribe(centroResultados => {
        this.centroResultados = centroResultados
      },
      error => this.errors);

    //  this.tituloCentros = JSON.parse(localStorage.getItem("tituloCentroCusto"));
    //   if (this.tituloCentros == null) {
    //      this.tituloCentros = [];
    //    }

  }


  adicionarCentroResultado() {
    if (this.tituloComponent.Titulo.tituloCentro == undefined)
      this.tituloComponent.Titulo.tituloCentro = []

    if (this.tituloCentroResultadoForm.dirty && this.tituloCentroResultadoForm.valid) {
      let p = Object.assign({}, this.tituloCentro, this.tituloCentroResultadoForm.value);


      for (var i = 0; i < this.centroResultados.length; i++) {
        if (p.centroResultadoId == this.centroResultados[i].id) {
          p.centroResultado = this.centroResultados[i];

        }
      }

      p.centroCusto = null;

      let num = this.tituloComponent.Titulo.tituloCentro.length;

      p.id = num + 1;
      p.tituloId = this.tituloId;

      if (this.tituloId > 0) {
        this.tituloComponent.Titulo.tituloCentro.push(p);
        if (!this.tituloService.validarPercentual(this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroResultado != null))) {

          this.listCentroResultado.centroresultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
          for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
            if (p.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
              this.tituloComponent.Titulo.tituloCentro.splice(i, 1);
            }
          }
          this.listCentroResultado.atualizaStorage();
          this.close()

        } else {
          p.centroResultado = null;

          this.tituloService.AdicionarTituloCentro(p)
            .subscribe(
            result => {
              this.tituloComponent.Titulo.tituloCentro.push(p)

              this.listCentroResultado.atualizaStorage();

              this.tituloService.gerarApropriacaoCentroAngular(this.tituloComponent.titulo)
                .subscribe(
                result => {

                  for (var i = 0; i < this.tituloComponent.titulo.parcela.length; i++) {
                    this.tituloComponent.titulo.parcela[i].apropriacaoCentro = result;

                  }

                }
                )


              //this.listCentroResultado.atualizaStorage();
              this.listCentroResultado.centroResultadoGravado('Centro Resultado, Adicionado com Sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
        }
      } else {

        this.tituloComponent.Titulo.tituloCentro.push(p)

        if (!this.tituloService.validarPercentual(this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroResultado != null))) {

          this.listCentroResultado.centroresultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
          for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
            if (p.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
              this.tituloComponent.Titulo.tituloCentro.splice(i, 1);
            }
          }

          this.listCentroResultado.atualizaStorage();
          this.close()

        } else {
          this.listCentroResultado.atualizaStorage();
          this.listCentroResultado.centroResultadoGravado('Centro Resultado, Adicionado com Sucesso!');
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
      this.displayMessage = this.genericValidator.processMessages(this.tituloCentroResultadoForm);
    });

  }


}

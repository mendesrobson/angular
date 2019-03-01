import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { TituloCentro, CentroResultado } from '../models/titulo';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ListaTitulocentroresultadoComponent } from '../lista-titulocentroresultado/lista-titulocentroresultado.component';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-editar-titulocentroresultado',
  templateUrl: './editar-titulocentroresultado.component.html',
  styleUrls: ['./editar-titulocentroresultado.component.css']
})
export class EditarTitulocentroresultadoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
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
    private listaCentroResultado: ListaTitulocentroresultadoComponent,
    private tituloComponent: TituloComponent) {

    this.validationMessages = {
      centroResultadoId: {
        required: 'Centro Redultado requerido.'
      },
      percentual: {
        required: 'Percentual requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tituloCentro = new TituloCentro();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    this.tituloCentroResultadoForm = this.fb.group({
      tituloId: 0,
      centroResultadoId: [0, [Validators.required]],
      centroCustoId: 0,
      // codigo: '',
      // descricao: '',
      percentual: [0, [Validators.required]]
    });

    // this.tituloCentro = JSON.parse(localStorage.getItem("tituloCentroCustoEdit"));
    // if (this.tituloCentro == null) {
    //   this.tituloCentro = new TituloCentro;
    // }



    this.tituloService.obterTodosCentroResultado()
      .subscribe(centroResultados => {
        this.centroResultados = centroResultados
      },
      error => this.errors);

    this.preencherTituloCentroResultadoForm(this.tituloComponent.TituloCentro);

  }

  ngAfterViewInit(): void {
    // let controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Observable.merge(...controlBlurs).subscribe(value => {
    //   this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

    // });
  }

  editarCentroResultado() {
    if (this.tituloCentroResultadoForm.dirty && this.tituloCentroResultadoForm.valid) {
      let p = Object.assign({}, this.tituloCentro, this.tituloCentroResultadoForm.value);

      this.tituloComponent.dirty = true;

      for (var i = 0; i < this.centroResultados.length; i++) {
        if (p.centroResultadoId == this.centroResultados[i].id) {
          p.centroResultado = this.centroResultados[i];

        }
      }

      p.centroCusto = null;

      for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
        if (this.tituloComponent.TituloCentro.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
          this.tituloComponent.Titulo.tituloCentro[i] = p;
        }
      }

      if (!this.tituloService.validarPercentual(this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroResultado != null))) {

        this.listaCentroResultado.centroresultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
        for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
          if (p.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
            this.tituloComponent.Titulo.tituloCentro.splice(i, 1);
          }
        }

        this.listaCentroResultado.atualizaStorage();
        this.close()

      } else {

        if (this.tituloId > 0) {
          p.tituloId = this.tituloId;

          this.tituloService.AtualizarTituloCentro(p)
            .subscribe(
            result => {
              //  this.tituloComponent.Titulo.tituloCentro = this.tituloCentros;
              //  this.listaCentroResultado.atualizaStorage();
              this.tituloService.gerarApropriacaoCentroAngular(this.tituloComponent.titulo)
              .subscribe(
                result => {
    
                  for(var i=0; i < this.tituloComponent.titulo.parcela.length; i++) {
                    this.tituloComponent.titulo.parcela[i].apropriacaoCentro = result;
    
                  }
    
                }
              )                 
              this.listaCentroResultado.centroResultadoGravado('Centro Resultado, Atualizado com sucesso!');

              this.close();
            },
            error => {
              this.errors;
            });
        } else {

          this.listaCentroResultado.atualizaStorage();
          this.listaCentroResultado.centroResultadoGravado('Centro Resultado, Atualizado com sucesso!');
          this.close();

        }

      }

    }

  }

  preencherTituloCentroResultadoForm(tituloCentro: TituloCentro): void {
    this.tituloCentro = tituloCentro;
    this.tituloCentroResultadoForm.patchValue({
      tituloId: this.tituloCentro.id,
      centroResultadoId: this.tituloCentro.centroResultado.id,
      percentual: this.tituloCentro.percentual
    })

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

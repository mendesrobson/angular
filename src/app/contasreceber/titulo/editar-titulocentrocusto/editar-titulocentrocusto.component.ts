import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { TituloCentro, CentroCusto } from '../models/titulo';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ListaTitulocentrocustoComponent } from '../lista-titulocentrocusto/lista-titulocentrocusto.component';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-editar-titulocentrocusto',
  templateUrl: './editar-titulocentrocusto.component.html',
  styleUrls: ['./editar-titulocentrocusto.component.css']
})
export class EditarTitulocentrocustoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tituloCentro: TituloCentro;
  public tituloCentros = [];
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
    private tituloComponent: TituloComponent) {

    this.validationMessages = {
      centroCustoId: {
        required: 'Centro Custo requerido.'
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

    this.tituloCentroCustoForm = this.fb.group({
      tituloId: 0,
      centroCustoId: [0, [Validators.required]],
      // codigo: '',
      // descricao: '',
      percentual: [0, [Validators.required]]
    });

    // this.tituloCentro = JSON.parse(localStorage.getItem("tituloCentroCustoEdit"));
    // if (this.tituloCentro == null) {
    //   this.tituloCentro = new TituloCentro;
    // }



    this.tituloService.obterTodosCentroCusto()
      .subscribe(centroCustos => {
        this.centroCustos = centroCustos
      },
      error => this.errors);

    this.preencherTituloCentroCustoForm(this.tituloComponent.TituloCentro);

  }

  ngAfterViewInit(): void {
    // let controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Observable.merge(...controlBlurs).subscribe(value => {
    //   this.displayMessage = this.genericValidator.processMessages(this.tituloDescontoForm);

    // });
  }

  editarCentroCusto() {
    if (this.tituloCentroCustoForm.dirty && this.tituloCentroCustoForm.valid) {
      let p = Object.assign({}, this.tituloCentro, this.tituloCentroCustoForm.value);

      this.tituloComponent.dirty = true;
      
      for (var i = 0; i < this.centroCustos.length; i++) {
        if (p.centroCustoId == this.centroCustos[i].id) {
          p.centroCusto = this.centroCustos[i];

        }
      }

      p.centroResultado = null;

      for (var i = 0; i < this.tituloComponent.Titulo.tituloCentro.length; i++) {
        if (this.tituloComponent.TituloCentro.id == this.tituloComponent.Titulo.tituloCentro[i].id) {
          this.tituloComponent.Titulo.tituloCentro[i] = p;
        }
      }

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

        if (this.tituloId > 0) {

          p.tituloId = this.tituloId;

          this.tituloService.AtualizarTituloCentro(p)
            .subscribe(
            result => {
              //  this.tituloComponent.
              this.tituloService.gerarApropriacaoCentroAngular(this.tituloComponent.titulo)
              .subscribe(
                result => {
    
                  for(var i=0; i < this.tituloComponent.titulo.parcela.length; i++) {
                    this.tituloComponent.titulo.parcela[i].apropriacaoCentro = result;
    
                  }
    
                }
              )               
              this.listCentroCusto.centroCustoGravado('Centro Custo, Atualizado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
        } else {

          this.listCentroCusto.atualizaStorage();
          this.listCentroCusto.centroCustoGravado('Centro Custo, Atualizado com sucesso!');
          this.close();

        }
      }

    }

  }

  preencherTituloCentroCustoForm(tituloCentro: TituloCentro): void {
    this.tituloCentro = tituloCentro;
    this.tituloCentroCustoForm.patchValue({
      tituloId: this.tituloCentro.id,
      centroCustoId: this.tituloCentro.centroCusto.id,
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



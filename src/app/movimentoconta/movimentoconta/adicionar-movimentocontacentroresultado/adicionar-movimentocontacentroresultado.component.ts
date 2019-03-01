import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { MovimentoConta, MovimentoContaCentro, CentroResultado } from '../models/movimentoconta';
import { MovimentoContaService } from '../movimentoconta.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { ListaMovimentoContaCentroResultadoComponent } from '../lista-movimentocontacentroresultado/lista-movimentocontacentroresultado.component';
import { MovimentoContaComponent } from '../movimentoconta.component';


@Component({
  selector: 'app-adicionar-movimentocontacentroresultado',
  templateUrl: './adicionar-movimentocontacentroresultado.component.html',
  styleUrls: ['./adicionar-movimentocontacentroresultado.component.css']
})
export class AdicionarMovimentoContaCentroResultadoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public movimentoContaCentro: MovimentoContaCentro;
  public movimentoContaCentros = [];
  public listaMovimentoContaCentroResultado = [];
  public movimentoContaCentroResultadoForm: FormGroup;
  public movimentoContaId = 0;

  public centroResultados: CentroResultado[];

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];


  constructor(private movimentoContaService: MovimentoContaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private listCentroResultado: ListaMovimentoContaCentroResultadoComponent,
    private movimentoContaComponent: MovimentoContaComponent) {

    this.validationMessages = {
      centroResultadoId: {
        required: 'Centro Resultado requerido.'
      },
      percentual: {
        required: 'Percentual requerido.',
        min: 'Valor mínimo deve ser maior que 0',
        max: 'Valor máximo deve ser menor ou igual 100'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.movimentoContaCentro = new MovimentoContaCentro();
    this.swal = new SweetAlertAdviceService();


  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.movimentoContaId = 0
    else
      this.movimentoContaId = this.route.snapshot.params['id'];

    this.movimentoContaCentroResultadoForm = this.fb.group({
      centroResultadoId: ['', [Validators.required]],
      centroCustoId: 0,
      //codigo: '',
      //descricao: '',
      percentual: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.movimentoContaService.obterTodosCentroResultado()
      .subscribe(centroResultados => {
          this.centroResultados = centroResultados
        
        
      },
      error => this.errors);


    if (this.movimentoContaCentros == null) {
      this.movimentoContaCentros = [];
    }

  }


  adicionarCentroResultado() {
    console.log('valor');
    if (this.movimentoContaComponent.MovimentoConta.movimentoContaCentro == undefined)
      this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = []

    
    if (this.movimentoContaCentroResultadoForm.dirty && this.movimentoContaCentroResultadoForm.valid) {
      let p = Object.assign({}, this.movimentoContaCentro, this.movimentoContaCentroResultadoForm.getRawValue());


      for (var i = 0; i < this.centroResultados.length; i++) {
        if (p.centroResultadoId == this.centroResultados[i].id) {
          p.centroResultado = this.centroResultados[i];
        }
      }
      p.centroCusto = null;
      p.centroCustoId = null;


      let num = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length;

      p.id = num + 1;
      p.movimentoContaId = this.movimentoContaId;




      if (this.movimentoContaId > 0) {

        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.push(p);
        if (!this.movimentoContaService.validarPercentual(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null))) {

          this.listCentroResultado.centroResultadoErro('O Centro de Resultado não foi gravado! Os valores excedem 100%.');
          for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
            if (p.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
              this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
            }
          }
          this.listCentroResultado.atualizaStorage();
          this.close()

        } else {
          this.listCentroResultado.atualizaStorage();

          p.centroResultado = null;

          this.movimentoContaService.adicionarMovimentoContaCentro(p)
            .subscribe(
            result => {
                this.listCentroResultado.centroResultadoGravado('Centro Resultado, Adicionado com Sucesso!');
                this.close();

            },
            error => {
              this.errors;
            });
        }
      } else {

        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.push(p)
        if (!this.movimentoContaService.validarPercentual(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null))) {

          this.listCentroResultado.centroResultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
          for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
            if (p.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
              this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
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
      this.displayMessage = this.genericValidator.processMessages(this.movimentoContaCentroResultadoForm);
    });

  }
}







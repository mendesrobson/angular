import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { MovimentoConta, MovimentoContaCentro, CentroCusto } from '../models/movimentoconta';
import { MovimentoContaService } from '../movimentoconta.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { ListaMovimentoContaCentroCustoComponent } from '../lista-movimentocontacentrocusto/lista-movimentocontacentrocusto.component';
import { MovimentoContaComponent } from '../movimentoconta.component';


@Component({
  selector: 'app-adicionar-movimentocontacentrocusto',
  templateUrl: './adicionar-movimentocontacentrocusto.component.html',
  styleUrls: ['./adicionar-movimentocontacentrocusto.component.css']
})
export class AdicionarMovimentoContaCentroCustoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public movimentoContaCentro: MovimentoContaCentro;
  public movimentoContaCentros = [];
  public listaMovimentoContaCentroCusto = [];
  public movimentoContaCentroCustoForm: FormGroup;
  public movimentoContaId = 0;

  public centroCustos: CentroCusto[];

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
    private movimentoContaComponent: MovimentoContaComponent,
    private listCentroCusto: ListaMovimentoContaCentroCustoComponent) {

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
    this.movimentoContaCentro = new MovimentoContaCentro();
    this.swal = new SweetAlertAdviceService();


  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.movimentoContaId = 0
    else
      this.movimentoContaId = this.route.snapshot.params['id'];

    this.movimentoContaCentroCustoForm = this.fb.group({
      centroCustoId: ['', [Validators.required]],
      centroResultadoId: 0,
      //codigo: '',
      //descricao: '',
      percentual: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.movimentoContaService.obterTodosCentroCusto()
      .subscribe(centroCustos => {
        this.centroCustos = centroCustos
      },
      error => this.errors);

    //  this.tituloCentros = JSON.parse(localStorage.getItem("tituloCentroCusto"));
    if (this.movimentoContaCentros == null) {
      this.movimentoContaCentros = [];
    }

  }


  adicionarCentroCusto() {
    console.log('valor');
    if (this.movimentoContaComponent.MovimentoConta.movimentoContaCentro == undefined)
      this.movimentoContaComponent.MovimentoConta.movimentoContaCentro = []

    
    if (this.movimentoContaCentroCustoForm.dirty && this.movimentoContaCentroCustoForm.valid) {
      let p = Object.assign({}, this.movimentoContaCentro, this.movimentoContaCentroCustoForm.getRawValue());


      for (var i = 0; i < this.centroCustos.length; i++) {
        if (p.centroCustoId == this.centroCustos[i].id) {
          p.centroCusto = this.centroCustos[i];
        }
      }
      p.centroResultado = null;
      p.centroResultadoId = null;


      let num = this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length;

      p.id = num + 1;
      p.movimentoContaId = this.movimentoContaId;

      // this.listaTituloCentroCusto.push(p);



      if (this.movimentoContaId > 0) {

        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.push(p);
        if (!this.movimentoContaService.validarPercentual(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null))) {

          this.listCentroCusto.centroCustoErro('O Centro de Custo não foi gravado! Os valores excedem 100%.');
          for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
            if (p.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
              this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
            }
          }
          this.listCentroCusto.atualizaStorage();
          this.close()

        } else {
          this.listCentroCusto.atualizaStorage();

          p.centroCusto = null;

          this.movimentoContaService.adicionarMovimentoContaCentro(p)
            .subscribe(
            result => {
                this.listCentroCusto.centroCustoGravado('Centro Custo, Adicionado com Sucesso!');
                this.close();

            },
            error => {
              this.errors;
            });
        }
      } else {

        this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.push(p)
        if (!this.movimentoContaService.validarPercentual(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null))) {

          this.listCentroCusto.centroCustoErro('Centro de Custo não gravado, os valores excedem 100%');
          for (var i = 0; i < this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
            if (p.id == this.movimentoContaComponent.MovimentoConta.movimentoContaCentro[i].id) {
              this.movimentoContaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
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


      console.log(this.movimentoContaComponent.MovimentoConta.movimentoContaCentro)

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
      this.displayMessage = this.genericValidator.processMessages(this.movimentoContaCentroCustoForm);
    });

  }
}







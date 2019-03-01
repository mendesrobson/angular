import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ContrSindPatReceitaBruta } from '../models/contribuicaosindicalpatronal';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ContribuicaosindicalpatronalComponent } from './../contribuicaosindicalpatronal.component';
import { ListaContrsindpatreceitabrutaComponent } from './../lista-contrsindpatreceitabruta/lista-contrsindpatreceitabruta.component';


function valorRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
          return { 'valorRange': true };
      }
      return null;
  };
}


@Component({
  selector: 'app-adicionar-contrsindpatreceitabruta',
  templateUrl: './adicionar-contrsindpatreceitabruta.component.html',
  styleUrls: ['./adicionar-contrsindpatreceitabruta.component.css']
})



export class AdicionarContrsindpatreceitabrutaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public contrSindPatReceitaBruta: ContrSindPatReceitaBruta;
  public contrSindPatReceitaBrutas = [];
  public listacontrSindPatReceitaBrutas: ContrSindPatReceitaBruta[];
  public contrSindPatReceitaBrutaForm: FormGroup;
  public contribuicaoSindicalPatronalId: 0;


  constructor(private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute,
    private contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent,
    private listaContrSindPatReceitaBruta: ListaContrsindpatreceitabrutaComponent,
  ) {

    this.validationMessages = {
      receitaInicial: {
        required: 'O Valor da Receita Inicial é requerida.'
      },
      receitaFinal: {
        required: 'O Valor da Receita Final é requerida.'
      },
      percentual: {
        required: 'O Percentual é requerido.',
        max: 'O Percentual deve ser no máximo 100%.'
      },
      valor: {
        required: 'O Valor é requerido.'
      },
      ano: {
        required: 'O Ano é requerido.'
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contrSindPatReceitaBruta = new ContrSindPatReceitaBruta();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
  
    if (this.route.snapshot.params['id'] === undefined) {
      this.contribuicaoSindicalPatronalId = 0;
    } else {
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }

    let receitaInicial = new FormControl(0, [Validators.required]);
    let receitaFinal = new FormControl(0, [Validators.required]);
 

    this.contrSindPatReceitaBrutaForm = this.fb.group({
      receitaInicial: [0, [Validators.required]],
      receitaFinal: [0, [Validators.required]],
      percentual: ['', [Validators.required, Validators.max(100)]],
      valor: ['', [Validators.required]],
      ano: ['', [Validators.required]]
    });

    this.contribuicaoSindicalPatronalService.obterTodosContribuicaoSindicalPatronalReceitaBruta().subscribe(
      resultado => {
        this.listacontrSindPatReceitaBrutas = resultado;
      });
  }


  adicionarContrSindPatReceitaBruta() {

    if (this.contrSindPatReceitaBrutaForm.dirty && this.contrSindPatReceitaBrutaForm.valid) {
      const p = Object.assign({}, this.contrSindPatReceitaBruta, this.contrSindPatReceitaBrutaForm.getRawValue());

      this.contribuicaosindicalpatronalComponent.dirty = true;

      if (this.contribuicaoSindicalPatronalId > 0) {
        p.contribuicaoSindicalPatronalId = this.contribuicaoSindicalPatronalId;
        p.id = 0;
        p.contrSindPatReceitaBruta = null;
        this.contribuicaoSindicalPatronalService.adicionarContrSindPatReceitaBruta(p)
          .subscribe(
            result => {
              if (result) {

                if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta == null) {
                  this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta = new Array();
                }

                this.contribuicaoSindicalPatronalService.obterTodosContrSindPatReceitaBrutaPorContribuicaoSindicalPatronalId(this.contribuicaoSindicalPatronalId.toString())
                  .subscribe(contrSindPatReceitaBruta => {
                    this.contrSindPatReceitaBrutas = contrSindPatReceitaBruta

                    this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta = this.contrSindPatReceitaBrutas;

                  });

                this.swal.showSwalSuccess('Receita Bruta, Adicionado com Sucesso!');
                this.close();

              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            error => {
              this.errors;
            });
      } else {
        p.id = 0;
        if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.length > 0) {
          p.id = this.contribuicaosindicalpatronalComponent.ContribuicaoSindicalPatronal.contrSindPatReceitaBruta.length + 1;
        }
        for (let i = 0; this.listacontrSindPatReceitaBrutas.length > i; i++) {
          if (p.contribuicaoSindicalPatronalId === this.listacontrSindPatReceitaBrutas[i].id) {
            p.contrSindPatNumeroAluno = this.listacontrSindPatReceitaBrutas[i];
          }
        }
        if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta == null) {
          this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta = new Array();
        }
        this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.push(p);

        this.close();
      }
    }
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.contrSindPatReceitaBrutaForm);
    });
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }




}

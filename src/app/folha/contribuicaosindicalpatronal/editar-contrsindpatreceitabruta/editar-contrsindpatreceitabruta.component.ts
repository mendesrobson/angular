import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContrSindPatReceitaBruta } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { ListaContrsindpatreceitabrutaComponent } from './../lista-contrsindpatreceitabruta/lista-contrsindpatreceitabruta.component';

@Component({
  selector: 'app-editar-contrsindpatreceitabruta',
  templateUrl: './editar-contrsindpatreceitabruta.component.html',
  styleUrls: ['./editar-contrsindpatreceitabruta.component.css']
})
export class EditarContrsindpatreceitabrutaComponent implements OnInit {
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
  public contrSindPatReceitaBrutaForm: FormGroup;
  public contribuicaoSindicalPatronalId = 0;


  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private contribuicaoSindicalPatronalComponent: ContribuicaosindicalpatronalComponent,
    private listContrSindPatReceitaBrutaComponent : ListaContrsindpatreceitabrutaComponent
  ) {
    this.validationMessages = {
      receitaInicial: {
        required: 'O Receita Incial é requerida.',
      },
      receitaFinal: {
        required: 'O Receita Final é requerida.',
      },
      percentual: {
        required: 'O Percentual é requerido..',
        minlength: 'O Percentual precisa ter no mínimo 2 caracteres',
        maxlength: 'O Percentual precisa ter no máximo 18 caracteres'
      },
       valor: {
        required: 'O Valor é requerido..',
        minlength: 'O Valor precisa ter no mínimo 2 caracteres',
        maxlength: 'O Valor precisa ter no máximo 18 caracteres'
      },
      ano: {
        required: 'O Ano é requerido..'
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
    this.contrSindPatReceitaBrutaForm = this.fb.group({
      id : 0,
      receitaInicial: ['', [Validators.required, Validators.minLength(2),  Validators.maxLength(18)]],
      receitaFinal: ['', [Validators.required,  Validators.minLength(2),  Validators.maxLength(18)]],
      percentual: ['', [Validators.required, Validators.minLength(2),  Validators.maxLength(18)]],
      valor: ['', [Validators.required,  Validators.minLength(2),  Validators.maxLength(18)]],
      ano : ['', [Validators.required, Validators.maxLength(4)]],
      excluido: 'N'
     });

console.log(this.contribuicaoSindicalPatronalComponent.contrSindPatReceitaBruta);
    this.preencherContrSindPatReceitaBruta(this.contribuicaoSindicalPatronalComponent.contrSindPatReceitaBruta);
    }

  preencherContrSindPatReceitaBruta(receitaBruta: ContrSindPatReceitaBruta) {
    this.contrSindPatReceitaBrutaForm.patchValue({
      id: receitaBruta.id,
      receitaInicial: receitaBruta.receitaInicial,
      receitaFinal: receitaBruta.receitaFinal,
      percentual: receitaBruta.percentual,
      valor: receitaBruta.valor,
      ano: receitaBruta.ano
    });
  }

  editarContrSindPatReceitaBruta() {
    this.contrSindPatReceitaBrutas = this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta;
    if (this.contrSindPatReceitaBrutaForm.dirty && this.contrSindPatReceitaBrutaForm.valid) {
      const p = Object.assign({}, this.contrSindPatReceitaBruta, this.contrSindPatReceitaBrutaForm.getRawValue());

      this.contribuicaoSindicalPatronalComponent.dirty = true;

      if (this.contribuicaoSindicalPatronalId > 0) {
        p.contribuicaoSindicalPatronalId = this.contribuicaoSindicalPatronalId;

        this.contribuicaoSindicalPatronalService.atualizarContrSindPatReceitaBruta(p)
          .subscribe(
            result => {
              if (result) {
                for (let i = 0; this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.length > i; i++) {
                    if (p.id === this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta[i].id) {
                      this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta[i] = p;
                     }
                }
                this.swal.showSwalSuccess('Receita Bruta, Editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            error => {
              this.errors;
            });

      } else {

        this.contrSindPatReceitaBruta = p;

        for (let i = 0; this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta.length > i; i++) {
          if (this.contrSindPatReceitaBruta.id === this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta[i].id) {
            this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatReceitaBruta[i] = this.contrSindPatReceitaBruta;
          }
        }
        this.close();
      }
    }
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

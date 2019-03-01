import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ContrSindPatCapitalSocial } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-editar-contrsindpatcapitalsocial',
  templateUrl: './editar-contrsindpatcapitalsocial.component.html',
  styleUrls: ['./editar-contrsindpatcapitalsocial.component.css']
})
export class EditarContrsindpatcapitalsocialComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public minDate: Date;
  refazerFiltro: boolean;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public errors: any[] = [];
  public datePipe: DatePipe;

  public contrSindPatCapitalSocial: ContrSindPatCapitalSocial;
  public contrSindPatCapitalSocialArray = [];
  public contrSindPatCapitalSocialForm: FormGroup;
  public contribuicaoSindicalPatronalId = 0;

  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contribuicaoSindicalPatronalComponent: ContribuicaosindicalpatronalComponent,
    private _utilService: UtilService) { 

      this.validationMessages = {
        ano: {
          required: 'Ano requerido.',
        },
        capitalInicial: {
          required: 'Capital Inicial requerido!'
        },
        capitalFinal: {
          required: 'Capital Final requerido!'
        },
        percentual: {
          required: 'Percentual requerido!',
          max: 'Percentual máximo é de 100%'
        },
        valor:{
          required: 'Valor a adicionar requerido!'
        },
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.contrSindPatCapitalSocial = new ContrSindPatCapitalSocial();
      this.swal = new SweetAlertAdviceService();
      this.datePipe = new DatePipe("en-US");

    }

    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
      Observable.merge(...controlBlurs).subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(this.contrSindPatCapitalSocialForm);
      });
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.contribuicaoSindicalPatronalId = 0;
    } else {
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }
    this.contrSindPatCapitalSocialForm = this.fb.group({
      id: 0,
      ano: ['', [Validators.required]],
      capitalInicial: ['', [Validators.required]],
      capitalFinal: ['', [Validators.required]],
      percentual: ['', [Validators.required, Validators.max(100)]],
      valor: ['', [Validators.required, Validators.maxLength(18)]],
      excluido: 'N'
    });

    this.preenchercontrSindPatCapitalSocial(this.contribuicaoSindicalPatronalComponent.contrSindPatCapitalSocial);
  }

  preenchercontrSindPatCapitalSocial(contrSindPatCapitalSocial: ContrSindPatCapitalSocial){

    this.contrSindPatCapitalSocialForm.patchValue({
      id: contrSindPatCapitalSocial.id,
      ano: contrSindPatCapitalSocial.ano + '/10/10',
      capitalInicial: contrSindPatCapitalSocial.capitalInicial,
      capitalFinal: contrSindPatCapitalSocial.capitalFinal,
      percentual: contrSindPatCapitalSocial.percentual,
      valor: contrSindPatCapitalSocial.valor,
      excluido: contrSindPatCapitalSocial.excluido
    });
  }

  editarContrSindPatCapitalSocial() {
    this.contrSindPatCapitalSocialArray = this.contribuicaoSindicalPatronalComponent.ContribuicaoSindicalPatronal.contrSindPatCapitalSocial;
    if (this.contrSindPatCapitalSocialForm.dirty && this.contrSindPatCapitalSocialForm.valid) {
      let p = Object.assign({}, this.contrSindPatCapitalSocial, this.contrSindPatCapitalSocialForm.getRawValue());
      
      this.contribuicaoSindicalPatronalComponent.dirty = true;

      // p.capitalInicial = this.datePipe.transform(new Date(p.capitalInicial).toDateString(), 'dd/MM/yyyy');
      // p.capitalFinal = this.datePipe.transform(new Date(p.capitalFinal).toDateString(), 'dd/MM/yyyy');
      p.ano = this.datePipe.transform(p.ano, 'yyyy');

      if (this.contribuicaoSindicalPatronalId > 0) {
        console.log(p);
        p.contribuicaoSindicalPatronalId = this.contribuicaoSindicalPatronalId;

        this.contribuicaoSindicalPatronalService.atualizarContrSindPatCapitalSocial(p)
          .subscribe(
            result => {
              if (result) {
                for (let i = 0; this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.length > i; i++) {
                    if (p.id === this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial[i].id) {
                      this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial[i] = p;
                     }
                }
                this.swal.showSwalSuccess('Capital Social editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            () => {
              this.errors;
            });

      } else {

        this.contrSindPatCapitalSocial = p;

        for (let i = 0; this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.length > i; i++) {
          if (this.contrSindPatCapitalSocial.id === this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial[i].id) {
            this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial[i] = this.contrSindPatCapitalSocial;
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

  definirValor(event) {
    this.minDate = event.value;
  }

}

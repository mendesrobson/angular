import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChildren } from '@angular/core';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { FormGroup, FormBuilder, Validators, FormControlName, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ListaContrsindpatcapitalsocialComponent } from '../lista-contrsindpatcapitalsocial/lista-contrsindpatcapitalsocial.component';
import { ContrSindPatCapitalSocial, ContribuicaoSindicalPatronal } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { DatePipe } from '../../../../../node_modules/@angular/common';

@Component({
  selector: 'app-adicionar-contrsindpatcapitalsocial',
  templateUrl: './adicionar-contrsindpatcapitalsocial.component.html',
  styleUrls: ['./adicionar-contrsindpatcapitalsocial.component.css']
})
export class AdicionarContrsindpatcapitalsocialComponent implements OnInit {
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
  min = new Date().getFullYear();
  
  

  public contrSindPatCapitalSocial: ContrSindPatCapitalSocial;
  public contrSindPatCapitalSocials = [];
  public contrSindPatCapitalSocialForm: FormGroup;
  public contribuicaoSindicalPatronalId = 0;

  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute, 
    private contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent,
    private listContrsindpatcapitalsocial: ListaContrsindpatcapitalsocialComponent) { 

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

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.contribuicaoSindicalPatronalId = 0;
    } else {
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }
    this.contrSindPatCapitalSocialForm = this.fb.group({
      id: 0,
      guid: 1,
      ano: ['', [Validators.required]],
      capitalInicial: ['', [Validators.required]],
      capitalFinal: ['', [Validators.required]],
      percentual: ['', [Validators.required, Validators.max(100)]],
      valor: ['', [Validators.required, Validators.maxLength(18)]],
      excluido: 'N'
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.contrSindPatCapitalSocialForm);
    });
  }

  adicionarContrSindPatCapitalSocial() {
    
    if (this.contrSindPatCapitalSocialForm.dirty && this.contrSindPatCapitalSocialForm.valid) {
      
      const p = Object.assign({}, this.contrSindPatCapitalSocial, this.contrSindPatCapitalSocialForm.getRawValue());
      
      //p.capitalInicial = this.datePipe.transform(new Date(p.capitalInicial).toDateString(), 'dd/MM/yyyy');
      //p.capitalFinal = this.datePipe.transform(new Date(p.capitalFinal).toDateString(), 'dd/MM/yyyy');
      p.ano = this.datePipe.transform(p.ano, 'yyyy');

      this.contribuicaosindicalpatronalComponent.dirty = true;

      if (this.contribuicaoSindicalPatronalId > 0) {

        p.contribuicaoSindicalPatronalId = this.contribuicaoSindicalPatronalId;
        p.id = 0;

        this.contribuicaoSindicalPatronalService.adicionarContrSindPatCapitalSocial(p)
          .subscribe(
            result => {
              if (result) {
                
                if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial == null) {
                  this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial =  new Array();
                }

                this.contribuicaoSindicalPatronalService.obterTodosContrSindPatCapitalSocialPorContribuicaoSindicalPatronalId(this.contribuicaoSindicalPatronalId.toString())
                .subscribe(contrSindPatCapitalSocials =>{ this.contrSindPatCapitalSocials = contrSindPatCapitalSocials

                  this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial = this.contrSindPatCapitalSocials;
                });

                this.swal.showSwalSuccess('Capital Social adicionado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            () => {              
              this.errors;
            });
      } else {
        p.id = 0;
        if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.length > 0) {
          p.id = this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.length + 1;
        }
        
        if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial == null) {
          this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial =  new Array();
        }

        this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatCapitalSocial.push(p);
        this.listContrsindpatcapitalsocial.ContrSindPatCapitalSocialGravado('Capital Social adicionado com sucesso!');
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

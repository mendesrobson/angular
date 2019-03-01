import { Component, OnInit, ViewChildren, ElementRef, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { DiretoriaSindical, Cargo } from '../models/sindicato';
import { Observable } from '../../../../../node_modules/rxjs';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { SindicatoService } from '../sindicato.service';
import { SindicatoComponent } from '../sindicato.component';
import { ListaDiretoriasindicalComponent } from './../lista-diretoriasindical/lista-diretoriasindical.component';
import { DateUtils } from '../../../utils/date.utils';
import { SindicatoCargo } from './../models/sindicato';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-adicionar-diretoriasindical',
  templateUrl: './adicionar-diretoriasindical.component.html',
  styleUrls: ['./adicionar-diretoriasindical.component.css']
})
export class AdicionarDiretoriasindicalComponent implements OnInit, AfterViewInit {
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

 // public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public diretoriaSindical: DiretoriaSindical;
  public diretoriaSindicatoArray = [];
  public diretoriaSindicalForm: FormGroup;
  public sindicatoId = 0;
  public cargos: Cargo[];
  public sindicatoCargo: SindicatoCargo[];
  telMask = this._maskService.Telefone();
  celMask = this._maskService.Celular();

  constructor(
    private _maskService: MaskService,private utilService: UtilService,
    private sindicatoService: SindicatoService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private sindicatoComponent: SindicatoComponent,
    private listaDiretoriaSindical: ListaDiretoriasindicalComponent) {

    this.validationMessages = {
      cargoId: {
        required: 'Cargo Requerido!'
      },
      nome: {
        required: 'Nome Requerido!'
      },
      codigo: {
        required: 'Codigo Requerido!'
      },
      mandatoInicio: {
        required: 'Mandato Inicio Requerido!'
      },
      mandatoFim: {
        required: 'Mandato Fim Requerido!'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.diretoriaSindical = new DiretoriaSindical();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.sindicatoId = 0;
    } else {
      this.sindicatoId = this.route.snapshot.params['id'];
    }

    this.diretoriaSindicalForm = this.fb.group({
      id: 0,
      cargoId: ['', [Validators.required]],
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      sigla: [''],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      telefone: [''],
      celular: [''],
      email: [''],
      mandatoInicio: '',
      mandatoFim: '',
      excluido: 'N'
    });

    this.cargos = new Array();
    let temp = 0;
    this.sindicatoService.obterTodosSindicatoCargos()
      .subscribe(sindicatoCargo => {
        this.sindicatoService.obterTodosCargo().subscribe(
          cargo => {
            for (var f = 0; cargo.length > f; f++) {
              for (var i = 0; sindicatoCargo.length > i; i++) {
                if (sindicatoCargo[i].cargoId == cargo[f].id) {
                  if(temp != cargo[f].id){
                    temp = cargo[f].id;
                    this.cargos.push(cargo[f]);
                  }
                }
              }
            }
          });
      });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.diretoriaSindicalForm);
    });
  }

  adicionarDiretoriaSindical() {

    if (this.diretoriaSindicalForm.dirty && this.diretoriaSindicalForm.valid) {

      const p = Object.assign({}, this.diretoriaSindical, this.diretoriaSindicalForm.getRawValue());

      // p.mandatoInicio = DateUtils.getMyDatePickerDate(p.mandatoInicio);
      // p.mandatoFim = DateUtils.getMyDatePickerDate(p.mandatoFim);

      this.sindicatoComponent.dirty = true;

      if (this.sindicatoId > 0) {
        p.sindicatoId = this.sindicatoId;
        p.id = 0;
        p.sindicato = null;
        this.sindicatoService.adicionarDiretoriaSindical(p)
          .subscribe(
            result => {
              if (result) {

                if (this.sindicatoComponent.sindicato.diretoriaSindical == null) {
                  this.sindicatoComponent.sindicato.diretoriaSindical = new Array();
                }

                this.sindicatoService.obterTodosDiretoriaSindicalPorSindicatoId(this.sindicatoId.toString())
                  .subscribe(result => {
                    this.diretoriaSindicatoArray = result;
                    if (this.diretoriaSindicatoArray != null) {

                      for (let i = 0; i < this.diretoriaSindicatoArray.length; i++) {

                        for (let y = 0; y < this.cargos.length; y++) {

                          if (this.diretoriaSindicatoArray[i].cargoId == this.cargos[y].id) {

                            this.diretoriaSindicatoArray[i].cargo = this.cargos[y];

                          }

                        }

                      }

                    }

                    this.sindicatoComponent.sindicato.diretoriaSindical = this.diretoriaSindicatoArray;
                  });

                this.swal.showSwalSuccess('Diretoria Sindical, adicionado com Sucesso!');
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
        if (this.sindicatoComponent.Sindicato.diretoriaSindical.length > 0) {
          p.id = this.sindicatoComponent.Sindicato.diretoriaSindical.length + 1;
        }
        for (let i = 0; this.cargos.length > i; i++) {
          if (p.cargoId == this.cargos[i].id) {
            p.cargo = this.cargos[i];
          }
        }
        if (this.sindicatoComponent.Sindicato.diretoriaSindical == null) {
          this.sindicatoComponent.Sindicato.diretoriaSindical = new Array();
        }
        this.sindicatoComponent.Sindicato.diretoriaSindical.push(p);
        this.listaDiretoriaSindical.diretoriaSindicalGravado('Diretoria Sindical, adicionado com sucesso!');
        this.close();
      }
    }
  }

  validarEmail(email) {
    const emailValido = email.diretoriaSindicalForm.controls.email.value.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    if (emailValido === null ) {
      this.swal.showSwalError('E-mail Inválido!!', function (isConfirmed) {
        if (isConfirmed) {
          email.diretoriaSindicalForm.controls.email.reset();
        }
      });
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

import { Component, OnInit, ViewChildren, ElementRef, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { DiretoriaSindical, Cargo } from '../models/sindicato';
import { SindicatoService } from '../sindicato.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { SindicatoComponent } from './../sindicato.component';
import { ListaDiretoriasindicalComponent } from './../lista-diretoriasindical/lista-diretoriasindical.component';
import { Observable } from '../../../../../node_modules/rxjs';
import { DateUtils } from '../../../utils/date.utils';
import { UtilService } from '../../../services/util.service';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-editar-diretoriasindical',
  templateUrl: './editar-diretoriasindical.component.html',
  styleUrls: ['./editar-diretoriasindical.component.css']
})
export class EditarDiretoriasindicalComponent implements OnInit, AfterViewInit {
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
  public cargos: Cargo[];

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public diretoriaSindical: DiretoriaSindical;
  public diretoriaSindicalArray = [];
  public diretoriaSindicalForm: FormGroup;
  public sindicatoId = 0;
  telMask = this._maskService.Telefone();
  celMask = this._maskService.Celular();

  constructor(
    private _maskService: MaskService,
    private sindicatoService: SindicatoService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private utilService: UtilService,
    private sindicatoComponent: SindicatoComponent,
    private listaDiretoriasindicalComponent: ListaDiretoriasindicalComponent
  ) {
    this.validationMessages = {
      codigo: { required: 'Código De requerido.' },
      nome: { required: 'Nome Ate requerido.' },
      mandatoInicio: { required: 'Mandato Inicio requerido.' },
      mandatoFim: { required: 'Mandato Fim requerido.' }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.diretoriaSindical = new DiretoriaSindical();
    this.swal = new SweetAlertAdviceService();

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.diretoriaSindicalForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.diretoriaSindicalForm);
    });
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined)
      this.sindicatoId = 0;
    else
      this.sindicatoId = this.route.snapshot.params['id'];

    this.diretoriaSindicalForm = this.fb.group({
      id: 0,
      cargoId: ['', [Validators.required]],
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      sigla: [''],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      telefone: [''],
      celular: [''],
      email: [''],
      mandatoInicio: ['', [Validators.required]],
      mandatoFim: ['', [Validators.required]],
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
                  if (temp != cargo[f].id) {
                    temp = cargo[f].id;
                    this.cargos.push(cargo[f]);
                  }
                }
              }
            }
          });
      });

    this.preencherDiretoriaSindical(this.sindicatoComponent.DiretoriaSindical);
  }

  preencherDiretoriaSindical(diretoriaSindical: DiretoriaSindical) {

    this.diretoriaSindicalForm.patchValue({
      id: diretoriaSindical.id,
      codigo: diretoriaSindical.codigo,
      cargoId: diretoriaSindical.cargoId,
      cargo: diretoriaSindical.cargo.descricao,
      sigla: diretoriaSindical.sigla,
      nome: diretoriaSindical.nome,
      telefone: diretoriaSindical.telefone,
      celular: diretoriaSindical.celular,
      email: diretoriaSindical.email,
      // mandatoInicio: this.utilService.ToDate(diretoriaSindical.mandatoInicio),
      // mandatoFim: this.utilService.ToDate(diretoriaSindical.mandatoFim),
      mandatoInicio: diretoriaSindical.mandatoInicio,
      mandatoFim: diretoriaSindical.mandatoFim,
      excluido: diretoriaSindical.excluido
    });

  }

  editarDiretoriaSindical() {
    this.diretoriaSindicalArray = this.sindicatoComponent.sindicato.diretoriaSindical;
    if (this.diretoriaSindicalForm.dirty && this.diretoriaSindicalForm.valid) {
      let p = Object.assign({}, this.diretoriaSindical, this.diretoriaSindicalForm.getRawValue());

      this.sindicatoComponent.dirty = true;

      if (this.sindicatoId > 0) {
        p.sindicatoId = this.sindicatoId;

        this.sindicatoService.atualizarDiretoriaSindical(p)
          .subscribe(
            result => {
              if (result) {
                for (let i = 0; this.sindicatoComponent.sindicato.diretoriaSindical.length > i; i++) {
                  if (p.id === this.sindicatoComponent.sindicato.diretoriaSindical[i].id) {
                    this.sindicatoComponent.sindicato.diretoriaSindical[i] = p;
                  }

                  for (let y = 0; y < this.cargos.length; y++) {
                    if (this.sindicatoComponent.sindicato.diretoriaSindical[i].cargoId == this.cargos[y].id) {
                      this.sindicatoComponent.sindicato.diretoriaSindical[i].cargo = this.cargos[y];
                    }
                  }

                }

                this.swal.showSwalSuccess('Diretoria Sindical, Editado com Sucesso!');

              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            (erro) => {
              this.errors = erro;
            });

        this.close();

      } else {

        this.diretoriaSindical = p;

        for (let i = 0; this.sindicatoComponent.sindicato.diretoriaSindical.length > i; i++) {
          if (this.diretoriaSindical.id === this.sindicatoComponent.sindicato.diretoriaSindical[i].id) {
            this.sindicatoComponent.sindicato.diretoriaSindical[i] = this.diretoriaSindical;
          }
          for (let f = 0; this.cargos.length > f; f++) {
            if (this.sindicatoComponent.sindicato.diretoriaSindical[i].cargoId == this.cargos[f].id) {
              this.sindicatoComponent.sindicato.diretoriaSindical[i].cargo = this.cargos[f];
            }
          }
        }
        this.close();
      }
    }
  }

  cancelar() {
    this.close();
  }

  validarEmail(email) {
    const emailValido = email.pessoaContatoForm.controls.descricao.value.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    if (emailValido === null) {
      this.swal.showSwalError('E-mail Inválido!!', function (isConfirmed) {
        if (isConfirmed) {
          email.pessoaContatoForm.controls.descricao.reset();
        }
      });
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
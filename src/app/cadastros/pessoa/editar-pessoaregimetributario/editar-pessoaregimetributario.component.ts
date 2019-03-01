import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { PessoaService } from '../pessoa.service';
import { PessoaComponent } from '../pessoa.component';
import { ListaPessoaregimetributarioComponent } from '../lista-pessoaregimetributario/lista-pessoaregimetributario.component';
import { PessoaRegimeTributario, RegimeTributario } from '../models/pessoa';

@Component({
  selector: 'app-editar-pessoaregimetributario',
  templateUrl: './editar-pessoaregimetributario.component.html',
  styleUrls: ['./editar-pessoaregimetributario.component.css']
})
export class EditarPessoaregimetributarioComponent implements OnInit, AfterViewInit {
  [x: string]: any;
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

  public pessoaRegimeTributario: PessoaRegimeTributario;
  public pessoaRegimeTributarios = [];
  public pessoaRegimeTributarioForm: FormGroup;
  public pessoaId = 0;

  public regimeTributarios: RegimeTributario[];

  constructor(private pessoaService: PessoaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private pessoaComponent: PessoaComponent,
    private listPessoaRegimeTributario: ListaPessoaregimetributarioComponent) {

    this.validationMessages = {
      dataInicio: {
        required: 'Data Inicial requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.pessoaRegimeTributario = new PessoaRegimeTributario();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.pessoaRegimeTributarioForm = this.fb.group({
      id: 0,
      regimeTributarioId: '',
      motivo: '',
      dataInicio: '',
      dataFim: ''
    });

    this.pessoaService.obterTodosRegimeTributario()
      .subscribe(regimeTributarios => {
        this.regimeTributarios = regimeTributarios
      },
      error => this.errors);

    this.preencherRegimeTributarioForm(this.pessoaComponent.PessoaRegimeTributario);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.pessoaRegimeTributarioForm);
    });
  }

  preencherRegimeTributarioForm(pessoaRegimeTributario: PessoaRegimeTributario): void {

    this.pessoaRegimeTributario = pessoaRegimeTributario;

    let dataFim = '';
    if (this.pessoaRegimeTributario.dataFim == null || this.pessoaRegimeTributario.dataFim == '') {
      dataFim = '';
    } else {
      dataFim = this.utilService.ToDate(this.pessoaRegimeTributario.dataFim);
    }

    let dataInicio = '';
    if (this.pessoaRegimeTributario.dataInicio == null || this.pessoaRegimeTributario.dataInicio == '') {
      dataInicio = '';
    } else {
      dataInicio = this.utilService.ToDate(this.pessoaRegimeTributario.dataInicio);
    }

    this.pessoaRegimeTributarioForm.patchValue({
      id: this.pessoaRegimeTributario.id,
      regimeTributarioId: this.pessoaRegimeTributario.regimeTributarioId,
      motivo: this.pessoaRegimeTributario.motivo,
      dataInicio: dataInicio,
      dataFim: dataFim
    })

  }

  editarPessoaRegimeTributario() {

    if (this.pessoaRegimeTributarioForm.dirty && this.pessoaRegimeTributarioForm.valid) {
      let p = Object.assign({}, this.pessoaRegimeTributario, this.pessoaRegimeTributarioForm.getRawValue());

      this.pessoaComponent.dirty = true;
      
      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;

        for (let i = 0; this.regimeTributarios.length > i; i++) {
          if (p.regimeTributarioId == this.regimeTributarios[i].id) {
            p.regimeTributario = this.regimeTributarios[i];
          }
        }

        this.pessoaService.AtualizarPessoaRegimeTributario(p)
          .subscribe(
          result => {

            for (let i = 0; this.regimeTributarios.length > i; i++) {
              if (result.regimeTributarioId == this.regimeTributarios[i].id) {
                result.regimeTributario = this.regimeTributarios[i];
              }
            }

            for (let i = 0; this.pessoaComponent.Pessoa.pessoaRegimeTributario.length > i; i++) {
              if (result.id == this.pessoaComponent.Pessoa.pessoaRegimeTributario[i].id) {
                this.pessoaComponent.Pessoa.pessoaRegimeTributario[i] = result;
              }
            }

            this.listPessoaRegimeTributario.pessoaRegimeTributarioGravado('Regime Tributário editado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {

        this.pessoaRegimeTributario = p;

        for (let i = 0; this.regimeTributarios.length > i; i++) {
          if (this.pessoaRegimeTributario.regimeTributarioId == this.regimeTributarios[i].id) {
            this.pessoaRegimeTributario.regimeTributario = this.regimeTributarios[i];
          }
        }

        for (let i = 0; this.pessoaComponent.Pessoa.pessoaRegimeTributario.length > i; i++) {
          if (this.pessoaRegimeTributario.id == this.pessoaComponent.Pessoa.pessoaRegimeTributario[i].id) {
            this.pessoaComponent.Pessoa.pessoaRegimeTributario[i] = this.pessoaRegimeTributario;
          }
        }

        this.listPessoaRegimeTributario.pessoaRegimeTributarioGravado('Regime Tributário editado com sucesso!');
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

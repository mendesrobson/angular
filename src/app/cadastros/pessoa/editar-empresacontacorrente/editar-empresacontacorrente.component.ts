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
import { ListaEmpresacontacorrenteComponent } from '../lista-empresacontacorrente/lista-empresacontacorrente.component';
import { EmpresaContaCorrente, IContaCorrente } from '../models/pessoa';

@Component({
  selector: 'app-editar-empresacontacorrente',
  templateUrl: './editar-empresacontacorrente.component.html',
  styleUrls: ['./editar-empresacontacorrente.component.css']
})
export class EditarEmpresacontacorrenteComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  telMask = this._maskService.Telefone();
  celMask = this._maskService.Celular();
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public empresaContaCorrente: EmpresaContaCorrente;
  public empresaContaCorrentes = [];
  public empresaContaCorrenteForm: FormGroup;
  public pessoaId = 0;

  public iContaCorrentes: IContaCorrente[];

  constructor(
    private pessoaService: PessoaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent,
    private listEmpresaContaCorrente: ListaEmpresacontacorrenteComponent) {

    this.validationMessages = {
      contaCorrenteId: {
        required: 'Conta requerido.'
      },
      descricao: {
        required: 'Descrição requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empresaContaCorrente = new EmpresaContaCorrente();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.empresaContaCorrenteForm = this.fb.group({
      pessoaId: [],
      contaCorrenteId: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      contaPrincipal: 'N'
    });

    this.pessoaService.obterTodosContaCorrente()
      .subscribe(contaCorrentes => {
        this.iContaCorrentes = contaCorrentes
      },
        error => this.errors);

    this.preencherContaCorrenteForm(this.pessoaComponent.EmpresaContaCorrente);
  }

  preencherContaCorrenteForm(empresaContaCorrente: EmpresaContaCorrente): void {

    this.empresaContaCorrente = empresaContaCorrente;

    this.empresaContaCorrenteForm.patchValue({
      id: this.empresaContaCorrente.id,
      pessoaId: this.empresaContaCorrente.pessoaId,
      contaCorrenteId: this.empresaContaCorrente.contaCorrenteId,
      descricao: this.empresaContaCorrente.descricao,
      contaPrincipal: this.empresaContaCorrente.contaPrincipal
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.empresaContaCorrenteForm);
    });
  }

  editarEmpresaContaCorrente() {
    
    this.empresaContaCorrentes = this.pessoaComponent.Pessoa.empresaContaCorrente;

    if (this.empresaContaCorrenteForm.dirty && this.empresaContaCorrenteForm.valid) {

      let p = Object.assign({}, this.empresaContaCorrente, this.empresaContaCorrenteForm.getRawValue());

      this.pessoaComponent.dirty = true;
      
      if (p.contaPrincipal == "S") {  

        for (var i = 0; i < this.empresaContaCorrentes.length; i++) { 

          if (this.empresaContaCorrentes[i].contaPrincipal == "S") {

            this.empresaContaCorrentes[i].contaPrincipal = "N";

            if (this.pessoaId > 0) {  

              this.pessoaService.AtualizarEmpresaContaCorrente(this.empresaContaCorrentes[i])
              .subscribe(result => {}, error => { this.errors; });
            }
          }
        }
      }

      if (this.pessoaId > 0) {

        p.pessoaId = this.pessoaId;
        
        for (let i = 0; this.iContaCorrentes.length > i; i++) {
          if (p.contaCorrenteId == this.iContaCorrentes[i].id) {
            p.contaCorrente = this.iContaCorrentes[i];
          }
        }
        this.pessoaService.AtualizarEmpresaContaCorrente(p)
          .subscribe(
            result => {

              for (let i = 0; this.pessoaComponent.Pessoa.empresaContaCorrente.length > i; i++) {
                if (result.id == this.pessoaComponent.Pessoa.empresaContaCorrente[i].id) {
                  this.pessoaComponent.Pessoa.empresaContaCorrente[i] = result;
                }
              }

              this.listEmpresaContaCorrente.empresaContaCorrenteGravado('Conta editado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
      } else {

        this.empresaContaCorrente = p;

        for (let i = 0; this.iContaCorrentes.length > i; i++) {
          if (this.empresaContaCorrente.contaCorrenteId == this.iContaCorrentes[i].id) {
            this.empresaContaCorrente.contaCorrente = this.iContaCorrentes[i];
          }
        }

        for (let i = 0; this.pessoaComponent.Pessoa.empresaContaCorrente.length > i; i++) {
          if (this.empresaContaCorrente.id == this.pessoaComponent.Pessoa.empresaContaCorrente[i].id) {
            this.pessoaComponent.Pessoa.empresaContaCorrente[i] = this.empresaContaCorrente;
          }
        }

        this.listEmpresaContaCorrente.empresaContaCorrenteGravado('Conta editado com sucesso!');
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

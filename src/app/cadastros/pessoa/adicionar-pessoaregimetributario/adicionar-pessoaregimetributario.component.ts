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
  selector: 'app-adicionar-pessoaregimetributario',
  templateUrl: './adicionar-pessoaregimetributario.component.html',
  styleUrls: ['./adicionar-pessoaregimetributario.component.css']
})
export class AdicionarPessoaregimetributarioComponent implements OnInit {
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
  }

  adicionarPessoaRegimeTributario() {

    if(this.pessoaComponent.Pessoa.pessoaRegimeTributario == null){
      this.pessoaComponent.Pessoa.pessoaRegimeTributario = new Array();
    }

    if (this.pessoaRegimeTributarioForm.dirty && this.pessoaRegimeTributarioForm.valid) {
      let p = Object.assign({}, this.pessoaRegimeTributario, this.pessoaRegimeTributarioForm.getRawValue());

      this.pessoaComponent.dirty = true;
      
      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;

        // this.pessoaRegimeTributario = p;

        this.pessoaService.AdicionarPessoaRegimeTributario(p)
          .subscribe(
          result => {

            for (let i = 0; this.regimeTributarios.length > i; i++) {
              if (result.regimeTributarioId == this.regimeTributarios[i].id) {
                result.regimeTributario = this.regimeTributarios[i];
              }
            }
            if(this.pessoaComponent.Pessoa.pessoaRegimeTributario == null){
              this.pessoaComponent.Pessoa.pessoaRegimeTributario = new Array();
            }  
            this.pessoaComponent.Pessoa.pessoaRegimeTributario.push(result);
            this.listPessoaRegimeTributario.pessoaRegimeTributarioGravado('Regime Tributário adicionado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {

        console.log(p);
        this.pessoaRegimeTributario = p;

        p.id = 0;

        if (this.pessoaComponent.Pessoa.pessoaRegimeTributario.length > 0) {
          p.id = this.pessoaComponent.Pessoa.pessoaRegimeTributario.length + 1;
        }

        for (let i = 0; this.regimeTributarios.length > i; i++) {
          if (this.pessoaRegimeTributario.regimeTributarioId == this.regimeTributarios[i].id) {
            this.pessoaRegimeTributario.regimeTributario = this.regimeTributarios[i];
          }
        }

        this.pessoaComponent.Pessoa.pessoaRegimeTributario.push(this.pessoaRegimeTributario);
        console.log(this.pessoaComponent.Pessoa.pessoaRegimeTributario);
        this.listPessoaRegimeTributario.pessoaRegimeTributarioGravado('Regime Tributário adicionado com sucesso!');
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

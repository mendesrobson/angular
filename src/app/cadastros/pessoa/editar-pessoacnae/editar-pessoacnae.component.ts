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
import { ListaPessoacnaeComponent } from '../lista-pessoacnae/lista-pessoacnae.component';
import { PessoaCnae } from '../models/pessoa';

@Component({
  selector: 'app-editar-pessoacnae',
  templateUrl: './editar-pessoacnae.component.html',
  styleUrls: ['./editar-pessoacnae.component.css']
})
export class EditarPessoacnaeComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};
  cnaeMask = this._maskService.Cnae();

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public pessoaCnae: PessoaCnae;
  public pessoaCnaes = [];
  public pessoaCnaeForm: FormGroup;
  public pessoaId = 0;

  constructor(private pessoaService: PessoaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent,
    private listPessoaCnae: ListaPessoacnaeComponent) {

    this.validationMessages = {
      tipoContatoId: {
        required: 'Tipo requerido.'
      },
      descricao: {
        required: 'Descrição requerido.'
      },
      dataInicio: {
        required: 'Data Inicial requerido.'
      },
      atividade: {
        required: 'Atividade requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.pessoaCnae = new PessoaCnae();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.pessoaCnaeForm = this.fb.group({
      id: 0,
      codigo: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      atividade: '',
    });

    this.preencherCnaeForm(this.pessoaComponent.PessoaCnae);
  }

  preencherCnaeForm(pessoaCnae: PessoaCnae): void {

    this.pessoaCnae = pessoaCnae;

    let atividade = '';

    if (this.pessoaCnae.atividadePrincipal == 'S') {
      atividade = 'principal';
    } else if (this.pessoaCnae.atividadeSecundaria == 'S') {
      atividade = 'secundaria';
    }

    let dataFim = '';
    if (this.pessoaCnae.dataFim == null || this.pessoaCnae.dataFim == '') {
      dataFim = '';
    } else {
      dataFim = this.utilService.ToDate(this.pessoaCnae.dataFim);
    }

    let dataInicio = '';
    if (this.pessoaCnae.dataInicio == null || this.pessoaCnae.dataInicio == '') {
      dataInicio = '';
    } else {
      dataInicio = this.utilService.ToDate(this.pessoaCnae.dataInicio);
    }



    this.pessoaCnaeForm.patchValue({
      id: this.pessoaCnae.id,
      codigo: this.pessoaCnae.codigo,
      descricao: this.pessoaCnae.descricao,
      dataInicio: dataInicio,
      dataFim: dataFim,
      atividade: atividade
    })

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.pessoaCnaeForm);
    });
  }


  editarPessoaCnae() {
    if (this.pessoaCnaeForm.dirty && this.pessoaCnaeForm.valid) {
      let p = Object.assign({}, this.pessoaCnae, this.pessoaCnaeForm.getRawValue());

      this.pessoaComponent.dirty = true;
      
      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;

        if (p.atividade == 'principal') {
          this.pessoaCnae.atividadePrincipal = 'S';
          this.pessoaCnae.atividadeSecundaria = 'N';
        } else if (p.atividade == 'secundaria') {
          this.pessoaCnae.atividadePrincipal = 'N';
          this.pessoaCnae.atividadeSecundaria = 'S';
        }

        this.pessoaCnae = p;

        this.pessoaService.AtualizarPessoaCnae(this.pessoaCnae)
          .subscribe(
          result => {

            for (let i = 0; this.pessoaComponent.Pessoa.pessoaCnae.length > i; i++) {
              if (result.id == this.pessoaComponent.Pessoa.pessoaCnae[i].id) {
                this.pessoaComponent.Pessoa.pessoaCnae[i] = result;
              }
            }

            this.listPessoaCnae.pessoaCnaeGravado('Cnae editado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {

        if (p.atividade == 'principal') {
          this.pessoaCnae.atividadePrincipal = 'S';
          this.pessoaCnae.atividadeSecundaria = 'N';
        } else if (p.atividade == 'secundaria') {
          this.pessoaCnae.atividadePrincipal = 'N';
          this.pessoaCnae.atividadeSecundaria = 'S';
        }

        this.pessoaCnae.codigo = p.codigo;
        this.pessoaCnae.dataFim = p.dataFim;
        this.pessoaCnae.dataInicio = p.dataInicio;
        this.pessoaCnae.descricao = p.descricao;

        for (let i = 0; this.pessoaComponent.Pessoa.pessoaCnae.length > i; i++) {
          if (this.pessoaCnae.id == this.pessoaComponent.Pessoa.pessoaCnae[i].id) {
            this.pessoaComponent.Pessoa.pessoaCnae[i] = this.pessoaCnae;
          }
        }

        this.listPessoaCnae.pessoaCnaeGravado('Cnae editado com sucesso!');
        this.close();
      }

    }
  }

  ConsultaCnae(cnae) {
    cnae = cnae.replace(/\D/g, '');
    if (cnae != '') {
      this.pessoaService.BuscarDadosCnae(cnae)
        .subscribe(
        result => {
          this.popularFormCnae(result);

        },
        error => {
          this.onError(error)
        })
    }

  }

  popularFormCnae(dados) {
    this.pessoaCnaeForm.patchValue({
      descricao: dados.descricao
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

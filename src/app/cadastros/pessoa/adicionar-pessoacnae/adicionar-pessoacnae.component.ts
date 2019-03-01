import { Component, OnInit,ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { PessoaService } from '../pessoa.service';
import { PessoaComponent } from '../pessoa.component';
import { ListaPessoacnaeComponent } from '../lista-pessoacnae/lista-pessoacnae.component';
import { PessoaCnae } from '../models/pessoa';

@Component({
  selector: 'app-adicionar-pessoacnae',
  templateUrl: './adicionar-pessoacnae.component.html',
  styleUrls: ['./adicionar-pessoacnae.component.css']
})
export class AdicionarPessoacnaeComponent implements OnInit {
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

  public pessoaCnae: PessoaCnae;
  public pessoaCnaes = [];
  public pessoaCnaeForm: FormGroup;
  public pessoaId = 0;

  cnaeMask = this._maskService.Cnae();

  constructor(private pessoaService: PessoaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
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

  }


  adicionarPessoaCnae() {

    if (this.pessoaCnaeForm.dirty && this.pessoaCnaeForm.valid) {
      let p = Object.assign({}, this.pessoaCnae, this.pessoaCnaeForm.getRawValue());

      this.pessoaComponent.dirty = true;

      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;

        this.pessoaCnae = p;

        if (p.atividade == 'primaria') {
          this.pessoaCnae.atividadePrincipal = 'S';
          this.pessoaCnae.atividadeSecundaria = 'N';
        } else if (p.atividade == 'secundaria') {
          this.pessoaCnae.atividadePrincipal = 'N';
          this.pessoaCnae.atividadeSecundaria = 'S';
        }

        this.pessoaService.AdicionarPessoaCnae(this.pessoaCnae)
          .subscribe(
          result => {
            if(this.pessoaComponent.Pessoa.pessoaCnae == null){
              this.pessoaComponent.Pessoa.pessoaCnae = new Array();
            }  
            this.pessoaComponent.Pessoa.pessoaCnae.push(result);
            this.listPessoaCnae.pessoaCnaeGravado('Cnae adicionado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {

        console.log(p);

        p.id = 0;

        if (this.pessoaComponent.Pessoa.pessoaCnae.length > 0) {
          p.id = this.pessoaComponent.Pessoa.pessoaCnae.length + 1;
        }

        if (p.atividade === "principal") {
          console.log("Entrou");
          this.pessoaCnae.atividadePrincipal = 'S';
          this.pessoaCnae.atividadeSecundaria = 'N';
        } else if (p.atividade === "secundaria") {
          this.pessoaCnae.atividadePrincipal = 'N';
          this.pessoaCnae.atividadeSecundaria = 'S';
        }

        this.pessoaCnae.codigo = p.codigo;
        this.pessoaCnae.dataFim = p.dataFim;
        this.pessoaCnae.dataInicio = p.dataInicio;
        this.pessoaCnae.descricao = p.descricao;

        this.pessoaComponent.Pessoa.pessoaCnae.push(this.pessoaCnae);
        console.log(this.pessoaComponent.Pessoa.pessoaCnae);
        this.listPessoaCnae.pessoaCnaeGravado('Cnae adicionado com sucesso!');
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

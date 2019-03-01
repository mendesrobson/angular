import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SindicatoConvencao, Convencao } from './../models/sindicato';
import { SindicatoService } from '../sindicato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SindicatoComponent } from '../sindicato.component';
import { ListaSindicatoconvencaoComponent } from '../lista-sindicatoconvencao/lista-sindicatoconvencao.component';


@Component({
  selector: 'app-adicionar-sindicatoconvencao',
  templateUrl: './adicionar-sindicatoconvencao.component.html',
  styleUrls: ['./adicionar-sindicatoconvencao.component.css']
})
export class AdicionarSindicatoconvencaoComponent implements OnInit {

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

  public sindicatoConvencao: SindicatoConvencao;
  public sindicatoConvencoes = [];
  public sindicatoConvencaoForm: FormGroup;
  public sindicatoId = 0;
  public convencoes : Convencao[];

  constructor(
    private sindicatoService: SindicatoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sindicatoComponent: SindicatoComponent,
    private listaSindicatoConvencaoComponent : ListaSindicatoconvencaoComponent
  ) {
    this.validationMessages = {
      convencaoId:
        {
          required: 'Convenção Requerido.'
        },
      dataInicio:
        {
          required: 'Data Inicial Requerido.'
        },
      dataTermino:
        {
          required: 'Data Final Requerido.'
        },
        dataHomologacao:
        {
          required: 'Data Final Requerido.'
        },
        observacao:
        {
          required: 'Observação Requerido.'
        }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.sindicatoConvencao = new SindicatoConvencao();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] === undefined) {
      this.sindicatoId = 0;
    } else {
      this.sindicatoId = this.route.snapshot.params['id'];
    }
    this.sindicatoConvencaoForm = this.fb.group({
      id: 0,
      sindicatoId: 0,
      convencaoId: ['', [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataTermino: ['', [Validators.required]],
      dataHomologacao: ['', [Validators.required]],
      observacao: ['', [Validators.required]],
      excluido: 'N'
    });

    this.sindicatoService.obterTodosConvencao().subscribe(
     listconvencoes => {
        this.convencoes = listconvencoes;
     });
  }

  adicionarSindicatoConvencao() {
    
    if (this.sindicatoConvencaoForm.dirty && this.sindicatoConvencaoForm.valid) {
      const p = Object.assign({}, this.sindicatoConvencao, this.sindicatoConvencaoForm.getRawValue());

      this.sindicatoComponent.dirty = true;

      if (this.sindicatoId > 0) {
        p.sindicatoId = this.sindicatoId;
        p.id = 0;
        this.sindicatoService.adicionarSindicatoConvencao(p)
          .subscribe(
            result => {
              if (result) {

                if (this.sindicatoComponent.Sindicato.sindicatoConvencao == null) {
                  this.sindicatoComponent.Sindicato.sindicatoConvencao = new Array();
                }

                this.sindicatoService.obterTodosSindicatoConvencaoPorSindicatoId(this.sindicatoId.toString())
                .subscribe(result => { this.sindicatoConvencoes = result;
                    if(this.sindicatoConvencoes != null){

                        for(let i = 0; i < this.sindicatoConvencoes.length; i ++){

                            for(let y = 0; y < this.convencoes.length; y++){

                                if(this.sindicatoConvencoes[i].convencaoId == this.convencoes[y].id){
                        
                                    this.sindicatoConvencoes[i].convencao = this.convencoes[y];

                                }

                            }

                        }

                    }

                    this.sindicatoComponent.sindicato.sindicatoConvencao = this.sindicatoConvencoes;

                });

                this.swal.showSwalSuccess('Sindicato Convenção adicionado com sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            () => this.errors);
      } else {
        p.id = 0;
        if (this.sindicatoComponent.Sindicato.sindicatoConvencao.length > 0) {
          p.id = this.sindicatoComponent.Sindicato.sindicatoConvencao.length + 1;
        }
        for (let i = 0; this.convencoes.length > i; i++) {
          if (p.convencaoId === this.convencoes[i].id) {
            p.convencao = this.convencoes[i];
          }
        }
        if (this.sindicatoComponent.Sindicato.sindicatoConvencao == null) {
          this.sindicatoComponent.Sindicato.sindicatoConvencao = new Array();
        }
        this.sindicatoComponent.Sindicato.sindicatoConvencao.push(p);
        this.listaSindicatoConvencaoComponent.cargoCboGravado('Sindicato Convenção , adicionado com sucesso!');
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

import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { SindicatoConvencao, Convencao } from '../models/sindicato';
import { SindicatoService } from '../sindicato.service';
import { SindicatoComponent } from '../sindicato.component';
import { ListaSindicatoconvencaoComponent } from './../lista-sindicatoconvencao/lista-sindicatoconvencao.component';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-editar-sindicatoconvencao',
  templateUrl: './editar-sindicatoconvencao.component.html',
  styleUrls: ['./editar-sindicatoconvencao.component.css']
})
export class EditarSindicatoconvencaoComponent implements OnInit {
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
    public convencoes: Convencao[];

    constructor(
      private sindicatoService: SindicatoService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private httpClient: HttpClient,
      private sindicatoComponent: SindicatoComponent,
      private listSindicatoConvencao: ListaSindicatoconvencaoComponent,
      private _utilService: UtilService
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
        sindicatoId: '',
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

      this.preencherSindicatoConvencao(this.sindicatoComponent.SindicatoConvencao);
    }

    preencherSindicatoConvencao(sindicatoConvencao: SindicatoConvencao) {
      this.sindicatoConvencaoForm.patchValue({
        id: sindicatoConvencao.id,
        sindicatoId: sindicatoConvencao.sindicatoId,
        convencaoId: sindicatoConvencao.convencaoId,
        dataInicio: this._utilService.ToDate(sindicatoConvencao.dataInicio),
        dataTermino: this._utilService.ToDate(sindicatoConvencao.dataTermino),
        dataHomologacao: this._utilService.ToDate(sindicatoConvencao.dataHomologacao),
        observacao: sindicatoConvencao.observacao,
      });
    }

    editarSindicatoConvencao() {
      this.sindicatoConvencoes = this.sindicatoComponent.Sindicato.sindicatoConvencao;
      if (this.sindicatoConvencaoForm.dirty && this.sindicatoConvencaoForm.valid) {
        const p = Object.assign({}, this.sindicatoConvencao, this.sindicatoConvencaoForm.getRawValue());

        this.sindicatoComponent.dirty = true;

        if (this.sindicatoId > 0) {
          p.cargoId = this.sindicatoId;
          p.cbo = null;
          this.sindicatoService.atualizarSindicatoConvencao(p)
            .subscribe(
              result => {
                if (result) {
                  for (let i = 0; this.convencoes.length > i; i++) {
                    if (p.convencaoId === this.convencoes[i].id) {
                      p.convencao = this.convencoes[i];
                    }
                  }
                  for (let i = 0; this.sindicatoComponent.Sindicato.sindicatoConvencao.length > i; i++) {
                      if (p.id === this.sindicatoComponent.Sindicato.sindicatoConvencao[i].id) {
                        this.sindicatoComponent.Sindicato.sindicatoConvencao[i] = p;
                       }
                  }
                  this.swal.showSwalSuccess('Cargo Cbo, Editado com Sucesso!');
                  this.close();
                } else {
                  this.swal.showSwalErro('Ocorreu um erro ao gravar!');
                }

              },
              () =>  this.errors
          );

        } else {

          this.sindicatoConvencao = p;
          for (let i = 0; this.convencoes.length > i; i++) {
            if (this.sindicatoConvencao.convencaoId === this.convencoes[i].id) {
              this.sindicatoConvencao.convencao = this.convencoes[i];
            }
          }
          for (let i = 0; this.sindicatoComponent.Sindicato.sindicatoConvencao.length > i; i++) {
            if (this.sindicatoConvencao.id === this.sindicatoComponent.Sindicato.sindicatoConvencao[i].id) {
              this.sindicatoComponent.Sindicato.sindicatoConvencao[i] = this.sindicatoConvencao;
            }
          }

          this.listSindicatoConvencao.cargoCboGravado('Cargo Cbo editado com sucesso!');
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

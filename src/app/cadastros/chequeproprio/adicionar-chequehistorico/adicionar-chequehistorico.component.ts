import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { ChequeProprioService } from '../chequeproprio.service';
import { ChequeproprioComponent } from '../chequeproprio.component';
import { ListaChequefolhahistoricoComponent } from '../lista-chequefolhahistorico/lista-chequefolhahistorico.component';
import { ChequeFolha, ChequeFolhaHistorico, ChequeTalao, SituacaoCheque } from '../models/chequeproprio';

@Component({
  selector: 'app-adicionar-chequehistorico',
  templateUrl: './adicionar-chequehistorico.component.html',
  styleUrls: ['./adicionar-chequehistorico.component.css']
})
export class AdicionarChequehistoricoComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() ind: number = 0;
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

  public chequeFolhaHistorico: ChequeFolhaHistorico;
  public chequeFolhaHistoricos = [];
  public chequeFolhaHistoricoForm: FormGroup;
  public chequeTalaoId = 0;
  public chequeFolha: ChequeFolha;

  public situacaoCheques: SituacaoCheque[];

  constructor(private chequeProprioService: ChequeProprioService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private chequeProprioComponent: ChequeproprioComponent//,
    // private listChequeFolhaHistorico: ListaChequefolhahistoricoComponent
  ) {

    this.validationMessages = {
      situacaoChequeId: {
        required: 'Situação requerida.'
      },
      observacao: {
        required: 'Observação requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.chequeFolhaHistorico = new ChequeFolhaHistorico();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.chequeTalaoId = 0
    else
      this.chequeTalaoId = this.route.snapshot.params['id'];

    this.chequeFolhaHistoricoForm = this.fb.group({
      situacaoChequeId: ['', [Validators.required]],
      observacao: ['', [Validators.required]]
    });

    this.chequeProprioService.obterTodosSituacaoCheque()
      .subscribe(situacaoCheques => {
        this.situacaoCheques = situacaoCheques;
      },
      error => this.errors);

  }


  adicionarChequeFolhaHistorico() {
    if (this.chequeFolhaHistoricoForm.dirty && this.chequeFolhaHistoricoForm.valid) {
      let p = Object.assign({}, this.chequeFolhaHistorico, this.chequeFolhaHistoricoForm.getRawValue());

      this.chequeProprioComponent.dirty = true;

      //let dateHoje = Date.now();
      let date = new Date();
      let dataAtual = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString();
      
      p.dataEmissao = dataAtual;
      p.chequeFolhaId = this.chequeProprioComponent.chequeFolha.id;
      
      if(this.chequeTalaoId > 0){

        for (let i = 0; this.situacaoCheques.length > i; i++) {
            if (this.situacaoCheques[i].id == p.situacaoChequeId) {
              p.situacaoCheque = this.situacaoCheques[i];
            }
        }

        this.chequeProprioService.AdicionarChequeFolhaHistorico(p)
        .subscribe(result => {
        
          if(this.chequeProprioComponent.chequeFolha.chequeFolhaHistorico == null){
            this.chequeProprioComponent.chequeFolha.chequeFolhaHistorico = new Array();
          }

          this.chequeProprioComponent.chequeFolha.situacao = p.situacaoCheque.descricao;
          this.chequeProprioComponent.chequeFolha.chequeFolhaHistorico.push(p);

          if(this.chequeProprioComponent.chequeTalao.chequeFolha != null){

                for(let i = 0; i < this.chequeProprioComponent.chequeTalao.chequeFolha.length; i++){

                    if(this.chequeProprioComponent.chequeFolha.id == this.chequeProprioComponent.chequeTalao.chequeFolha[i].id){

                          this.chequeProprioComponent.chequeTalao.chequeFolha[i] = this.chequeProprioComponent.chequeFolha;
                    }

                }
          }

          

          this.swal.showSwalSuccess('Histórico gravado com sucesso!');
          this.close();

        });

      }else{

        for (let i = 0; this.situacaoCheques.length > i; i++) {
            if (this.situacaoCheques[i].id == p.situacaoChequeId) {
              p.situacaoCheque = this.situacaoCheques[i];
            }
        }

        if(this.chequeProprioComponent.chequeFolha.chequeFolhaHistorico == null){
          this.chequeProprioComponent.chequeFolha.chequeFolhaHistorico = new Array();
        }

        this.chequeProprioComponent.chequeFolha.situacao = p.situacaoCheque.descricao;
        this.chequeProprioComponent.chequeFolha.chequeFolhaHistorico.push(p);

        if(this.chequeProprioComponent.chequeTalao.chequeFolha != null){

              for(let i = 0; i < this.chequeProprioComponent.chequeTalao.chequeFolha.length; i++){

                  if(this.chequeProprioComponent.chequeFolha.id == this.chequeProprioComponent.chequeTalao.chequeFolha[i].id){

                      this.chequeProprioComponent.chequeTalao.chequeFolha[i] = this.chequeProprioComponent.chequeFolha;

                  }

              }

        }

        this.swal.showSwalSuccess('Histórico gravado com sucesso!');
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

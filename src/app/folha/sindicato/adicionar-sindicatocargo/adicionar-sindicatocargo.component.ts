import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ListaSindicatocargoComponent } from '../lista-sindicatocargo/lista-sindicatocargo.component';
import { SindicatoComponent } from '../sindicato.component';
import { SindicatoService } from './../sindicato.service';
import { SindicatoCargo, Cargo } from '../models/sindicato'

@Component({
  selector: 'app-adicionar-sindicatocargo',
  templateUrl: './adicionar-sindicatocargo.component.html',
  styleUrls: ['./adicionar-sindicatocargo.component.css']
})
export class AdicionarSindicatocargoComponent implements OnInit {
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

  public sindicatoCargo: SindicatoCargo;
  public sindicatoCargos = [];
  public sindicatoCargoForm: FormGroup;
  public sindicatoId = 0;
  public cargos : Cargo[];
  public return: any;

  constructor(
    private sindicatoService: SindicatoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sindicatoComponent: SindicatoComponent,
    private listaSindicatoCargo: ListaSindicatocargoComponent) { 

      this.validationMessages = {
        cargoId:{
            required: 'Cargo Requerido!'
          },
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.sindicatoCargo = new SindicatoCargo();
      this.swal = new SweetAlertAdviceService();
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.sindicatoId = 0;
    } else {
      this.sindicatoId = this.route.snapshot.params['id'];
    }
    this.sindicatoCargoForm = this.fb.group({
      id: 0, 
      cargoId: ['', [Validators.required]],
      excluido: 'N'
    });

    this.sindicatoService.obterTodosCargo().subscribe(
     cargos => {
        this.cargos = cargos;
     });

  }

  adicionarSindicatoCargo() {

     if (this.sindicatoCargoForm.dirty && this.sindicatoCargoForm.valid) {
      
      const p = Object.assign({}, this.sindicatoCargo, this.sindicatoCargoForm.getRawValue());
      
      this.sindicatoComponent.dirty = true;

      if (this.sindicatoId > 0) {
        p.sindicatoId = this.sindicatoId;
        p.id = 0;
        p.sindicato = null; 
        this.sindicatoService.adicionarSindicatoCargo(p)
          .subscribe(
            result => {
              if (result['isValid']) {
               
                if(this.sindicatoComponent.sindicato.sindicatoCargo == null){
                  this.sindicatoComponent.sindicato.sindicatoCargo = new Array();
                }

                this.sindicatoService.obterTodosSindicatoCargoPorSindicatoId(this.sindicatoId.toString())
                .subscribe(result => { this.sindicatoCargos = result;
                   if(this.sindicatoCargos != null){

                        for(let i = 0; i < this.sindicatoCargos.length; i ++){

                            for(let y = 0; y < this.cargos.length; y++){

                                if(this.sindicatoCargos[i].cargoId == this.cargos[y].id){
                        
                                this.sindicatoCargos[i].cargo = this.cargos[y];

                                }

                            }

                        }

                    }

                    this.sindicatoComponent.sindicato.sindicatoCargo = this.sindicatoCargos;

                });
                
                this.swal.showSwalSuccess('Cargo Sindicato gravado com sucesso!'); 
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            error => {              
              this.errors;
            });
      } else {
        p.id = 0;
        if (this.sindicatoComponent.Sindicato.sindicatoCargo.length > 0) {
          p.id = this.sindicatoComponent.Sindicato.sindicatoCargo.length + 1;
        }
        for (let i = 0; this.cargos.length > i; i++) {
          if (p.cargoId == this.cargos[i].id) {
            p.cargo = this.cargos[i];
          }
        }
        if (this.sindicatoComponent.Sindicato.sindicatoCargo == null) {
          this.sindicatoComponent.Sindicato.sindicatoCargo = new Array();
        }
        this.sindicatoComponent.Sindicato.sindicatoCargo.push(p);
        this.swal.showSwalSuccess('Cargo Sindicato adicionado com sucesso!');
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

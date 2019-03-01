import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { CargoCbo } from '../models/cargo';
import { CargoService } from './../cargo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CargoComponent } from '../cargo.component';
import { ListaCargocboComponent } from '../lista-cargocbo/lista-cargocbo.component';
import { Cbo } from './../../cbo/models/cbo';

@Component({
  selector: 'app-adicionar-cargocbo',
  templateUrl: './adicionar-cargocbo.component.html',
  styleUrls: ['./adicionar-cargocbo.component.css']
})
export class AdicionarCargocboComponent implements OnInit {
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

  public cargoCbo: CargoCbo;
  public cargoCbos = [];
  public cargoCboForm: FormGroup;
  public cargoId = 0;
  public cbos : Cbo[];

  constructor(
    private cargoService: CargoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cargoComponent: CargoComponent,
    private listCargoCbo: ListaCargocboComponent
  ) {
    this.validationMessages = {
      cboId:
        {
          required: 'CBO Requerido.'
        },
      dataInicial:
        {
          required: 'Data Inicial Requerido.'
        },
      dataFinal:
        {
          required: 'Data Final Requerido.'
        }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.cargoCbo = new CargoCbo();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] === undefined) {
      this.cargoId = 0;
    } else {
      this.cargoId = this.route.snapshot.params['id'];
    }
    this.cargoCboForm = this.fb.group({
      id: 0, 
      cargoId: '',
      cboId: ['', [Validators.required]],
      dataFinal: ['', [Validators.required]],      
      dataInicial: ['', [Validators.required]],
      excluido: 'N'
    });

    this.cargoService.obterTodosCbo().subscribe(
     listcbo => {
        this.cbos = listcbo;
     });
  }

  adicionarCargoCbo() {
   
    if (this.cargoCboForm.dirty && this.cargoCboForm.valid) {
      const p = Object.assign({}, this.cargoCbo, this.cargoCboForm.getRawValue());

      this.cargoComponent.dirty = true;

      if (this.cargoId > 0) {
        p.cargoId = this.cargoId;
        p.id = 0;
        p.cbo = null; 
        this.cargoService.adicionarCargoCbo(p)
          .subscribe(
            result => {
              if (result) {

                if (this.cargoComponent.Cargo.cargoCbo == null) {
                  this.cargoComponent.Cargo.cargoCbo = new Array();
                }

                this.cargoService.obterTodosCargoCboPorCargoId(this.cargoId.toString())
                .subscribe(cargosCbo => { this.cargoCbos = cargosCbo

                  if(this.cargoCbos != null){
                    
                    for(let i = 0; i < this.cargoCbos.length; i++){

                      for (let y = 0; this.cbos.length > y; y++) {
                        if (this.cargoCbos[i].cboId == this.cbos[y].id) {
                          this.cargoCbos[i].cbo = this.cbos[y];
                        }
                      }

                    }
                  }

                  this.cargoComponent.cargo.cargoCbo = this.cargoCbos;

                });

                this.swal.showSwalSuccess('Cargo Cbo, Adicionado com Sucesso!');
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
        if (this.cargoComponent.Cargo.cargoCbo.length > 0) {
          p.id = this.cargoComponent.Cargo.cargoCbo.length + 1;
        }
        for (let i = 0; this.cbos.length > i; i++) {
          if (p.cboId == this.cbos[i].id) {
            p.cbo = this.cbos[i];
          }
        }
        if (this.cargoComponent.Cargo.cargoCbo == null) {
          this.cargoComponent.Cargo.cargoCbo = new Array();
        }
        this.cargoComponent.Cargo.cargoCbo.push(p);
        this.listCargoCbo.cargoCboGravado('Cargo Cbo, adicionado com sucesso!');
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

import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { CargoCbo } from '../models/cargo';
import { Cbo } from '../../cbo/models/cbo';
import { CargoService } from '../cargo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CargoComponent } from '../cargo.component';
import { ListaCargocboComponent } from '../lista-cargocbo/lista-cargocbo.component';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-editar-cargocbo',
  templateUrl: './editar-cargocbo.component.html',
  styleUrls: ['./editar-cargocbo.component.css']
})
export class EditarCargocboComponent implements OnInit {
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
  public cbos: Cbo[];

  constructor(
    private cargoService: CargoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cargoComponent: CargoComponent,
    private listCargoCbo: ListaCargocboComponent,
    private _utilService: UtilService
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
      dataInicial: ['', [Validators.required]]
    });

    this.cargoService.obterTodosCbo().subscribe(
      listcbo => {
        this.cbos = listcbo;
      });

    this.preencherCargoCbo(this.cargoComponent.CargoCbo);
  }

  preencherCargoCbo(cargoCbo: CargoCbo) {
    this.cargoCboForm.patchValue({
      id: cargoCbo.id, 
      cargoId: cargoCbo.cargoId,
      cboId: cargoCbo.cboId,
      dataInicial: this._utilService.ToDate(cargoCbo.dataInicial),
      dataFinal: this._utilService.ToDate(cargoCbo.dataFinal)      
    });
  }

  editarCargoCbo() {
    this.cargoCbos = this.cargoComponent.Cargo.cargoCbo;
    if (this.cargoCboForm.dirty && this.cargoCboForm.valid) {
      const p = Object.assign({}, this.cargoCbo, this.cargoCboForm.getRawValue());

      this.cargoComponent.dirty = true;

      if (this.cargoId > 0) {
        p.cargoId = this.cargoId;
        p.cbo = null;
        this.cargoService.atualizarCargoCbo(p)
          .subscribe(
            result => {
              if (result) {
                for (let i = 0; this.cbos.length > i; i++) {
                  if (p.cboId == this.cbos[i].id) {
                    p.cbo = this.cbos[i];
                  }
                }
                for (let i = 0; this.cargoComponent.Cargo.cargoCbo.length > i; i++) {
                    if (p.id == this.cargoComponent.Cargo.cargoCbo[i].id) {
                      this.cargoComponent.Cargo.cargoCbo[i] = p;
                     }
                }
                this.swal.showSwalSuccess('Cargo Cbo, Editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            error => {
              this.errors;
            });

      } else {

        this.cargoCbo = p;
        for (let i = 0; this.cbos.length > i; i++) {
          if (this.cargoCbo.cboId == this.cbos[i].id) {
            this.cargoCbo.cbo = this.cbos[i];
          }
        }

        for (let i = 0; this.cargoComponent.Cargo.cargoCbo.length > i; i++) {
          if (this.cargoCbo.id == this.cargoComponent.Cargo.cargoCbo[i].id) {
            this.cargoComponent.Cargo.cargoCbo[i] = this.cargoCbo;
          }
        }

        this.listCargoCbo.cargoCboGravado('Cargo Cbo editado com sucesso!');
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

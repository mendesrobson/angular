import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';
import { HttpClient } from '@angular/common/http';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { AdministradoracartaoComponent } from '../administradoracartao.component';
import { ListaAdministradoracartaoenderecoComponent } from '../lista-administradoracartaoendereco/lista-administradoracartaoendereco.component';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from '../models/administradoracartao';
import { TipoLogradouro, Uf, Pais, Localidade } from '../../pessoa/models/pessoa';
import { DYNAMIC_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-adicionar-administradoracartaoendereco',
  templateUrl: './adicionar-administradoracartaoendereco.component.html',
  styleUrls: ['./adicionar-administradoracartaoendereco.component.css']
})
export class AdicionarAdministradoracartaoenderecoComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  cepMask = this._maskService.Cep();
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public endereco: AdministradoraCartaoEndereco;
  public enderecos = [];
  public enderecoForm: FormGroup;
  public administradoraCartaoId = 0;
  public tipoLogradouros: TipoLogradouro[];
  public ufEnderecos: Uf[];
  public paisEnderecos: Pais[];
  public localidadeEnderecos: Localidade[];

  constructor(private administradoraCartaoService: AdministradoracartaoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private administradoraCartaoComponent: AdministradoracartaoComponent,
    private listAdministradoracartaoEndereco: ListaAdministradoracartaoenderecoComponent) { 

      this.validationMessages = {
        cep:
          {
            required: 'Cep requerido.'
          },
        numero:
          {
            required: 'Número requerido.'
          }
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.endereco = new AdministradoraCartaoEndereco();
      this.swal = new SweetAlertAdviceService();

    }

    ngOnInit() {
      if (this.route.snapshot.params['id'] == undefined)
        this.administradoraCartaoId = 0
      else
        this.administradoraCartaoId = this.route.snapshot.params['id'];
  
      this.enderecoForm = this.fb.group({
        cep: ['', [Validators.required]],
        tipoLogradouroId: [],
        logradouro: [],
        numero: ['', [Validators.required]],
        complemento: [],
        bairro: [],
        codigoMunicipio: [],
        localidadeId: [],
        ufId: [],
        paisId: [],
        enderecoPrincipal: 'N'
      });
  
    this.enderecoForm.controls['logradouro'].disable();
    this.enderecoForm.controls['bairro'].disable();
    this.enderecoForm.controls['codigoMunicipio'].disable();
    this.enderecoForm.controls['localidadeId'].disable();
    this.enderecoForm.controls['ufId'].disable();
    this.enderecoForm.controls['paisId'].disable();

    this.administradoraCartaoService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        error => this.errors);

      this.administradoraCartaoService.obterTodosLocalidadeEndereco()
      .subscribe(localidadeEnderecos => {
        this.localidadeEnderecos = localidadeEnderecos
      },
        error => this.errors);

    this.administradoraCartaoService.obterTodosUfEndereco()
      .subscribe(ufEnderecos => {
        this.ufEnderecos = ufEnderecos
      },
        error => this.errors);

    this.administradoraCartaoService.obterTodosPaisEndereco()
      .subscribe(paisEnderecos => {
        this.paisEnderecos = paisEnderecos
      },
        error => this.errors);

  }

  ConsultaCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get("//cepapi.delivoro.com.br/" + cep)
          .map(dados => dados)
          .subscribe(dados => this.popularForm(dados));
      }
    }
  }

  popularForm(dados) {
    this.obterLocalidadeId(dados.cidade);
    this.obterUfId(dados.cidade);
    this.obterTipoLogradouroId(dados.tipoLogradouro);
    this.obterPaisId('Brasil');
    this.consultaCepCodMunicipio(dados.cep);

    this.enderecoForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadeId(desc: string) {
    this.administradoraCartaoService.obterLocalidadeId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterUfId(desc: string) {
    this.administradoraCartaoService.obterUfId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterTipoLogradouroId(desc: string) {
    this.administradoraCartaoService.obterTipoLogradouroId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterPaisId(desc: string) {
    this.administradoraCartaoService.obterPaisId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  consultaCepCodMunicipio(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
          .map(result => result)
          .subscribe(result => this.enderecoForm.controls['codigoMunicipio'].patchValue(result.ibge));
      }
    }
  }

    adicionarEndereco() {
      this.enderecos = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco;
      if (this.enderecoForm.dirty && this.enderecoForm.valid) {
        let p = Object.assign({}, this.endereco, this.enderecoForm.getRawValue());
  
        if (this.enderecos != null) {
          if (p.enderecoPrincipal == "S") {
            for (var i = 0; i < this.enderecos.length; i++) {
              if (this.enderecos[i].enderecoPrincipal == "S") {
                this.enderecos[i].enderecoPrincipal = "N";
  
                if (this.administradoraCartaoId > 0) {
                  p.administradoraCartaoId = this.administradoraCartaoId;
                  this.administradoraCartaoService.AtualizarAdministradoraCartaoEndereco(this.enderecos[i])
                    .subscribe(
                      result => {
                      },
                      error => {
                        this.errors;
                      });
                }
              }
            }
          }
        }
  
        if (this.administradoraCartaoId > 0) {
          p.administradoraCartaoId = this.administradoraCartaoId;
          this.administradoraCartaoService.AdicionarAdministradoraCartaoEndereco(p)
            .subscribe(
              result => {
                this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.push(result);
                this.listAdministradoracartaoEndereco.administradoraCartaoEnderecoGravado('Endereço adicionado com sucesso!');
                this.close();
              },
              error => {
                this.errors;
              });
        } else {
          p.id = 0;
          if (this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.length > 0) {
            p.id = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.length + 1;
          }
          this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco.push(p);
          this.listAdministradoracartaoEndereco.administradoraCartaoEnderecoGravado('Endereço adicionado com sucesso!');
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

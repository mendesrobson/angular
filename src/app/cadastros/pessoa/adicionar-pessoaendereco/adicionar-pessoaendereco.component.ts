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
import { ListaPessoaenderecoComponent } from '../lista-pessoaendereco/lista-pessoaendereco.component';
import { TipoLogradouro, Endereco, Uf, Pais, Localidade } from '../models/pessoa';
import { HttpClient } from '@angular/common/http';
import { Pessoa } from '../../../contasreceber/titulo/models/titulo';


@Component({
  selector: 'app-adicionar-pessoaendereco',
  templateUrl: './adicionar-pessoaendereco.component.html',
  styleUrls: ['./adicionar-pessoaendereco.component.css']
})
export class AdicionarPessoaenderecoComponent implements OnInit {
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

  public endereco: Endereco;
  public enderecos = [];
  public enderecoForm: FormGroup;
  public pessoaId = 0;
  public tipoLogradouros: TipoLogradouro[];
  public ufEnderecos: Uf[];
  public paisEnderecos: Pais[];
  public localidadeEnderecos: Localidade[];

  constructor(private pessoaService: PessoaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private pessoaComponent: PessoaComponent,
    private listPessoaEndereco: ListaPessoaenderecoComponent) {

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
    this.endereco = new Endereco();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

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
      enderecoPrincipal: 'N',
      enderecoCobranca: 'N',
      enderecoEntragaDocumento: 'N',
      enderecoFaturamento: 'N'
    });

    this.enderecoForm.controls['logradouro'].disable();
    this.enderecoForm.controls['bairro'].disable();
    this.enderecoForm.controls['codigoMunicipio'].disable();
    this.enderecoForm.controls['localidadeId'].disable();
    this.enderecoForm.controls['ufId'].disable();
    this.enderecoForm.controls['paisId'].disable();

    this.pessoaService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        error => this.errors);

    this.pessoaService.obterTodosLocalidadeEndereco()
      .subscribe(localidadeEnderecos => {
        this.localidadeEnderecos = localidadeEnderecos
      },
        error => this.errors);

    this.pessoaService.obterTodosUfEndereco()
      .subscribe(ufEnderecos => {
        this.ufEnderecos = ufEnderecos
      },
        error => this.errors);

    this.pessoaService.obterTodosPaisEndereco()
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
    this.pessoaService.obterLocalidadeId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterUfId(desc: string) {
    this.pessoaService.obterUfId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterTipoLogradouroId(desc: string) {
    this.pessoaService.obterTipoLogradouroId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
        })
  }

  obterPaisId(desc: string) {
    this.pessoaService.obterPaisId(desc)
      .subscribe(
        result => {
          this.enderecoForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.onError(error)
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
    this.enderecos = this.pessoaComponent.Pessoa.endereco;
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {
      let p = Object.assign({}, this.endereco, this.enderecoForm.getRawValue());

      this.pessoaComponent.dirty = true;
      
      if (this.enderecos != null) {
        if (p.enderecoPrincipal == "S") {
          for (var i = 0; i < this.enderecos.length; i++) {
            if (this.enderecos[i].enderecoPrincipal == "S") {
              this.enderecos[i].enderecoPrincipal = "N";

              if (this.pessoaId > 0) {
                p.pessoaId = this.pessoaId;
                this.pessoaService.AtualizarPessoaEndereco(this.enderecos[i])
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

      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;
        this.pessoaService.AdicionarPessoaEndereco(p)
          .subscribe(
            result => {
              if(this.pessoaComponent.Pessoa.endereco == null){
                this.pessoaComponent.Pessoa.endereco = new Array();
              }
              this.pessoaComponent.Pessoa.endereco.push(result);
              this.listPessoaEndereco.pessoaEnderecoGravado('Endereço adicionado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
      } else {
        p.id = 0;
        if (this.pessoaComponent.Pessoa.endereco.length > 0) {
          p.id = this.pessoaComponent.Pessoa.endereco.length + 1;
        }
        this.pessoaComponent.Pessoa.endereco.push(p);
        this.listPessoaEndereco.pessoaEnderecoGravado('Endereço adicionado com sucesso!');
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


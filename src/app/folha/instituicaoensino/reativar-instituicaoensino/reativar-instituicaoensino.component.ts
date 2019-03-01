import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { InstituicaoEnsino, TipoLogradouro, Uf, Pais, Localidade } from '../models/instituicaoensino';
import { InstituicaoEnsinoService } from '../instituicaoensino.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-reativar-instituicaoensino',
  templateUrl: './reativar-instituicaoensino.component.html',
  styleUrls: []
})

export class ReativarInstituicaoensinoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean =  false;
  public reativarVisivel:   boolean =  false;
 
  public instituicaoEnsino: InstituicaoEnsino;
  public instituicaoEnsinoForm: FormGroup;
  public instituicaoEnsinoId: "";
 
  displayMessage: { [key: string]: string } = {};
 
  cepMask = this._maskService.Cep();
  cnpjMask = this._maskService.Cnpj();
  telMask = this._maskService.Telefone();
 
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipoLogradouros: TipoLogradouro[];
  public ufs: Uf[];
  public paises: Pais[];
  public localidades: Localidade[];
 
  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];
 
  private result = {};
 
  constructor(private instituicaoEnsinoService: InstituicaoEnsinoService,
   private fb: FormBuilder,
   private router: Router,
   private httpClient: HttpClient,
   private _maskService: MaskService,
   private route: ActivatedRoute) {
     this.validationMessages = {
     nome: {
       required: 'A Nome é requerido.',
       minlength: 'A Nome precisa ter no mínimo 3 caracteres',
       maxlength: 'A Nome precisa ter no máximo 100 caracteres'
     }
   };
   this.genericValidator = new GenericValidator(this.validationMessages);
       this.instituicaoEnsino = new InstituicaoEnsino();
       this.swal = new SweetAlertAdviceService();
 }

   ngOnInit() {
     this.instituicaoEnsinoForm = this.fb.group({
       id: 0,
       grupoEmpresaId: 0,
       empresaId: 0,
       tipoLogradouroId: 0,
       ufId: 0,
       paisId: 0,
       localidadeId: 0,
       codigo: [''],
       sigla: [''],
       nomeReitor: [''],
       nome: ['', [Validators.required,
           Validators.minLength(3),
           Validators.maxLength(100)]],
       cnpj: [''],
       logradouro: [''],
       numero: [''],
       complemento: [''],
       cep: [''],
       bairro: [''],
       codigoMunicipioIbge: 0,
       telefone: [''],
        email: [''],
        ramal: [''],
       tipoEnderecoId: 0,
       excluido: 'N'
     });

     this.sub = this.route.params.subscribe(
       params => {
         this.instituicaoEnsinoId = params['id'];
         this.obterInstituicaoEnsino(this.instituicaoEnsinoId);
       });

     this.instituicaoEnsinoService.obterTodosGrupoEmpresa()
       .subscribe(grupoEmpresas => {
         this.grupoEmpresas = grupoEmpresas;
       },
         error => this.errors);

     this.instituicaoEnsinoService.obterTodosTipoLogradouro()
       .subscribe(tipoLogradouros => {
         this.tipoLogradouros = tipoLogradouros;
       },
         error => this.errors);

     this.instituicaoEnsinoService.obterTodosLocalidade()
       .subscribe(localidades => {
         this.localidades = localidades;
       },
         error => this.errors);

     this.instituicaoEnsinoService.obterTodosUf()
       .subscribe(ufs => {
         this.ufs = ufs;
       },
         error => this.errors);

     this.instituicaoEnsinoService.obterTodosPais()
       .subscribe(paises => {
         this.paises = paises;
       },
         error => this.errors);
   }

   ngAfterViewInit(): void {
     const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarInstituicaoEnsino();
      } else {
        self.cancelar();
      }
    });
  }

   obterInstituicaoEnsino(id: string) {
     this.instituicaoEnsinoService.obterInstituicaoEnsino(id)
       .subscribe(
       instituicaoEnsino => this.preencherFormInstituicaoEnsino(instituicaoEnsino),
       response => {
         if (response.status === 404) {
           this.router.navigate(['404']);
         }
       });
   }

   preencherFormInstituicaoEnsino(instituicaoEnsino: InstituicaoEnsino): void {
     this.instituicaoEnsino = instituicaoEnsino;

     this.reativarVisivel = this.instituicaoEnsino.excluido === 'S';
     this.removerVisivel = this.instituicaoEnsino.excluido === 'N';

     this.instituicaoEnsinoForm.patchValue({
       id: this.instituicaoEnsino.id,
       grupoEmpresaId: this.instituicaoEnsino.grupoEmpresaId,
       empresaId: this.instituicaoEnsino.empresaId,
       tipoLogradouroId: this.instituicaoEnsino.tipoLogradouroId,
       ufId: this.instituicaoEnsino.ufId,
       paisId: this.instituicaoEnsino.paisId,
       localidadeId: this.instituicaoEnsino.localidadeId,
       codigo: this.instituicaoEnsino.codigo,
       sigla: this.instituicaoEnsino.sigla,
       nomeReitor: this.instituicaoEnsino.nomeReitor,
       nome: this.instituicaoEnsino.nome,
       cnpj: this.instituicaoEnsino.cnpj,
       logradouro: this.instituicaoEnsino.logradouro,
       numero: this.instituicaoEnsino.numero,
       complemento: this.instituicaoEnsino.complemento,
       cep: this.instituicaoEnsino.cep,
       bairro: this.instituicaoEnsino.bairro,
       codigoMunicipioIbge: this.instituicaoEnsino.codigoMunicipioIbge,
       telefone: this.instituicaoEnsino.telefone,
       excluido: this.instituicaoEnsino.excluido
     });
   }

   reativarInstituicaoEnsino() {
       this.instituicaoEnsinoService.ReativarInstituicaoEnsino(this.instituicaoEnsino)
         .subscribe(
           result => {
             if (result) {
               this.swal.showSwalSuccess('Instituição de Ensino, Reativado com Sucesso!');
               this.router.navigate(['instituicaoensino/lista']);
             } else {
               this.swal.showSwalErro('Ocorreu um erro ao gravar!');
             }
           },
           error => {
             console.error(error);
           });
   }
   onError(error) {
     this.errors = JSON.parse(error._body).errors;
   }
   cancelar() {
    this.router.navigate(['instituicaoensino/editar/' + this.instituicaoEnsinoId]);
  }
   remover(id) {
     this.router.navigate(['instituicaoensino/excluir/' + id]);
   }

   reativar(id) {
     this.router.navigate(['instituicaoensino/reativar/' + id]);
   }

   ConsultaCEP(cep) {
     if (cep === null) {
          return;
     }

     cep = cep.replace(/\D/g, '');
     if (cep !== "") {
       const validacep = /^[0-9]{8}$/;
       if (validacep.test(cep)) {
         this.httpClient.get<any>("//cepapi.delivoro.com.br/" + cep)
           .map(dados => dados)
           .subscribe(dados => this.popularForm(dados));
       }
     }
   }

   popularForm(dados) {
     if (dados === "") {
       this.instituicaoEnsinoForm.controls['localidadeId'].patchValue(0);
       this.instituicaoEnsinoForm.controls['ufId'].patchValue(0);
       this.instituicaoEnsinoForm.controls['tipoLogradouroId'].patchValue(0);
       this.instituicaoEnsinoForm.controls['paisId'].patchValue(0);
       this.instituicaoEnsinoForm.controls['codigoMunicipioIbge'].patchValue(0);
       this.instituicaoEnsinoForm.patchValue({
         logradouro: dados,
         bairro: dados
       });
       return;
     }

     this.obterLocalidadePorDesc(dados.cidade);
     this.obterUfPorDesc(dados.cidade);
     this.obterTipoLogradouroPorDesc(dados.tipoLogradouro);
     this.obterPaisPorDesc('Brasil');
     this.consultaCepCodMunicipio(dados.cep);

     this.instituicaoEnsinoForm.patchValue({
       logradouro: dados.logradouro,
       bairro: dados.bairro
     });
   }

   obterLocalidadePorDesc(desc: string) {
     this.instituicaoEnsinoService.obterLocalidadePorDesc(desc)
       .subscribe(
         result => {
           this.instituicaoEnsinoForm.controls['localidadeId'].patchValue(result[0].id);
         },
         error => {
           this.onError(error);
         });
   }

   obterUfPorDesc(desc: string) {
     this.instituicaoEnsinoService.obterUfPorDesc(desc)
       .subscribe(
         result => {
            this.instituicaoEnsinoForm.controls['ufId'].patchValue(result[0].id);
         },
         error => {
           this.onError(error);
         });
   }

   obterTipoLogradouroPorDesc(desc: string) {
     this.instituicaoEnsinoService.obterTipoLogradouroPorDesc(desc)
       .subscribe(
         result => {
           this.instituicaoEnsinoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
         },
         error => {
           this.onError(error);
         });
   }

   obterPaisPorDesc(desc: string) {
        this.instituicaoEnsinoService.obterPaisPorDesc(desc)
       .subscribe(
         result => {
           this.instituicaoEnsinoForm.controls['paisId'].patchValue(result[0].id);
         },
         error => {
           this.onError(error);
         });
   }

   consultaCepCodMunicipio(cep) {
     cep = cep.replace(/\D/g, '');
     if (cep !== "") {
       const validacep = /^[0-9]{8}$/;
       if (validacep.test(cep)) {
       //  this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
       this.httpClient.get<any>("http://apps.widenet.com.br/busca-cep/api/cep/" + cep + "/json/")
       .map(result => result)
           .subscribe(result => this.instituicaoEnsinoForm.controls['codigoMunicipioIbge'].patchValue(result.ibge));
       }
     }
   }

   ConsultaEmpresa(idGrupo) {
     this.empresas = [];
     this.instituicaoEnsinoService.obterTodosEmpresa(idGrupo)
       .subscribe(empresas => {
         this.empresas = empresas;
       },
         () => this.errors);
   }

   ConsultaCnpj(cnpj) {
     cnpj = cnpj.replace(/\D/g, '');
     if (cnpj !== "") {
       this.instituicaoEnsinoService.BuscarDadosCnpj(cnpj)
         .subscribe(
           result => {
             if (result.nome !== null) {
               this.popularFormCnpj(result);
             }
           },
           error => {
             this.onError(error);
           });
     }
   }

   popularFormCnpj(dados) {
     this.ConsultaCEP(dados.cep);
     this.instituicaoEnsinoForm.patchValue({
       cep: dados.cep.replace(".", ""),
       nome: dados.nome.substring(0, 100),
       telefone: dados.telefone.substring(0, 20)
     });
   }
}


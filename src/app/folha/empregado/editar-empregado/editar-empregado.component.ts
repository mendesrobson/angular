import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Empregado, Banco, InstituicaoEnsino, ValorTransporte, Cargo, Departamento, TiposSalarios } from '../models/empregado';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpregadoService } from '../empregado.service';
import { TipoDeAdmissao } from '../../tipodeadmissao/models/tipodeadmissao';
import { Sexo, Localidade, Uf, EstadoCivil, Cor, Pais, Pessoa, TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { GrauInstrucao } from '../../grauinstrucao/models/grauinstrucao';
import { TipoDeficiencia } from '../../tipodeficiencia/models/tipodeficiencia';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-editar-empregado',
  templateUrl: './editar-empregado.component.html',
  styleUrls: ['./editar-empregado.component.css']
})
export class EditarEmpregadoComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public modalAddContaCorrenteVisible: boolean;
  public modalAddAdmissaoVisible: boolean;
  public modalEditAdmissaoVisible: boolean;
  public modalAddBeneficiosVisible: boolean;
  public modalEditBeneficiosVisible: boolean;
  public modalAddDescontoVisible: boolean;
  public modalEditDescontoVisible: boolean;

  public empregado: Empregado;
  public empregadoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipoAdmissao: TipoDeAdmissao[];
  public sexo: Sexo[];
  public localidade: Localidade[];
  public uf: Uf[];
  public estadoCivil: EstadoCivil[];
  public cor: Cor[];
  public tipoContatos: TipoContato[];
  public pais: Pais[];
  public bancos: Banco[];
  public instituicoesDeEnsino: InstituicaoEnsino[];
  public valorTransporte: ValorTransporte[];
  public grauInstrucao: GrauInstrucao[];
  public tipoDeficiencia: TipoDeficiencia[];
  public empregadoId = "";
  public foto: string;
  public cargos: Cargo[];
  public departamentos: Departamento[];
  public tiposSalarios: TiposSalarios[];

  carregaPessoaEndereco = false;
  carregaPessoaContato = false;
  carregaEstagio = false;
  carregarItinerario = false;
  carregarEmpregadoorgaoclasse = false;
  carregarLotacao = false;
  carregarEmpregadoDependente = false;

  public buttonOptions: any = {
    text: "Gravar",
    type: "success",
    useSubmitBehavior: true
  }

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  public sub: Subscription;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    vcr: ViewContainerRef,
    public empregadoComponent: EmpregadoComponent) {

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empregado = new Empregado();
    this.modalAddContaCorrenteVisible = false;
    this.modalAddAdmissaoVisible = false;
    this.modalEditAdmissaoVisible = false;
    this.modalAddBeneficiosVisible = false;
    this.modalEditBeneficiosVisible = false;
    this.modalAddDescontoVisible = false;
    this.modalEditDescontoVisible = false;

    this.empregado.pessoa = new Pessoa();
    this.swal = new SweetAlertAdviceService();

  }

  paisSelect(e) {
    console.log("Entrou no onchange: " + e);

  }
  onValueChanged(e) {
    //let previousValue = e.previousValue;
    //let newValue = e.value;

  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(
      params => {
        this.empregadoId = params['id'];
        this.obterEmpregado(this.empregadoId);
      });

    this.empregadoService.obterTodosTipoAdmissao()
      .subscribe(tipoAdmissao => {
        this.tipoAdmissao = tipoAdmissao;
       // console.log(this.tipoAdmissao);
      },
        error => this.errors);

    this.empregadoService.obterTodosSexo()
      .subscribe(sexo => {
        this.sexo = sexo

      },
        () => this.errors);

    this.empregadoService.obterLocalidade()
      .subscribe(localidade => {
        this.localidade = localidade
      },
        () => this.errors);

    this.empregadoService.obterTodosUf()
      .subscribe(uf => {
        this.uf = uf
      },
        () => this.errors);

    this.empregadoService.obterTodosEstadoCivil()
      .subscribe(estadoCivil => {
        this.estadoCivil = estadoCivil
      },
        () => this.errors);

    this.empregadoService.obterTodosCor()
      .subscribe(cor => {
        this.cor = cor
      },
        () => this.errors);

    this.empregadoService.obterTodosPais()
      .subscribe(pais => {
        this.pais = pais
      },
        () => this.errors);

    this.empregadoService.obterTodosGrauInstrucao()
      .subscribe(grauInstrucao => {
        this.grauInstrucao = grauInstrucao
      },
        () => this.errors);

    this.empregadoService.obterTodosTipoDeficiencia()
      .subscribe(tipoDeficiencia => {
        this.tipoDeficiencia = tipoDeficiencia
      },
        () => this.errors);

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.empregadoForm);
    });
  }

  obterEmpregado(id: string) {
    this.empregadoService.obterEmpregado(id)
      .subscribe(
        empregado => this.preencherEmpregado(empregado),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherEmpregado(empregado: Empregado): void {

    this.empregado = empregado;
    this.foto = this.empregado.pessoa.foto == 'foto' ? '' : this.empregado.pessoa.foto;

    if (this.empregado.bancoId > 0) {

      this.empregadoService.obterTodosBanco()
        .subscribe(result => {
          this.bancos = result;

          for (let i = 0; i < this.bancos.length; i++) {

            if (this.bancos[i].id == this.empregado.bancoId) {
              this.empregado.banco = this.bancos[i];
            }

          }

        }, error => this.errors);

    }

    if (this.empregado.estagio != null) {

      this.empregadoService.ObterTodosInstituicaoEnsino()
        .subscribe(result => {
          this.instituicoesDeEnsino = result;

          for (let i = 0; i < this.empregado.estagio.length; i++) {

            for (let y = 0; y < this.instituicoesDeEnsino.length; y++) {

              if (this.empregado.estagio[i].instituicaoEnsinoId == this.instituicoesDeEnsino[y].id) {

                this.empregado.estagio[i].instituicaoEnsino = this.instituicoesDeEnsino[y];

              }

            }

          }

        });

    }

    if (this.empregado.itinerario != null) {

      this.empregadoService.obterTodosValortransporte()
        .subscribe(result => {
          this.valorTransporte = result;
          for (let i = 0; i < this.empregado.itinerario.length; i++) {
            for (let y = 0; y < this.valorTransporte.length; y++) {
              if (this.empregado.itinerario[i].valorTransporteId == this.valorTransporte[y].id) {
                this.empregado.itinerario[i].valorTransporte = this.valorTransporte[y];
              }
            }
          }
        });

    }

    if(this.uf == null){
      this.empregadoService.obterTodosUf()
      .subscribe(uf => { this.uf = uf },
        () => {});
    }

    console.log(this.uf);

    if (this.empregado.empregadoOrgaoClasse != null) {
      for (let i = 0; i < this.empregado.empregadoOrgaoClasse.length; i++) {
        if (this.uf != null) {
          for (let y = 0; y < this.uf.length; y++) {
            if (this.empregado.empregadoOrgaoClasse[i].ufId.toString() == this.uf[y].id) {
              this.empregado.empregadoOrgaoClasse[i].uf = this.uf[y];
            }
          }
        } else
          break;
      }
    }

    this.empregadoComponent.empregado = this.empregado;

    // this.reativarVisivel = this.grade.excluido === 'S';
    // this.removerVisivel = this.grade.excluido === 'N';
    // !this.removerVisivel ? this.gradeForm.disable() : this.gradeForm.enable();

    this.carregaPessoaEndereco = true;
    this.carregaPessoaContato = true;
    this.carregaEstagio = true;
    this.carregarItinerario = true;
    this.carregarEmpregadoDependente = true;
    this.carregarEmpregadoorgaoclasse = true;
    this.carregarLotacao = true;
  }

  editarPessoa() {

    this.empregado.empresaId = 221;
    this.empregado.grupoEmpresaId = 141;
    this.empregado.numeroRegistro = "00001";
    this.empregado.recebeBeneficioPrevidencia = "N";
    this.empregado.pessoa.foto = this.foto;

    if (this.empregado.pessoa.pessoaContato != null) {
      for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {
        this.empregado.pessoa.pessoaContato[i].tipoContato = null;
      }
    }

    this.empregado.estagio = null;
    this.empregado.banco = null;
    this.empregado.itinerario = null;
    this.empregado.empregadoDependente = null;

    this.empregadoService.atualizarEmpregado(this.empregado)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Empregado atualizado com Sucesso!');
            this.router.navigate(['colaborador/lista']);
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
    this.router.navigate(['colaborador/lista']);
  }

  ChangeListener($event): void {

    var files = $event.target.files;
    var file = files[0];

    if (files && file) {

      var reader = new FileReader();

      reader.onload = this.convert.bind(this);

      reader.readAsBinaryString(file);
    }

  }

  convert(event) {

    var binaryString = event.target.result;
    this.foto = 'data:image/jpg;base64,' + btoa(binaryString);
  }

  public showModal(modal: string): void {

    if (modal == 'modalAddContaCorrente') {
      this.modalAddContaCorrenteVisible = true;
    }
    else if (modal == 'modalAddAdmissao') {
      this.modalAddAdmissaoVisible = true;
    }
    else if (modal == 'modalEditAdmissao') {
      this.modalEditAdmissaoVisible = true;
    }
    else if (modal == 'modalAddBeneficios') {
      this.modalAddBeneficiosVisible = true;
    }
    else if (modal == 'modalEditBeneficios') {
      this.modalEditBeneficiosVisible = true;
    }
    else if(modal == 'modalEditDesconto'){
      this.modalEditDescontoVisible = true;
    }
    else if(modal == 'modalAddDesconto'){
      this.modalAddDescontoVisible = true;
    }


  }

  public hideModal(): void {
    this.modalAddContaCorrenteVisible = false;
    this.modalAddAdmissaoVisible = false;
    this.modalEditAdmissaoVisible = false;
    this.modalAddBeneficiosVisible = false;
    this.modalEditBeneficiosVisible = false;
  }

  public inativarContaCorrente() {

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerContaCorrente();
      }
    });


  }

  removerContaCorrente() {

    this.empregado = this.empregadoComponent.empregado;

    this.empregado.bancoId = null;
    this.empregado.agenciaDigito = null;
    this.empregado.agenciaNumero = null;
    this.empregado.contaCorrenteDigito = null;
    this.empregado.contaCorrenteNumero = null;

    if (this.empregado.pessoa.pessoaContato != null) {
      for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {
        this.empregado.pessoa.pessoaContato[i].tipoContato = null;
      }
    }

    this.empregadoService.atualizarEmpregado(this.empregado)
      .subscribe(
        result => {
          if (result) { }
          else {
            this.swal.showSwalErro('Ocorreu um erro ao gravar!');
          }
        },
        error => {
          console.error(error);
        });

    if (this.empregado.pessoa.pessoaContato != null) {

      this.empregadoService.obterTodosTipoContato()
        .subscribe(tipoContatos => {
          this.tipoContatos = tipoContatos;

          for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {

            for (let y = 0; y < this.tipoContatos.length; y++) {

              if (this.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id) {

                this.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
              }

            }
          }
        },
          error => this.errors);
    }

  }

  inativarAdmissao() {

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerAdmissao();
      }
    });

  }

  removerAdmissao() {

    this.empregado = this.empregadoComponent.empregado;

    this.empregado.dataAdmissao = null;
    this.empregado.dataExameMedico = null;
    this.empregado.recebeSalarioHabitacao = null;
    this.empregado.recebeSeguroDesemprego = null;
    this.empregado.recebeAdiantamento = null;
    this.empregado.percentual = null;

    if (this.empregado.pessoa.pessoaContato != null) {
      for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {
        this.empregado.pessoa.pessoaContato[i].tipoContato = null;
      }
    }
    

    this.empregadoService.atualizarEmpregado(this.empregado)
      .subscribe(
        result => {
          if (result) { }
          else {
            this.swal.showSwalErro('Ocorreu um erro ao gravar!');
          }
        },
        error => {
          console.error(error);
        });

    if (this.empregado.pessoa.pessoaContato != null) {

      this.empregadoService.obterTodosTipoContato()
        .subscribe(tipoContatos => {
          this.tipoContatos = tipoContatos;

          for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {

            for (let y = 0; y < this.tipoContatos.length; y++) {

              if (this.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id) {

                this.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
              }

            }
          }
        },
          error => this.errors);
    }

  }

  inativarBeneficios() {

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerBeneficios();
      }
    });

  }

  inativarDesconto(){

    const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerDesconto();
        }
    });
    
  }
  removerDesconto(){

    this.empregado = this.empregadoComponent.empregado;

    this.empregadoComponent.empregado.sindicalizado = null;
    this.empregadoComponent.empregado.descontaMensalidadeSindical = null;
    this.empregadoComponent.empregado.pagouContribuicaoSindical = null;

    if (this.empregado.pessoa.pessoaContato != null) {
      for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {
        this.empregado.pessoa.pessoaContato[i].tipoContato = null;
      }
    }

    this.empregadoService.atualizarEmpregado(this.empregado)
      .subscribe(
        result => {
          if (result) { }
          else {
            this.swal.showSwalErro('Ocorreu um erro ao gravar!');
          }
        }, (error) => { console.error(error);  });

    if (this.empregado.pessoa.pessoaContato != null) {

      this.empregadoService.obterTodosTipoContato()
        .subscribe(tipoContatos => {
          this.tipoContatos = tipoContatos;

          for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {

            for (let y = 0; y < this.tipoContatos.length; y++) {

              if (this.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id) {

                this.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
              }
            }
          }
        },() => {});
    }
  }

  removerBeneficios() {

    this.empregado = this.empregadoComponent.empregado;

    this.empregado.valeTransporte = null;

    if (this.empregado.pessoa.pessoaContato != null) {
      for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {
        this.empregado.pessoa.pessoaContato[i].tipoContato = null;
      }
    }

    this.empregadoService.atualizarEmpregado(this.empregado)
      .subscribe(
        result => {
          if (result) { }
          else {
            this.swal.showSwalErro('Ocorreu um erro ao gravar!');
          }
        },
        error => {
          console.error(error);
        });

    if (this.empregado.pessoa.pessoaContato != null) {

      this.empregadoService.obterTodosTipoContato()
        .subscribe(tipoContatos => {
          this.tipoContatos = tipoContatos;

          for (let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++) {

            for (let y = 0; y < this.tipoContatos.length; y++) {

              if (this.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id) {

                this.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
              }

            }
          }
        },
          error => this.errors);
    }

  }


}

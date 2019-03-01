import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Empregado } from '../models/empregado';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpregadoService } from '../empregado.service';
import { TipoDeAdmissao } from '../../tipodeadmissao/models/tipodeadmissao';
import { Sexo, Localidade, Uf, EstadoCivil, Cor, Pais, Pessoa } from '../../../cadastros/pessoa/models/pessoa';
import { GrauInstrucao } from '../../grauinstrucao/models/grauinstrucao';
import { TipoDeficiencia } from '../../tipodeficiencia/models/tipodeficiencia';
import { EmpregadoComponent } from '../empregado.component';
import { UtilService } from '../../../services/util.service';
import { Nacionalidade } from '../../../cadastros/nacionalidade/models/nacionalidade';

@Component({
  selector: 'app-adicionar-empregado',
  templateUrl: './adicionar-empregado.component.html',
  styleUrls: ['adicionar-empregado.component.css']
})
export class AdicionarEmpregadoComponent implements OnInit {
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
  public pais: Pais[];
  public grauInstrucao: GrauInstrucao[];
  public tipoDeficiencia: TipoDeficiencia[];
  public nacionalidade: Nacionalidade[];

  public foto: string;

  public employee = {};
  public positions = [];
  public states = [];
  public buttonOptions: any = {
    text: "Gravar",
    type: "success",
    useSubmitBehavior: true
  }

  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    vcr: ViewContainerRef,
    private utilService: UtilService,
    public empregadoComponent: EmpregadoComponent) {

    this.empregado = new Empregado();
    this.empregado.pessoa = new Pessoa();
    this.empregadoComponent.empregado.pessoa.endereco = new Array();
    this.empregadoComponent.empregado.pessoa.pessoaContato = new Array();
    this.modalAddContaCorrenteVisible = false;
    this.modalAddAdmissaoVisible = false;
    this.modalEditAdmissaoVisible = false;
    this.modalAddBeneficiosVisible = false;
    this.modalEditBeneficiosVisible = false;
    this.modalAddDescontoVisible = false;
    this.modalEditDescontoVisible = false;

    this.swal = new SweetAlertAdviceService();

    this.paisChanged = this.paisChanged.bind(this);
    this.ufChanged = this.ufChanged.bind(this);
    this.deficienteChanged = this.deficienteChanged.bind(this);
  }



  paisChanged(e) { 
    if(e.value != 1){
      this.empregado.pessoa.ufNascimentoId = null;
      this.empregado.pessoa.localidadeId = null;
      
    }
  }

  ufChanged(e) { 
    this.empregadoService.obterLocalidadePorUf(e.value)
      .subscribe(localidade => {
        this.localidade = localidade
      },
        () => this.errors);
  }

  deficienteChanged(e) { 
    if(e.value == 'N'){
      this.empregado.pessoa.tipoDeficienciaId = null;
      this.empregado.pessoa.reabilitado = null;
      this.empregado.cotaDeficiencia = null
      
    }
  }

  ngOnInit() {
    
    this.empregadoComponent.empregado = this.empregado;

    this.foto = '';

    this.empregadoService.obterTodosTipoAdmissao()
      .subscribe(tipoAdmissao => {
        this.tipoAdmissao = tipoAdmissao;
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

        this.empregadoService.obterTodosNacionalidade()
      .subscribe(nacionalidade => {
        this.nacionalidade = nacionalidade
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

  adicionarPessoa() {
    
    this.empregado.empresaId = 221;
    this.empregado.grupoEmpresaId = 141;
    this.empregado.numeroRegistro = "00001";
    this.empregado.recebeBeneficioPrevidencia = "N";
    this.empregado.pessoa.foto = this.foto;
    this.empregado.bancoId = this.empregadoComponent.empregado.bancoId;
    this.empregado.agenciaNumero = this.empregadoComponent.empregado.agenciaNumero;
    this.empregado.agenciaDigito = this.empregadoComponent.empregado.agenciaDigito;
    this.empregado.contaCorrenteNumero = this.empregadoComponent.empregado.contaCorrenteNumero;
    this.empregado.contaCorrenteDigito = this.empregadoComponent.empregado.contaCorrenteDigito;

    this.empregado.pessoa.endereco = this.empregadoComponent.empregado.pessoa.endereco;
    this.empregado.pessoa.pessoaContato = this.empregadoComponent.empregado.pessoa.pessoaContato;
    this.empregado.estagio = this.empregadoComponent.empregado.estagio;
    this.empregado.itinerario = this.empregadoComponent.empregado.itinerario;
    this.empregado.empregadoDependente = this.empregadoComponent.empregado.empregadoDependente;
    this.empregado.empregadoOrgaoClasse = this.empregadoComponent.empregado.empregadoOrgaoClasse;
    this.empregado.empregadoLotacao = this.empregadoComponent.empregado.empregadoLotacao;
    
    if(this.empregado.pessoa.pessoaContato != null){
      for(let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++){
        this.empregado.pessoa.pessoaContato[i].tipoContato = null;
      }
    }

    if(this.empregado.estagio != null){
      for(let i = 0; i < this.empregado.estagio.length; i++){
        this.empregado.estagio[i].agenteIntegrador = null;
        this.empregado.estagio[i].coordenadorDeEstagio = null;
        this.empregado.estagio[i].instituicaoEnsino = null;
        this.empregado.estagio[i].empregado = null;
      }
    }

    if(this.empregado.itinerario != null){
      for(let i = 0; i < this.empregado.itinerario.length; i++){
        
        this.empregado.itinerario[i].valorTransporte = null;
      }
    }

    if(this.empregado.empregadoDependente != null){
      
        for(let i = 0; i < this.empregado.empregadoDependente.length; i++){

          this.empregado.empregadoDependente[i].parentesco = null;

        }
    }
	
	if(this.empregado.empregadoOrgaoClasse != null){
      for(let i = 0; i < this.empregado.empregadoOrgaoClasse.length; i++){
        
        this.empregado.empregadoOrgaoClasse[i].uf = null;
      }
    }

    if(this.empregado.empregadoLotacao != null){
      
        for(let i = 0; i < this.empregado.empregadoLotacao.length; i++){

          this.empregado.empregadoLotacao[i].cargo = null;
          this.empregado.empregadoLotacao[i].departamento = null;
          this.empregado.empregadoLotacao[i].tiposSalarios = null;

        }
    }

    this.empregadoService.adicionarEmpregado(this.empregado)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Empregado adicionado com Sucesso!');
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

  ChangeListener($event): void{

    var files = $event.target.files;
    var file = files[0];
    
    if(files && file){

      var reader = new FileReader();

      reader.onload =this.convert.bind(this);

      reader.readAsBinaryString(file);
    }

  }

  convert(event){

    var binaryString = event.target.result;
            this.foto= 'data:image/jpg;base64,' + btoa(binaryString);
  }


// MODALS PAGS RIGHT ####################################################

  public showModal(modal: string): void {
    
    if (modal == 'modalAddContaCorrente') {
      this.modalAddContaCorrenteVisible = true;
    }
    else if(modal == 'modalAddAdmissao'){
      this.modalAddAdmissaoVisible = true;
    }
    else if(modal == 'modalEditAdmissao'){
      this.modalEditAdmissaoVisible = true;
    }
    else if(modal == 'modalAddBeneficios'){
      this.modalAddBeneficiosVisible = true;
    }
    else if(modal == 'modalEditBeneficios'){
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

  inativarContaCorrente(){

    const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerContaCorrente();
        }
    });
    
  }

  removerContaCorrente(){

    this.empregadoComponent.empregado.bancoId = null;
    this.empregadoComponent.empregado.agenciaDigito = null;
    this.empregadoComponent.empregado.agenciaNumero = null;
    this.empregadoComponent.empregado.contaCorrenteDigito = null;
    this.empregadoComponent.empregado.contaCorrenteNumero = null;
    this.empregadoComponent.empregado.banco = null;

  }

  inativarAdmissao(){

    const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerAdmissao();
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

  removerAdmissao(){

    this.empregadoComponent.empregado.dataAdmissao = null;
    this.empregadoComponent.empregado.dataExameMedico = null;
    this.empregadoComponent.empregado.recebeSalarioHabitacao = null;
    this.empregadoComponent.empregado.recebeSeguroDesemprego = null;
    this.empregadoComponent.empregado.recebeAdiantamento = null;
    this.empregadoComponent.empregado.percentual = null;

  }

  removerDesconto(){
    this.empregadoComponent.empregado.sindicalizado = null;
    this.empregadoComponent.empregado.descontaMensalidadeSindical = null;
    this.empregadoComponent.empregado.pagouContribuicaoSindical = null;
  }

  inativarBeneficios(){

    const self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerBeneficios();
        }
    });
    
  }

  removerBeneficios(){

    this.empregadoComponent.empregado.valeTransporte = null;

  }

}

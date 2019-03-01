import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { CentroResultado, TituloCentro } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
//import { ToastsManager } from 'ng2-toastr';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-lista-titulocentroresultado',
  templateUrl: './lista-titulocentroresultado.component.html',
  styleUrls: []
})
export class ListaTitulocentroresultadoComponent implements OnInit {

  @Input() permitirEditar: boolean;


  public tituloId = 0;

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  showDialog = false;

  public tituloCentro: TituloCentro;
  public tituloCentros: TituloCentro[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public tituloService: TituloService,
    private router: Router,
    private route: ActivatedRoute,
   // private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private tituloComponent: TituloComponent) {

    //this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    //   this.data = JSON.parse(localStorage.getItem("tituloCentroCusto"))
    if (this.tituloComponent.Titulo.tituloCentro.length > 0)
      this.data = this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroResultado != null);
 // this.data = this.tituloComponent.Titulo.tituloCentro;

  }

  ngAfterViewInit(): void {
    //this.data = JSON.parse(localStorage.getItem("tituloCentroCusto"))
    //this.data = this.tituloComponent.Titulo.tituloCentro;
  }

  atualizaStorage() {
    // this.data = JSON.parse(localStorage.getItem("tituloCentroCusto"));
 //   if (this.tituloComponent.Titulo.tituloCentro.length > 0)
      this.data = this.tituloComponent.Titulo.tituloCentro;
  }

  editarCentroResultado(tituloCentro) {
    // localStorage.setItem("tituloCentroCustoEdit", JSON.stringify(tituloCentro));
    this.tituloComponent.TituloCentro = tituloCentro;

    this.showModal('modalEditar');
  }

  cadastrarCentroResultado() {
    this.router.navigate(['titulo/adicionarCentroResultado']);
  }

  public showModal(modal: string): void {

    if (modal == 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    }
    else if (modal == 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }

  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public centroResultadoGravado(msg) {

    //this.toastr.success(msg, 'Sucesso', '');
  }

  public centroresultadoErro(msg) {

    //this.toastr.error(msg, 'Falha', '');
  }

  inativarCentroResultado(tituloCentro) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTituloCentro(tituloCentro);
      }
      else {
      }
    });
  }

  removerTituloCentro(tituloCentro) {
    if (this.tituloId > 0) {
      this.tituloService.excluirTituloCentro(tituloCentro.id.toString())
        .subscribe(
        result => {
          this.tituloCentros = this.tituloComponent.Titulo.tituloCentro;


          for (var i = 0; i < this.tituloCentros.length; i++) {
            if (tituloCentro.id == this.tituloCentros[i].id) {
              this.tituloCentros.splice(i, 1);
            }
          }
          this.data = this.tituloCentros;
          this.tituloComponent.Titulo.tituloCentro = this.tituloCentros;
          this.atualizaStorage();

          this.tituloService.gerarApropriacaoCentroAngular(this.tituloComponent.titulo)
            .subscribe(
            result => {

              for (var i = 0; i < this.tituloComponent.titulo.parcela.length; i++) {
                this.tituloComponent.titulo.parcela[i].apropriacaoCentro = result;

              }
              this.centroResultadoGravado('Centro Resultado, removido com sucesso!')

            }
            )
          // localStorage.setItem("tituloCentroCusto", JSON.stringify(this.tituloCentros));

        },
        error => {
          this.errors;
        })
    }
    else {
      this.tituloCentros = this.tituloComponent.Titulo.tituloCentro;

      for (var i = 0; i < this.tituloCentros.length; i++) {
        if (tituloCentro.id == this.tituloCentros[i].id) {
          this.tituloCentros.splice(i, 1);
        }
      }

      this.data = this.tituloCentros;
      this.tituloComponent.Titulo.tituloCentro = this.tituloCentros;
      this.atualizaStorage();


      //  localStorage.setItem("tituloCentroCusto", JSON.stringify(this.tituloCentros));
      this.centroResultadoGravado('Centro Resultado, removido com sucesso!')
    }

  }

}

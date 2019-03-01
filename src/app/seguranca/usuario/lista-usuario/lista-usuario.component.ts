import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: []
})
export class ListaUsuarioComponent implements OnInit {
  public usuarios: Usuario[];
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  constructor(public usuarioService: UsuarioService, private toastr: ToastsManager,
    vcr: ViewContainerRef, private router: Router, private report: ReportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.usuarioService.obterTodosUsuario()
      .subscribe(usuarios => {
        this.usuarios = usuarios,
        this.data = usuarios,
        console.log(this.data)
      },
        () => this.errors);
  }

  editarUsuario(id) {
    this.router.navigate(['usuario/editar/' + id]);
  }

  cadastrarUsuario() {
    this.router.navigate(['usuario/adicionar']);
  }

  gerarExcel(model, id?) {
    if (!this.report.gerarExcel(model, "Usuario", id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Usuario");
  }

}

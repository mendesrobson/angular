import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Usuario } from '../../seguranca/usuario/models/usuario';
import { UsuarioService } from '../../seguranca/usuario/usuario.service';
import { AuthService } from '../../authentication/login/services/auth.service';

@Component({
    selector: 'ap-sidebar',
    templateUrl: './sidebar.component.html'

})
export class SidebarComponent implements OnInit, AfterViewInit {
    //this is for the open close
    isActive: boolean = true;
    showMenu: string = '';
    showSubMenu: string = '';

    primeiroNome: any;

    constructor(public authService: AuthService) { }

    ngOnInit() {
        this.primeiroNome = localStorage.getItem("primeiroNome");
    }

    AdicionarExpandirClass(element: any[]) {
        element.forEach(x => {
            if (x === this.showMenu) {
                this.showMenu = '0';
            } else {
                this.showMenu = x;
            }
        });
    }
    AdicionarClassAtiva(element: any[]) {
        element.forEach(x => {
            if (x === this.showSubMenu) {
                this.showSubMenu = '0';
            } else {
                this.showSubMenu = x;
            }
        });
    }
    eventCalled() {
        this.isActive = !this.isActive;

    }
    // End open close
    ngAfterViewInit() {
        $(function () {

            $(".sidebartoggler").on('click', function () {
                if ($("body").hasClass("mini-sidebar")) {
                    $("body").trigger("resize");
                    $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
                    $("body").removeClass("mini-sidebar");
                    $('.navbar-brand span').show();
                    //$(".sidebartoggler i").addClass("ti-menu");
                }
                else {
                    $("body").trigger("resize");
                    $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
                    $("body").addClass("mini-sidebar");
                    $('.navbar-brand span').hide();
                    //$(".sidebartoggler i").removeClass("ti-menu");
                }
            });

        });
    }
}

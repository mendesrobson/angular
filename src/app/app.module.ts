import * as $ from 'jquery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { RightSidebarComponent } from './shared/right-sidebar/rightsidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { AuthGuard } from './guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AplicationErrorHandle } from './app.error-handle';
import { UtilService } from './services/util.service';
import { MaskService } from './services/mask.service';
import { ToastModule } from '../../node_modules/ng2-toastr/ng2-toastr';
import {APP_BASE_HREF} from '@angular/common';
import { ReportService } from './utils/report.service';
import { AuthService } from './authentication/login/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    RightSidebarComponent,
    SIDEBAR_TOGGLE_DIRECTIVES
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastModule.forRoot(),
  ],
  providers: [
    AuthService, AuthGuard, UtilService, MaskService,ReportService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: ErrorHandler, useClass: AplicationErrorHandle }],
    bootstrap: [AppComponent]
})
export class AppModule { }

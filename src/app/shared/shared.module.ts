import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPipe } from './pipes/status.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { ModalComponent } from './components/modal/modal.component';
import { InputComponent } from './components/input/input.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterOutlet } from "@angular/router";


@NgModule({
  declarations: [
    StatusPipe,
    HighlightDirective,
    SidebarComponent,
    NavbarComponent,
    CardComponent,
    ButtonComponent,
    ModalComponent,
    InputComponent,
    TaskCardComponent,
    StatsCardComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet
],
  exports: [
    InputComponent,
    TaskCardComponent,
    StatsCardComponent,
    CardComponent,
    ButtonComponent,
    NavbarComponent,
    SidebarComponent,
    ModalComponent,
    LayoutComponent
  ]
})
export class SharedModule { }

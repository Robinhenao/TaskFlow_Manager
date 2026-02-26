import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPipe } from './pipes/status.pipe';
import { HighlightDirective } from './directives/highlight.directive';



@NgModule({
  declarations: [
    StatusPipe,
    HighlightDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

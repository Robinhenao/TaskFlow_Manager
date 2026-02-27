import { ChangeDetectionStrategy, Component, Input , } from '@angular/core';
import { ControlContainer,FormGroupDirective} from '@angular/forms';
@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class InputComponent {
  @Input() label = '';
  @Input() controlName!: string;
  @Input() type = 'text';

  constructor(public controlContainer: ControlContainer) { }
}

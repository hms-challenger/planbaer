import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dropdownstatus-component',
  imports: [FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dropdownstatus-component.html',
  styleUrl: './dropdownstatus-component.css',
})
export class DropdownstatusComponent {
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
}

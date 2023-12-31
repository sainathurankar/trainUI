import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  frominputValue = '';
  toinputValue = '';
  dateOfTravel = '';
  frominputObject: any;
  toinputObject: any;

  fromsuggestions: any[] = [];
  tosuggestions: any[] = [];

  constructor(private autocompleteService: AutocompleteService, private router: Router) { }


  onInput(key: string): void {
    const input = key === 'from' ? this.frominputValue : this.toinputValue;
    if(input.length > 0) {
      // this.suggestions = this.autocompleteService.getSuggestions()
      // .filter(suggestion => suggestion.toLowerCase().includes(this.inputValue.toLowerCase()));
      this.autocompleteService.getSuggestions(input.trim()).subscribe((data) => {
        if (key === 'from') {
          this.fromsuggestions = data.results;
        } else {
          this.tosuggestions = data.results;
        }
      })
    } else {
      this.fromsuggestions = [];
      this.tosuggestions = []
    }
  }

  onSelectSuggestion(suggestion: any, key: string): void {
    if (key === 'from') {
      this.frominputValue = suggestion.stationName;
      this.frominputObject = suggestion;
    } else {
      this.toinputValue = suggestion.stationName;
      this.toinputObject = suggestion;
    }
    this.fromsuggestions = [];  // Clear suggestions
    this.tosuggestions = [];
  }

  onDateChange(date: string) {
    this.dateOfTravel = date.split('-').join('');
  }

  onClickSearch() {
    this.router.navigate(['results'], {queryParams: {
      src: this.frominputObject.stationCode,
      dst: this.toinputObject.stationCode,
      doj: this.dateOfTravel
    }});
  }
}

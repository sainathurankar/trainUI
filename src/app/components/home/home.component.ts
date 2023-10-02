import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  frominputValue = '';
  toinputValue = '';
  fromsuggestions: any[] = [];
  tosuggestions: any[] = [];

  constructor(private autocompleteService: AutocompleteService) { }

  ngOnInit(): void {
  }

  onInput(key: string): void {
    const input = key === 'from' ? this.frominputValue : this.toinputValue;
    if(input.length > 0) {
      // this.suggestions = this.autocompleteService.getSuggestions()
      // .filter(suggestion => suggestion.toLowerCase().includes(this.inputValue.toLowerCase()));
      this.autocompleteService.getSuggestions(input.trim()).subscribe((data) => {
        console.log(data);
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
    } else {
      this.toinputValue = suggestion.stationName;
    }
    this.fromsuggestions = [];  // Clear suggestions
    this.tosuggestions = [];
  }

}

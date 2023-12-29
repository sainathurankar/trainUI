import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  frominputValue = '';
  toinputValue = '';
  dateOfTravel = '';
  frominputObject: any;
  toinputObject: any;

  fromsuggestions: any[] = [];
  tosuggestions: any[] = [];
  minDate?: string;

  constructor(private autocompleteService: AutocompleteService, private router: Router) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    this.dateOfTravel = `${year}-${month}-${day}`;
    this.minDate = this.dateOfTravel
  }


  onInput(key: string): void {
    const input = key === 'from' ? this.frominputValue : this.toinputValue;
    if(input.length > 1) {
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

  onClickSearch() {
    this.router.navigate(['results'], {queryParams: {
      src: this.frominputObject.stationCode,
      dst: this.toinputObject.stationCode,
      doj: this.getFormattedDate(this.dateOfTravel)
    }});
  }

  getFormattedDate(date: string) {
    return date.split('-').join('');
  }

}

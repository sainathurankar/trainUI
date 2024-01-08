import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  frominputValue = '';
  toinputValue = '';
  dateOfTravel = '';
  frominputObject: any;
  toinputObject: any;

  fromsuggestions: any[] = [];
  tosuggestions: any[] = [];
  minDate?: string;

  private destroy$ = new Subject<void>();

  objectSaved?: {frominputObject: any; toinputObject: any, dateOfTravel: any};
  key = 'USER_SEARCH';

  constructor(private autocompleteService: AutocompleteService, private router: Router) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    this.dateOfTravel = `${year}-${month}-${day}`;
    this.minDate = this.dateOfTravel
  }

  ngOnInit(): void {
    this.objectSaved = this.getStoredObject();
    if (this.objectSaved) {
      this.frominputValue = this.objectSaved.frominputObject.stationName;
      this.toinputValue = this.objectSaved.toinputObject.stationName;
      this.frominputObject = this.objectSaved.frominputObject;
      this.toinputObject = this.objectSaved.toinputObject;
      this.dateOfTravel = this.objectSaved.dateOfTravel;
    }
  }


  onInput(key: string): void {
    this.cancelAllCalls();
    const input = key === 'from' ? this.frominputValue : this.toinputValue;
    if(input.length > 1) {
      // this.suggestions = this.autocompleteService.getSuggestions()
      // .filter(suggestion => suggestion.toLowerCase().includes(this.inputValue.toLowerCase()));
      this.autocompleteService.getSuggestions(input.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
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
    this.storeObjectInLocalStorage();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['results'], {queryParams: {
      src: this.frominputObject.stationCode,
      dst: this.toinputObject.stationCode,
      doj: this.getFormattedDate(this.dateOfTravel)
    }});
  }

  getFormattedDate(date: string) {
    return date.split('-').join('');
  }

  storeObjectInLocalStorage() {
    this.objectSaved = {frominputObject: this.frominputObject, toinputObject: this.toinputObject, dateOfTravel: this.dateOfTravel};
    if (localStorage) {
      localStorage.setItem(this.key, JSON.stringify(this.objectSaved));
    }
  }

  getStoredObject() {
    if (localStorage && localStorage.getItem(this.key)) {
      const objectString = localStorage.getItem(this.key);
      return objectString ? JSON.parse(objectString) : null;
    }
    return null;
  }

  switchStations() {
    [this.frominputValue, this.toinputValue] = [this.toinputValue, this.frominputValue];
    [this.frominputObject, this.toinputObject] = [this.toinputObject, this.frominputObject];
  }

  ngOnDestroy(): void {
    this.cancelAllCalls();
  }

  cancelAllCalls() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$ = new Subject<void>();
  }
}

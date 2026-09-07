import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // The hero embeds <app-search>, which owns all search/autocomplete logic.
  // HomeComponent is now a thin presentational shell for the landing page.
}

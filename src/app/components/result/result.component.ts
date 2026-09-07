import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ResultComponent implements OnInit {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);

  src = '';
  dst = '';
  doj = '';
  searchResponse: any;
  loading = true;
  error = false;
  modifySearch = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.src = params.src;
      this.dst = params.dst;
      this.doj = params.doj;
      this.getSearchResults();
    });
  }

  getSearchResults() {
    this.loading = true;
    this.error = false;
    const searchInput: SearchInput = {
      src: this.src,
      dst: this.dst,
      doj: this.doj,
    };
    this.searchService.getSearchResults(searchInput, "false").subscribe({
      next: (data) => {
        this.searchResponse = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  retry() {
    this.getSearchResults();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  src: string = '';
  dst: string = '';
  doj: string = '';
  searchResponse: any;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('Result Page');
    this.route.queryParams.subscribe((params) => {
      this.src = params.src;
      this.dst = params.dst;
      this.doj = params.doj;
      this.getSearchResults();
    });
  }

  getSearchResults() {
    const searchInput: SearchInput = {
      src: this.src,
      dst: this.dst,
      doj: this.doj,
    };
    console.log(searchInput);
    this.searchService.getSearchResults(searchInput, "false").subscribe(data => {
      console.log(data);
      this.searchResponse = data;
    })

    // this.searchService.getSearchResults(searchInput, "true").subscribe(data => {
    //   console.log(data);
    //   this.searchResponse = data;
    // })
  }

  getQuotaCardClass(status: string): { [key: string]: boolean } {
    return {
      'border-available': status === 'Available' || status === 'CURR_AVBL',
      'border-waiting': status?.indexOf('WL') > 0,
      'border-regret': status === 'REGRET' || status === 'NOT AVAILABLE',
    };
  }

  getAvailabilityClass(status: string): { [key: string]: boolean } {
    return {
      'text-success': status === 'Available' || status === 'CURR_AVBL' || status === 'RAC',
      'text-warning': status?.indexOf('WL') > 0,
      'text-danger': status === 'REGRET' || status === 'NOT AVAILABLE',
    };
  }
}

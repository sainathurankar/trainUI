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
  loading = true;

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
      this.loading = false;
    })

    // this.searchService.getSearchResults(searchInput, "true").subscribe(data => {
    //   console.log(data);
    //   this.searchResponse = data;
    //   this.loading = false;
    // })
  }
}

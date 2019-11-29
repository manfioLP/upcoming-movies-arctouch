import { Component, OnInit, Input } from '@angular/core';
import { MovieList } from 'src/model/Movie';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  @Input() public movie: MovieList;
  constructor() { }

  ngOnInit() {
  }

}

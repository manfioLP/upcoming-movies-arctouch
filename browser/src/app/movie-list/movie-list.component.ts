import { Component, OnInit, Input } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'
import { Movie, MovieList } from '../../model/Movie';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})

export class MovieListComponent implements OnInit {

  private moviesTable: MatTableDataSource<MovieList[]>
  private columnsToDisplay: string[] = ['original_title', 'poster_path', 'genre_id', 'release_date']
  selectedMovie: MovieList
  movies: MovieList[]

  @Input() public displayMovieForm: boolean
  constructor(
    private movieService: MovieService
  ) {
  }

  getMovies() {

  }

  rowClick(movie: MovieList) {
    if (!this.selectedMovie) {
      this.selectedMovie = movie
    } else {
      this.selectedMovie = this.selectedMovie.original_title === movie.original_title ? null : movie
    }
    this.displayMovieForm = false
  }

  filterMovie(filter: string) {
    this.moviesTable.filter = filter.trim()
  }

  ngOnInit() {
    this.getMovies()
  }

}


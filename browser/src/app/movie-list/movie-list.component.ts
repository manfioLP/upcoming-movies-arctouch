import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'
import { Movie, MovieList } from '../../model/Movie';
import { MovieService } from '../movie.service';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})

export class MovieListComponent implements OnInit {

  @ViewChild(MatTable, {static: false}) moviesTable: MatTable<MovieList>;
  columnsToDisplay: string[] = ['genres', 'original_title', 'release_date', 'poster_path'];
  genresMap: GenreMap = {}
  selectedMovie: MovieList
  movieTableSource: MatTableDataSource<MovieList>;
  movies: MovieList[]
  currentPage: number
  private movieApiBaseURL = 'http://image.tmdb.org/t/p/w92';

  @Input() public displayMovieForm: boolean
  constructor(
    private movieService: MovieService
  ) {
    this.currentPage = 1
  }

  getUpcomingMovies() {
    // TODO: Implement getUpcomingMovie
    this.movieService.getUpcomingMovies(this.currentPage++).subscribe(res => {
      res.data.forEach(el => el.poster_path = `${this.movieApiBaseURL}${el.poster_path}`);
      this.movies = res.data;
      this.movieTableSource = new MatTableDataSource(this.movies);
      // this.moviesTable = new MatTableDataSource(this.movies)
      this.moviesTable.renderRows();
    })
  }

  rowClick(movie: MovieList) {
    if (!this.selectedMovie) {
      this.selectedMovie = movie
    } else {
      this.selectedMovie = this.selectedMovie.original_title === movie.original_title ? null : movie
    }
    this.displayMovieForm = false
  }

  requestNextPage() {
    this.movieService.getUpcomingMovies(this.currentPage++).subscribe(res => {
      res.data.forEach(el => el.poster_path = `${this.movieApiBaseURL}${el.poster_path}`);
      this.movies = this.movies.concat(res.data);
      this.movieTableSource.data = this.movies;
      this.moviesTable.renderRows()
    });
  }


  filterMovie(filter: string) {
    this.movieTableSource.filter = filter.trim()
  }

  ngOnInit() {
    this.getUpcomingMovies()
  }

}

interface GenreMap {
  [key: number]: string
}


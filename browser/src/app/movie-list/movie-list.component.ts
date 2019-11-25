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
  // private columnsToDisplay: string[] = ['original_title', 'poster_path', 'genre_id', 'release_date']
  private columnsToDisplay: string[] = ['genres', 'original_title']
  genresMap: GenreMap = {}
  selectedMovie: MovieList
  movies: MovieList[]
  currentPage: number

  @Input() public displayMovieForm: boolean
  constructor(
    private movieService: MovieService
  ) {
    this.currentPage = 1
  }

  getUpcomingMovies() {
    // TODO: Implement getUpcomingMovie
    this.movieService.getUpcomingMovies(this.currentPage++).subscribe(res => {
      const movies = res.data
      this.moviesTable = new MatTableDataSource(movies)
    })

    // TODO: set list of movies requested from api
    // this.moviesTable = new MatTableDataSource()
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

  getGenresMap() {
    let genres = []
    this.movieService.getGenres().subscribe(res => {
      genres = res.data.genres
      genres.map(el => {
        this.genresMap[`${el.id}`] = el.name
      })
    })
  }

  ngOnInit() {
    // this.getGenresMap()
    this.getUpcomingMovies()
  }

  getMovieGenres(genre_ids: [number]) {
    let genres: string = ''
    for (let genreId of genre_ids)
      genres+= this.genresMap[`${genreId}`]
    return genres
  }

}

interface GenreMap {
  [key: number]: string
}


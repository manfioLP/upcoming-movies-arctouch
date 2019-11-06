export interface Movie {
    original_title: string
    poster_path: string
    genres: Genre
    overview: string
    release_date: string 
}

export interface MovieList {
    original_title: string
    poster_path?: string
    backdrop_path?: string
    id: number
    genre_ids: number[]
    release_date: string
    genres: string[]
}

export interface Genre {
    id: number
    name: string
}


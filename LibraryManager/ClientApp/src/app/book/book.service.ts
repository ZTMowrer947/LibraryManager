// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Book } from './book';
import { BookPage } from './book-page';

// Mock book data
const books = [
    {
        id: 1,
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        genre: 'Non-Fiction',
        year: 1988,
    },
    {
        id: 2,
        title: 'The Universe in a Nutshell',
        author: 'Stephen Hawking',
        genre: 'Non-Fiction',
        year: 2001,
    },
    {
        id: 3,
        title: 'The Martian',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        year: 2014,
    },
    {
        id: 4,
        title: 'Ready Player One',
        author: 'Ernest Cline',
        genre: 'Science Fiction',
        year: 2011,
    },
    {
        id: 5,
        title: 'Armada',
        author: 'Ernest Cline',
        genre: 'Science Fiction',
        year: 2015,
    },
    {
        id: 6,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Classic',
        year: 1813,
    },
    {
        id: 7,
        title: 'Emma',
        author: 'Jane Austen',
        genre: 'Classic',
        year: 1815,
    },
    {
        id: 8,
        title: "Harry Potter and the Philosopher's Stone",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1997,
    },
    {
        id: 9,
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1998,
    },
    {
        id: 10,
        title: 'Harry Potter and the Prisoner of Azkaban',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1999,
    },
    {
        id: 11,
        title: 'Harry Potter and the Goblet of Fire',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2000,
    },
    {
        id: 12,
        title: 'Harry Potter and the Order of the Phoenix',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2003,
    },
    {
        id: 13,
        title: 'Harry Potter and the Half-Blood Prince',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2005,
    },
    {
        id: 14,
        title: 'Harry Potter and the Deathly Hallows',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2007,
    },
];

// Service
@Injectable({
    providedIn: 'root',
})
export class BookService {
    public constructor(private httpClient: HttpClient) {}

    private get apiUrl(): string {
        return `${location.protocol}//${location.host}`;
    }

    public getPage(page: number): Observable<BookPage> {
        // Retrieve page of book data from API
        return this.httpClient
            .get(`${this.apiUrl}/api/Books?page=${page}`)
            .pipe(map((body) => plainToClass(BookPage, body)));
    }

    public get(id: number): Observable<Book> {
        // Attempt to retrieve book from API
        return this.httpClient.get(`${this.apiUrl}/api/Books/${id}`).pipe(
            map((body) => plainToClass(Book, body)),
            catchError((error: HttpErrorResponse) => {
                // If error status is 404,
                if (error.status === 404) {
                    // Return undefined wrapped inside observable
                    return of(undefined);
                }

                // Otherwise, rethrow error
                return throwError(error);
            })
        );
    }
}

// Imports
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Book } from 'src/models/book';

// Mock data
const MOCK_BOOKS: Book[] = [
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
        title: 'Armada',
        author: 'Ernest Cline',
        genre: 'Science Fiction',
        year: 2015,
    },
    {
        id: 4,
        title: 'The Martian',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        year: 2014,
    },
    {
        id: 5,
        title: 'Ready Player One',
        author: 'Ernest Cline',
        genre: 'Science Fiction',
        year: 2011,
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
        title: 'Frankenstein',
        author: 'Mary Shelley',
        genre: 'Horror',
        year: 1818,
    },
    {
        id: 9,
        title: "Harry Potter and the Philosopher's Stone",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1997,
    },
    {
        id: 10,
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1998,
    },
    {
        id: 11,
        title: 'Harry Potter and the Prisoner of Azkaban',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 1999,
    },
    {
        id: 12,
        title: 'Harry Potter and the Goblet of Fire',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2000,
    },
    {
        id: 13,
        title: 'Harry Potter and the Order of the Phoenix',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2003,
    },
    {
        id: 14,
        title: 'Harry Potter and the Half-Blood Prince',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        year: 2005,
    },
    {
        id: 15,
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
    constructor() {}

    getList(): Observable<Book[]> {
        return of(MOCK_BOOKS);
    }

    getById(id: number): Observable<Book | undefined> {
        return of(MOCK_BOOKS.find(book => book.id === id));
    }
}

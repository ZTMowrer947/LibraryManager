// Imports
import BookEntity from '../entities/BookEntity';
import Book from '../models/Book';

import type { Seed } from './Seed';

// Seed
const bookSeed: Seed = {
    name: 'Book',
    async run(connection) {
        // Get book repository
        const repository = connection.getRepository<Book>(BookEntity);

        // Define book data to seed database with
        const bookData: Partial<Book>[] = [
            {
                title: 'A Brief History of Time',
                author: 'Stephen Hawking',
                genre: 'Non-Fiction',
                year: 1988,
            },
            {
                title: 'The Universe in a Nutshell',
                author: 'Stephen Hawking',
                genre: 'Non-Fiction',
                year: 2001,
            },
            {
                title: 'The Martian',
                author: 'Andy Weir',
                genre: 'Science Fiction',
                year: 2014,
            },
            {
                title: 'Ready Player One',
                author: 'Ernest Cline',
                genre: 'Science Fiction',
                year: 2011,
            },
            {
                title: 'Armada',
                author: 'Ernest Cline',
                genre: 'Science Fiction',
                year: 2015,
            },
            {
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                genre: 'Classic',
                year: 1813,
            },
            {
                title: 'Emma',
                author: 'Jane Austen',
                genre: 'Classic',
                year: 1815,
            },
            {
                title: "Harry Potter and the Philosopher's Stone",
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 1997,
            },
            {
                title: 'Harry Potter and the Chamber of Secrets',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 1998,
            },
            {
                title: 'Harry Potter and the Prisoner of Azkaban',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 1999,
            },
            {
                title: 'Harry Potter and the Goblet of Fire',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 2000,
            },
            {
                title: 'Harry Potter and the Order of the Phoenix',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 2003,
            },
            {
                title: 'Harry Potter and the Half-Blood Prince',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 2005,
            },
            {
                title: 'Harry Potter and the Deathly Hallows',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                year: 2007,
            },
        ];

        // Save book data
        await repository.save(bookData);
    },
};

// Exports
export default bookSeed;

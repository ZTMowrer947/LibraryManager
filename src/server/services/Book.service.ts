// Imports
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import Book from "../database/entities/Book.entity";
import BookDTO from "../models/BookDTO";

// Service
@Service()
export default class BookService {
    private repository!: Repository<Book>;

    public constructor(@InjectRepository(Book) repository: Repository<Book>) {
        this.repository = repository;
    }

    public async getList(): Promise<Book[]> {
        return this.repository.find();
    }

    public async getById(id: string): Promise<Book | undefined> {
        return this.repository
            .createQueryBuilder("book") // Create query
            .where("book.id = :id", { id }) // Get book with matching id
            .getOne(); // Return only one entry
    }

    public async create(bookData: BookDTO): Promise<string> {
        // Create Book instance
        const book = new Book();

        // Fill out data
        book.title = bookData.title;
        book.author = bookData.author;
        book.genre = bookData.genre ?? null;
        book.year = bookData.year ? Number.parseInt(bookData.year) : null;

        // Save book to database
        await this.repository.save(book);

        // Return id of new book
        return book.id;
    }

    public async update(book: Book, bookData: BookDTO): Promise<void> {
        // Fill out new data
        book.title = bookData.title;
        book.author = bookData.author;
        book.genre = bookData.genre ?? null;
        book.year = bookData.year ? Number.parseInt(bookData.year) : null;

        // Save updated book to database
        await this.repository.save(book);
    }

    public async delete(book: Book): Promise<void> {
        // Delete book
        await this.repository.remove(book);
    }
}

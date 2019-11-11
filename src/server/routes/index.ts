// Imports
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ParameterizedContext } from "koa";
import Router from "koa-router";
import BookListState from "../models/BookListState";
import BookDTO from "../models/BookDTO";
import BaseState from "../models/BaseState";
import ValidationErrorState from "../models/ValidationErrorState";

// Custom contexts
interface RenderContext {
    render: (view: string) => Promise<void>;
}

// Router setup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const router = new Router<any, RenderContext>();

// Routes
// GET /: Redirect link to /books
router.get("/", async ctx => {
    ctx.redirect("/books");
});

// GET /books: Book listing
router.get("/books", async (ctx: ParameterizedContext<BookListState>) => {
    // Get book listing
    const books = await ctx.state.bookService.getList();

    // Attach books to state
    ctx.state.books = books;

    // Render index page
    await ctx.render("index");
});

// GET /books/new: New Book Form
router.get("/books/new", async ctx => {
    // Render new book form
    await ctx.render("new-book");
});

// POST /books/new: Create new book from request body
router.post(
    "/books/new",
    async (ctx: ParameterizedContext<BaseState & ValidationErrorState>) => {
        // Transform request body into Book DTO
        const bookData = plainToClass(BookDTO, ctx.request.body);

        // Set genre and year to undefined if empty
        bookData.genre = bookData.genre || undefined;
        bookData.year = bookData.year || undefined;

        // Is year is string, parse it as a number
        if (typeof bookData.year === "string") {
            bookData.year = parseFloat(bookData.year);
        }

        // Validate book data
        const errors = await validate(bookData);

        // If errors were found,
        if (errors.length > 0) {
            console.log(errors);

            // Map validation errors into a simpler form
            const validationErrors = errors.reduce(
                (acc, error) =>
                    Object.assign({}, acc, {
                        [error.property]: Object.values(error.constraints),
                    }),
                {} as { [property: string]: string[] }
            );

            // Attach validation errors to state
            ctx.state.validationErrors = validationErrors;

            // Set status to 400
            ctx.status = 400;

            // Rerender new book form with validation errors
            await ctx.render("new-book");
        } else {
            // Otherwise, create book and get id of new book
            const id = await ctx.state.bookService.create(bookData);

            console.log(id);

            // TODO: Redirect to book detail page for new book
            ctx.redirect(`/books`);
        }
    }
);

// Export
export default router;

﻿using LibraryManager.Data;
using LibraryManager.Models;
using LibraryManagerTests.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Xunit;

namespace LibraryManager.Repos.Tests
{
	public class LibraryContextFixture : IDisposable
	{
		public LibraryContext Context { get; private set; }
		public IRepository<Book, ulong> Repository { get; private set; }
		public ulong TestBookId => Context.Books.AsNoTracking().Last().Id;

		public LibraryContextFixture()
		{
			// Configure context
			var options = new DbContextOptionsBuilder<LibraryContext>()
				.UseInMemoryDatabase(databaseName: "library-book-testing")
				.Options;

			// Initialize and setup context
			Context = new LibraryContext(options);
			Context.Database.EnsureCreated();

			// Seed database with test data
			Context.EnsureSeeded();

			// Initialize repository under test
			Repository = new BookRepository(Context);
		}

		public void Dispose()
		{
			// Dispose context
			Context.Dispose();
		}
	}

	public class BookRepositoryTests : IClassFixture<LibraryContextFixture>
	{
		private readonly LibraryContextFixture _fixture;

		public BookRepositoryTests(LibraryContextFixture fixture)
		{
			_fixture = fixture ?? throw new ArgumentNullException(nameof(fixture));
		}

		[Fact()]
		public void FindAll_ShouldReturnNonEmptyBookListing()
		{
			// Get listing from repository
			var books = _fixture.Repository.FindAll();

			// Assert that collection has nonzero size
			Assert.True(books.Count > 0, "FindAll method should return non-empty book listing");
		}

		[Fact()]
		public void FindById_ShouldReturnNullIfCourseIsNotFound()
		{
			// Define ID of nonexistent book
			var id = ulong.MaxValue;

			// Attempt to get book from repository
			var book = _fixture.Repository.FindById(id);

			// Assert that book is null
			Assert.Null(book);
		}

		[Fact()]
		public void Create_ShouldPersistBook()
		{
			// Generate fake book data
			var newBook = BookUtils.GetFakeBook();

			// Save book using repository
			_fixture.Repository.Create(newBook);

			// Retrieve new book using context
			var retrievedBook = _fixture.Context.Books
				.Where(book => book.Id == newBook.Id)
				.AsNoTracking()
				.SingleOrDefault();

			// Assert that retrieved book is non-null and matches created book
			Assert.NotNull(retrievedBook);
			Assert.StrictEqual(newBook, retrievedBook);
		}

		[Fact()]
		public void Update_ShouldModifyExistingBook()
		{
			// Get test ID
			var testId = _fixture.TestBookId;

			// Construct query to fetch book with ID
			var bookByIdQuery = _fixture.Context.Books
				.Where(book => book.Id == testId);

			// Retrieve non-tracked copy of book to compare against later
			var currentBook = bookByIdQuery.AsNoTracking().SingleOrDefault();

			// Retrieve tracked copy to apply update to
			var bookToUpdate = bookByIdQuery.SingleOrDefault();

			// Generate fake book update data
			var updateData = BookUtils.GetFakeBook();

			// Attach update data to book
			bookToUpdate.Title = updateData.Title;
			bookToUpdate.Author = updateData.Author;
			bookToUpdate.Genre = updateData.Genre;
			bookToUpdate.Year = updateData.Year;

			// Update book using repository
			_fixture.Repository.Update(bookToUpdate);

			// Assert that books are not equal
			Assert.NotStrictEqual(currentBook, bookToUpdate);
		}

		[Fact()]
		public void Delete_ShouldRemoveBook()
		{
			// Get test ID
			var testId = _fixture.TestBookId;

			// Retrieve book to delete with ID using context
			var bookToDelete = _fixture.Context.Books
				.Where(book => book.Id == testId)
				.SingleOrDefault();

			// Delete book using repository
			_fixture.Repository.Delete(bookToDelete);

			// Attempt to fetch book again using context
			var deletedBook = _fixture.Context.Books
				.Where(book => book.Id == testId)
				.SingleOrDefault();

			// Assert that post-delete fetch returned null
			Assert.Null(deletedBook);
		}
	}
}
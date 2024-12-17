const { nanoid } = require("nanoid");
const books = require("./books");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
          })
          .code(400);
      }

      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };

      books.push(newBook);

      return h
        .response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: { bookId: id },
        })
        .code(201);
    },
  },
  {
    method: "GET",
    path: "/books",
    handler: () => ({
      status: "success",
      data: {
        books: books.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    }),
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;

      const book = books.find((b) => b.id === bookId);

      if (!book) {
        return h
          .response({
            status: "fail",
            message: "Buku tidak ditemukan",
          })
          .code(404);
      }

      return {
        status: "success",
        data: { book },
      };
    },
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      const index = books.findIndex((b) => b.id === bookId);

      if (!name) {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
          })
          .code(400);
      }

      if (index === -1) {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
          })
          .code(404);
      }

      const updatedAt = new Date().toISOString();

      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished: pageCount === readPage,
        updatedAt,
      };

      return {
        status: "success",
        message: "Buku berhasil diperbarui",
      };
    },
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;

      const index = books.findIndex((b) => b.id === bookId);

      if (index === -1) {
        return h
          .response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
          })
          .code(404);
      }

      books.splice(index, 1);

      return {
        status: "success",
        message: "Buku berhasil dihapus",
      };
    },
  },
];

module.exports = routes;

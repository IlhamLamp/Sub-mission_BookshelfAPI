const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
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

    // Jika nama tak diisi
    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            })
            .code(400);
        return response;
    }

    // Jika baca hlm.buku lebih besar dari total hlm.buku
    if (readPage > pageCount) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,
    };

    // push to array
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // saaat buku berhasil diinput
    if (isSuccess) {
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            })
            .code(201);
        return response;
    }

    // jika mengalami generic error
    const response = h
        .response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        })
        .code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    // jika query kosong
    if (!name && !reading && !finished) {
        const response = h
            .response({
                status: 'success',
                data: {
                    books: books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
        return response;
    }

    // TAMBAHAN FITUR QUERY PARAMETER

    // NAMA
    if (name) {
        const filteredBooksName = books.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });

        const response = h
            .response({
                status: 'success',
                data: {
                    books: filteredBooksName.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
        return response;
    }

    // READING
    if (reading) {
        const filteredBooksReading = books.filter(
            (book) => Number(book.reading) === Number(reading),
        );

        const response = h
            .response({
                status: 'success',
                data: {
                    books: filteredBooksReading.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
        return response;
    }

    const filteredBooksFinished = books.filter(
        (book) => Number(book.finished) === Number(finished),
    );

    const response = h
        .response({
            status: 'success',
            data: {
                books: filteredBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        .code(200);
    return response;
}

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    // find book by id
    const book = books.filter((n) => n.id === bookId)[0];

    // Jika id ditemukan
    if (book) {
        const response = h
            .response({
                status: 'success',
                data: {
                    book,
                },
            })
            .code(200);
        return response;
    }

    // jika id tak ditemukan
    const response = h
        .response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        })
        .code(404);
    return response;
}

const editBookByIdHandler = (request, h) => {
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

    // Jika pada request bodi properti name tidak ada
    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            })
            .code(400);
        return response;
    }

    // Jika baca hlm.buku lebih besar dari total hlm.buku
    if (readPage > pageCount) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    // Cari buku berdasarkan id
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {

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
            finished,
            updatedAt,
        };

        // Jika buku berhasil diperbarui
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            })
            .code(200);
        return response;
    }

    // Jika id tidak ditemukan
    const response = h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    // cari buku berdasarkan id
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);

        // jika id ditemukan
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            })
            .code(200);
        return response;
    }

    // Jika id tidak ditemukan
    const response = h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    return response;
}


module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
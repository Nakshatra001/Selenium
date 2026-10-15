# Selenium-Testing--Node

## Node REST API

A small REST API starter built with Node.js 20+ and Express. It manages an in-memory collection of books; data resets when the server restarts.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Start the development server with `npm run dev` (or `npm start`).
4. The server listens on `http://localhost:3000`. Set `PORT` to change the port.
5. Run tests with `npm test`.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/books` | List books; optional `limit` and `offset` query parameters |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Replace a book's title and author |
| DELETE | `/api/books/:id` | Delete a book |

Create a book with JSON containing non-empty `title` and `author` fields:

```sh
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d "{\"title\":\"Dune\",\"author\":\"Frank Herbert\"}"
```

The API returns JSON. Missing resources return `404`, and invalid input returns `400`.
For example, `/api/books?limit=10&offset=20` returns up to 10 books after skipping the first 20. The response includes pagination metadata; `limit` must be a positive integer and `offset` a non-negative integer.

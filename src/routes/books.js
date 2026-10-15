import { randomUUID } from 'node:crypto';
import { Router } from 'express';

const router = Router();

// In-memory starter data; replace with a database for persistence.
const books = [
  { id: '1', title: 'The Hobbit', author: 'J. R. R. Tolkien' },
  { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' }
];

router.get('/', (req, res) => {
  const { limit: limitParam, offset: offsetParam = '0' } = req.query;
  const isNonNegativeInteger = (value) => typeof value === 'string' && /^\d+$/.test(value);

  if (limitParam !== undefined && (!isNonNegativeInteger(limitParam) || Number(limitParam) < 1)) {
    return res.status(400).json({ error: 'limit must be a positive integer.' });
  }
  if (!isNonNegativeInteger(offsetParam)) {
    return res.status(400).json({ error: 'offset must be a non-negative integer.' });
  }

  const limit = limitParam === undefined ? null : Number(limitParam);
  const offset = Number(offsetParam);
  if ((limit !== null && !Number.isSafeInteger(limit)) || !Number.isSafeInteger(offset)) {
    return res.status(400).json({ error: 'limit and offset must be safe integers.' });
  }

  const data = books.slice(offset, limit === null ? undefined : offset + limit);
  return res.json({ data, pagination: { total: books.length, limit, offset } });
});

router.get('/:id', (req, res) => {
  const book = books.find((item) => item.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found.' });
  return res.json({ data: book });
});

router.post('/', (req, res) => {
  const { title, author } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim() || typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'Both title and author are required.' });
  }

  const book = { id: randomUUID(), title: title.trim(), author: author.trim() };
  books.push(book);
  return res.status(201).json({ data: book });
});

router.put('/:id', (req, res) => {
  const book = books.find((item) => item.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found.' });

  const { title, author } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim() || typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'Both title and author are required.' });
  }

  book.title = title.trim();
  book.author = author.trim();
  return res.json({ data: book });
});

router.delete('/:id', (req, res) => {
  const index = books.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found.' });

  books.splice(index, 1);
  return res.status(204).end();
});

export default router;

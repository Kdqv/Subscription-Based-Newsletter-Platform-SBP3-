import { pool } from '../config/db.js'


export const createPost = async (req, res, next) => {
  try {
    const { title, content, is_paid_content } = req.body

    // Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const authorId = req.user.id

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' })
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, is_paid, author_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *, is_paid as is_paid_content`,
      [title, content, is_paid_content ?? false, authorId]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('createPost error:', err.message)
    // Provide a clearer error to the client while avoiding full DB stack traces
    return res
      .status(500)
      .json({ message: `Error creating post: ${err.message}` })
  }
}

export const getAllPosts = async (req, res, next) => {
  try {
    const result = await pool.query(`
    SELECT p.id, p.title, p.content, p.is_paid as is_paid_content, p.author_id, p.created_at, u.email
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `)

    const user = req.user

    const posts = result.rows.map((post) => {
      // Extraire le username depuis l'email
      return {
        ...post,
        author_username: post.email ? post.email.split('@')[0] : `Creator_${post.author_id.slice(0, 8)}`
      }
    })

    res.status(200).json(posts)
  } catch (err) {
    console.error('getAllPosts error:', err)
    return res.status(500).json({ message: `Error fetching posts: ${err.message}` })
  }
}

export const getPostById = async (req, res) => {
  const postId = req.params.id

  const result = await pool.query(`
    SELECT p.*, u.email, is_paid as is_paid_content 
    FROM posts p 
    LEFT JOIN users u ON p.author_id = u.id 
    WHERE p.id = $1
  `, [postId])

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Post not found' })
  }

  const post = result.rows[0]
  
  // Extraire le username depuis l'email
  const postWithAuthor = {
    ...post,
    author_username: post.email ? post.email.split('@')[0] : `Creator_${post.author_id.slice(0, 8)}`
  }

  res.status(200).json(postWithAuthor)
}

export const getCreatorPosts = async (req, res) => {
  try {
    const creatorId = req.user.id

    const result = await pool.query(`
      SELECT p.id, p.title, p.content, p.is_paid as is_paid_content, p.author_id, p.created_at, u.email
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.author_id = $1
      ORDER BY p.created_at DESC
    `, [creatorId])

    const posts = result.rows.map((post) => {
      // Extraire le username depuis l'email
      return {
        ...post,
        author_username: post.email ? post.email.split('@')[0] : `Creator_${post.author_id.slice(0, 8)}`
      }
    })

    res.status(200).json(posts)
  } catch (err) {
    console.error('getCreatorPosts error:', err)
    return res.status(500).json({ message: `Error fetching creator posts: ${err.message}` })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const { title, content, is_paid_content } = req.body
  const userId = req.user.id
  const userRole = req.user.role

  try {
    const checkQuery = 'SELECT author_id FROM posts WHERE id = $1'
    const checkResult = await pool.query(checkQuery, [id])

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const post = checkResult.rows[0]

    if (post.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updateQuery = `
      UPDATE posts 
      SET title = COALESCE($1, title), 
          content = COALESCE($2, content), 
          is_paid = COALESCE($3, is_paid)
      WHERE id = $4
      RETURNING *, is_paid as is_paid_content
    `
    const result = await pool.query(updateQuery, [title, content, is_paid_content, id])

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const userRole = req.user.role

  try {
    const checkResult = await pool.query('SELECT author_id FROM posts WHERE id = $1', [id])

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const post = checkResult.rows[0]

    if (post.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id])

    res.json({ message: 'Post deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

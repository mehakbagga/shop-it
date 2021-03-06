export default async (req, res) => {
  const { query } = req.query

  // If an invalid query is passed then return an empty array
  if (!query || query.length < 3) {
    res.statusCode = 200
    res.json([])
    return
  }

  const searchResults = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&type=movie&s=${query}`
  ).then((res) => res.json())

  // Always send 200 because our server is still okay
  // and let the frontend handle the error
  res.statusCode = 200

  // Handle OMDB error but don't consider empty results as an error
  if (searchResults.Error && searchResults.Error !== 'Movie not found!') {
    res.json({ error: searchResults.Error })
  } else {
    // If no movies were found, send an empty array
    const movies = searchResults.Search || []
    movies.sort((movieA, movieB) => movieB.Year - movieA.Year)

    res.json(movies)
  }
}

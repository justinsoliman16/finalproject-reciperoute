export const handleSearch = async (
  keyword,
  currentPage,
  setRecipes,
  setTotalPages
) => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${keyword}&number=3&offset=${
        (currentPage - 1) * 3
      }&apiKey=2adf250f5d79419b8e77854d03ab469e`
    );
    const data = await response.json();
    setRecipes(data.results);
    setTotalPages(Math.ceil(data.totalResults / 3));
  } catch (error) {
    console.error("Error searching for recipes:", error);
  }
};

export const handlePreviousPage = (currentPage, setCurrentPage) => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

export const handleNextPage = (currentPage, totalPages, setCurrentPage) => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

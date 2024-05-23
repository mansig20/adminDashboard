import React, { useState, useEffect } from "react";
import axios from "axios";

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [editIdx, setEditIdx] = useState(-1);
  const [editedBook, setEditedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [currentPage, recordsPerPage]);

  const fetchBooks = async () => {
    const response = await axios.get(
      `https://openlibrary.org/subjects/programming.json?limit=${recordsPerPage}&offset=${
        (currentPage - 1) * recordsPerPage
      }`
    );
    const fetchedBooks = response.data.works.map((book) => ({
      title: book.title,
      author_name: book.authors[0]?.name || "Unknown",
      first_publish_year: book.first_publish_year,
      subject: book.subject || "N/A",
      ratings_average: book.ratings_average || "N/A",
      author_birth_date: book.authors[0]?.birth_date || "Unknown",
      author_top_work: book.authors[0]?.top_work || "Unknown",
    }));
    setBooks(fetchedBooks);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    sortBooks(key, direction);
  };

  const sortBooks = (key, direction) => {
    const sortedBooks = [...books].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setBooks(sortedBooks);
  };

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  const handleRecordsPerPageChange = (event) => {
    setRecordsPerPage(Number(event.target.value));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕";
  };

  const handleEdit = (index) => {
    setEditIdx(index);
    setEditedBook({ ...books[index] });
  };

  const handleSave = () => {
    const updatedBooks = [...books];
    updatedBooks[editIdx] = editedBook;
    setBooks(updatedBooks);
    setEditIdx(-1);
    setEditedBook(null);
  };

  const handleChange = (e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditIdx(-1);
    setEditedBook(null);
  };

  const handleDownloadCSV = () => {
    const csvHeader =
      "Ratings Average,Author Name,Title,First Publish Year,Subject,Author Birth Date,Author Top Work\n";
    const csvRows = books
      .map(
        (book) =>
          `${book.ratings_average},${book.author_name},${book.title},${book.first_publish_year},${book.subject},${book.author_birth_date},${book.author_top_work}`
      )
      .join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "books.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBooks = books.filter((book) =>
    book.author_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-container mx-auto p-4 bg-pistachio text-vanilla rounded-lg">
      <h1 className="text-3xl text-vanilla font-bold mb-4">Admin Dashboard</h1>
      <div className="controls mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2">Page:</label>
          <select
            value={currentPage}
            onChange={handlePageChange}
            className="p-2 rounded bg-cream text-dark-purple"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Records per page:</label>
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="p-2 rounded bg-cream text-dark-purple"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by author"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 rounded bg-cream text-dark-purple"
          />
        </div>
        <div>
          <button
            onClick={handleDownloadCSV}
            className="p-2 rounded bg-violet-jtc text-cream"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table className="min-w-full bg-vanilla overflow-hidden">
        <thead className="bg-lapis-lazuli text-white">
          <tr>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("ratings_average")}
            >
              Ratings Average {getSortIcon("ratings_average")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("author_name")}
            >
              Author Name {getSortIcon("author_name")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title {getSortIcon("title")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("first_publish_year")}
            >
              First Publish Year {getSortIcon("first_publish_year")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("subject")}
            >
              Subject {getSortIcon("subject")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("author_birth_date")}
            >
              Author Birth Date {getSortIcon("author_birth_date")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("author_top_work")}
            >
              Author Top Work {getSortIcon("author_top_work")}
            </th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-olivine" : "bg-olivine"}`}
            >
              {editIdx === index ? (
                <>
                  <td className="p-2">
                    <input
                      name="ratings_average"
                      value={editedBook.ratings_average}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="author_name"
                      value={editedBook.author_name}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="title"
                      value={editedBook.title}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="first_publish_year"
                      value={editedBook.first_publish_year}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="subject"
                      value={editedBook.subject}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="author_birth_date"
                      value={editedBook.author_birth_date}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="author_top_work"
                      value={editedBook.author_top_work}
                      onChange={handleChange}
                      className="p-1 w-full bg-cream rounded"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={handleSave}
                      className="p-1 m-1 rounded bg-old-rose text-violet-jtc"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded bg-old-rose text-violet-jtc"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{book.ratings_average}</td>
                  <td className="p-2">{book.author_name}</td>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.first_publish_year}</td>
                  <td className="p-2">{book.subject}</td>
                  <td className="p-2">{book.author_birth_date}</td>
                  <td className="p-2">{book.author_top_work}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-1 rounded bg-violet-jtc text-cream"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="p-2 rounded bg-violet-jtc text-cream"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="p-2 rounded bg-violet-jtc text-cream"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookTable;

# Assignment 3: Reading Tracker

This is a reading tracker built using React and Tailwindcss.

## Structure

It uses 3 different components within the components folder in root, aside from App.tsx:
* SearchBar.tsx for searching for books and their information using the Open Library API.
* BookCard.tsx for generating the user's library.
* StatsBar.tsx for showing the stats of the user's library.

## Features

<p>At the top right of the page, there is a switch to turn off and on dark mode.<br><br> 
In the search bar you can search for books from the Open Library. After typing in a title you hit search and results should show if books are found. If not then no results are shown. If there are results shown and you want to clear out the results to declutter your screen, you can hit the x button inside the search bar.<br><br>    
Underneath the search bar, there is the stats bar which show the 3 categories of books: books to read, currently being read books, and finished books, as well has the average rating of the finished books.
<br><br>
The library itself is contained within App.tsx along with the options to sort between to read, reading and finished. The books can be sorted by date, name, or author. In the library, after books are added, their status can be moved along by going forward or back. They can also be deleted from the library and added back in later. When a book is in the finished state, it can be rated.
</p>


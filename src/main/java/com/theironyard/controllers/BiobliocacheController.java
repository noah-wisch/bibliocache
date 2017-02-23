package com.theironyard.controllers;

import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.books.model.Volume;
import com.theironyard.entities.Book;
import com.theironyard.entities.User;
import com.theironyard.services.BookRepository;
import com.theironyard.services.BookSample;
import com.theironyard.services.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.*;

/**
 * Created by kelseynewman on 2/8/17.
 */
@RestController
public class BiobliocacheController {
    @Autowired
    BookRepository books;

    @Autowired
    UserRepository users;

    //pulls excerpts from CSV file and parses them into corresponding column in DB based on book ID number
    @RequestMapping(path="/add-excerpt", method = RequestMethod.PUT)
    public Book addExcerpt() throws FileNotFoundException {
        File file = new File("bookExcerpts.csv");
        Book book = new Book();
        Scanner scanner = new Scanner(file);
        while (scanner.hasNext()) {
            String line = scanner.nextLine();
            String [] columns = line.split("\\,\\s\\[");
            book = books.findById(Integer.valueOf(columns[0]));
            book.setBookExcerpt(columns[1]);
            book.setReadingLevel(Book.readingLevelOfBook(book));
            books.save(book);
        }
        return book;
    }

    //sets category to the category selected after user logs in
    //list of books is returned based on the user's reading level and the category they selected
    @RequestMapping(path = "/set-category", method = RequestMethod.POST)
    public List<Book> setCategory(HttpSession session, @RequestBody HashMap<String,String> category) {
        String userEmail = (String)session.getAttribute("email");
        User user = users.findFirstByEmail(userEmail);
        user.setCategory(category.get("category"));
        users.save(user);
        List<Book> sortedBooks;
        List<Book> returnedBooks = new ArrayList<>();
        String query = user.getCategory();
        JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
        try {
            List<Volume> volumes = BookSample.queryGoogleBooks(jsonFactory, query);
            for (Volume volume : volumes) {
                Book storedBook = books.findByTitle(volume.getVolumeInfo().getTitle());
                if (storedBook == null) {
                    books.save(new Book(volume, user));
                    System.out.println("New books saved.");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if(user != null) {
            Book book = new Book();
            if (user.getCategory() != null) {
                book.setCategory(user.getCategory());
            }
            ExampleMatcher matcher = ExampleMatcher//queries the database rather than what's in memory (as it would with a stream).
                    .matching()
                    .withIgnoreNullValues()
                    .withMatcher("category", exact());//Pulls books with category that matches the user's
            Example<Book> example = Example.of(book, matcher);
            Sort sort = new Sort(Sort.Direction.DESC, "readingLevel");
            sortedBooks = (List<Book>)books.findAll(example, sort);
            sortedBooks = sortedBooks//get all the books by category that matches our user's
                    .stream()
                    .filter(b -> b.getReadingLevel() <= user.getReadingLevel())
                    //filter books by reading level that matches our user's
                    //returns books at or below our user's reading level
                    .collect(Collectors.toList());//put those books that are left into a list
            if (sortedBooks.size() > 5) {
                returnedBooks = sortedBooks.stream().collect(Collectors.toList()).subList(0, 5);
                //if sortedBooks is greater than 5 items
                //get the first five items of that list (toIndex is exclusive) if list is greater than 5
            } else {
                returnedBooks = sortedBooks;
                //else return all the books in sortedBooks list.
            }
        }
        return returnedBooks;
    }
}

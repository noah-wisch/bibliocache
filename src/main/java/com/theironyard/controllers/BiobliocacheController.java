package com.theironyard.controllers;

import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.books.model.Volume;
import com.theironyard.datamodels.LibraryBook;
import com.theironyard.entities.Book;
import com.theironyard.entities.User;
import com.theironyard.services.BookRepository;
import com.theironyard.services.BookSample;
import com.theironyard.services.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by kelseynewman on 2/8/17.
 */
@RestController
public class BiobliocacheController {
    @Autowired
    BookRepository books;

    @Autowired
    UserRepository users;

    @Autowired
    RestTemplate template;


    @RequestMapping(path = "/end-round", method = RequestMethod.GET)
    public List<Book> getList(HttpSession session, boolean flag, HttpServletResponse response) throws IOException{
        String userEmail = (String)session.getAttribute("email");
        User user = users.findFirstByEmail(userEmail);
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
                    Map<String, String> urlParams = new HashMap<>();
                    urlParams.put("ISBN", volume.getVolumeInfo().getIndustryIdentifiers().get(0).getIdentifier());
                    LibraryBook libraryBook = template.getForObject("https://openlibrary.org/api/books?bibkeys=ISBN:{ISBN}&jscmd=data&format=json", LibraryBook.class, urlParams);
                    System.out.println(libraryBook.toString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (user != null) {
            if (flag) {
                if (books.findByCategory(user.getCategory()).size() > 5) {
                    returnedBooks = books.findByCategory(user.getCategory())
                            .stream().collect(Collectors.toList()).subList(0, 5);
                } else {
                    returnedBooks = books.findByCategory(user.getCategory()).stream().collect(Collectors.toList());
                }
            }
        }

//     if(user != null) {
//            if (flag) {//if flag is set to true
//                returnedBooks = books.findByCategory(user.getCategory())//get all the books by category that matches our user's
//                        .stream()
//                        .filter(b -> b.getReadingLevel() == user.getReadingLevel())//filter books by reading level that matches our user's
//                        .collect(Collectors.toList())//put those books that are left into a list
//                        .subList(0, 5);//get the first five items of that list (toIndex is exclusive)
//            }
//        }
            return returnedBooks;
    }

    @RequestMapping(path="/add-excerpt", method = RequestMethod.PUT)
    public Book addExcerpt(@RequestBody String [] excerpt) {
        Book book = books.findByTitle(excerpt[0]);
        book.setBookExcerpt(excerpt[1]);
        book.setReadingLevel(Book.readingLevelOfBook(book));
        books.save(book);
        return book;
    }

}

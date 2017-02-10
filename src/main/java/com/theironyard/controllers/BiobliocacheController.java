package com.theironyard.controllers;

import com.theironyard.entities.Book;
import com.theironyard.entities.User;
import com.theironyard.services.BookRepository;
import com.theironyard.services.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
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

    @PostConstruct
    public void init() {
//        if (books.count() == 0) {
//            Book book = new Book();
//            book.setTitle("Harry Potter");
//            book.setAuthor("JK Rowling");
//            book.setCategory("Fantasy");
//            book.setReadingLevel(8);
//            books.save(book);
//            Book altBook = new Book();
//            altBook.setTitle("The Shining");
//            altBook.setAuthor("Stephen King");
//            altBook.setCategory("Horror");
//            altBook.setReadingLevel(12);
//            books.save(altBook);
//        }
    }

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public List<Book> getBooks() {
        return (List<Book>) books.findAll();
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public String login (HttpSession session, String email, String password) {
        User user = users.findFirstByEmail(email);
        if (user == null) {
        return "redirect:/registration";
        }
        session.setAttribute("email", email);
        return "redirect:/";
    }

    @RequestMapping(path = "/registration", method = RequestMethod.POST)
    public String register (HttpSession session, String email, String password, int readingLevel, String category, int[] location, int age) {
        User user = new User(email, password, readingLevel, category, location, age);
        users.save(user);
        session.setAttribute("email", email);
        return "redirect:/";

    }

    @RequestMapping(path = "/end-round", method = RequestMethod.GET)
    public List<Book> getList(HttpSession session, boolean flag) {
        String userEmail = (String)session.getAttribute("email");
        User user = users.findFirstByEmail(userEmail);
        List<Book> returnedBooks = new ArrayList<>();
        if (flag) {//if flag is set to true
            returnedBooks = books.findByCategory(user.getCategory())//get all the books by category that matches our user's
                    .stream()
                    .filter(b -> b.getReadingLevel() == user.getReadingLevel())//filter books by reading level that matches our user's
                    .collect(Collectors.toList())//put those books that are left into a list
                    .subList(0, 5);//get the first five items of that list (toIndex is exclusive)
        }
        return returnedBooks;
    }
}

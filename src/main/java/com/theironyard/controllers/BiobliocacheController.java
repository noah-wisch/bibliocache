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
import com.theironyard.utilities.PasswordStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
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


    @PostConstruct
    public void init() {

    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public String login ( HttpSession session, @RequestBody User user) {
//        User user = users.findFirstByEmail(email);
        if (user == null) {
        return "redirect:userRegistration.html";
        }
        session.setAttribute("email", user.getEmail());
        return "redirect:index.html";
        //todo find out how to send back user's info
    }

    @RequestMapping(path = "/registration", method = RequestMethod.POST)
    public String register (HttpSession session, @RequestBody User user) {
        users.save(user);
        session.setAttribute("email", user.getEmail());
        return "redirect:index.html";

    }

    @RequestMapping(path = "/end-round", method = RequestMethod.GET)
    public List<Book> getList(HttpSession session, boolean flag) throws IOException{
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
//                //TODO need to incorporate if statement to be sure that returnedBooks is more than 5 items, or sublist will break it
//            }
//        }
        return returnedBooks;
    }
}

package com.theironyard.controllers;

import com.google.api.services.books.model.Volume;
import com.theironyard.entities.Book;
import com.theironyard.entities.User;
import com.theironyard.services.BookRepository;
import com.theironyard.services.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
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

    Properties properties = new Properties();

    @PostConstruct
    public void init() {
        InputStream input = null;
        try {
            input = new FileInputStream(".env");
            properties.load(input);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

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
    public Volume getList(HttpSession session, boolean flag) {
        String userEmail = (String)session.getAttribute("email");
        User user = users.findFirstByEmail(userEmail);
        List<Book> returnedBooks = new ArrayList<>();
        Map <String, String> urlParams = new HashMap<>();
        urlParams.put("YOUR_API_KEY", properties.getProperty("YOUR_API_KEY"));
        urlParams.put("category", user.getCategory());
        Volume volume = template.getForObject("https://www.googleapis.com/books/v1/volumes?q=subject:{category}&printType=books&download=epub&filter=full&langRestrict=en&key={YOUR_API_KEY}&fields=kind,items(volumeInfo(title,authors,categories))", Volume.class, urlParams);
//        if(user != null) {
//            if (flag) {//if flag is set to true
//                returnedBooks = books.findByCategory(user.getCategory())//get all the books by category that matches our user's
//                        .stream()
//                        .filter(b -> b.getReadingLevel() == user.getReadingLevel())//filter books by reading level that matches our user's
//                        .collect(Collectors.toList())//put those books that are left into a list
//                        .subList(0, 5);//get the first five items of that list (toIndex is exclusive)
//                //TODO need to incorporate if statement to be sure that returnedBooks is more than 5 items, or sublist will break it
//            }
//        }
        System.out.println(volume.toString());
        return volume;
    }
}

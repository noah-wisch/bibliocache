package com.theironyard.controllers;

import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.books.BooksRequest;
import com.google.api.services.books.BooksRequestInitializer;
import com.google.api.services.books.model.Volume;
import com.google.api.services.books.model.Volumes;
import com.theironyard.datamodels.VolumeList;
import com.theironyard.entities.Book;
import com.theironyard.entities.User;
import com.theironyard.services.BookRepository;
import com.theironyard.services.BookSample;
import com.theironyard.services.UserRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
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
//        Map <String, String> urlParams = new HashMap<>();
//        urlParams.put("YOUR_API_KEY", System.getenv("YOUR_API_KEY"));
//        urlParams.put("category", user.getCategory());
        String query = user.getCategory();

        JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

        try {
            BookSample.queryGoogleBooks(jsonFactory, query);
        } catch (Exception e) {
            e.printStackTrace();
        }


//        Volumes volume = template.getForObject("https://www.googleapis.com/books/v1/volumes?q=subject:{category}&printType=books&download=epub&filter=full&langRestrict=en&key={YOUR_API_KEY}&fields=kind,items(volumeInfo(title,authors,categories,previewLink))", Volumes.class, urlParams);
//        Document doc  = Jsoup.connect(volume.getVolumeInfo().getPreviewLink()).get();
//        System.out.println(volume.toString());
//        Book newBook = new Book(volume.getVolumeInfo().getTitle(),
//                    volume.getVolumeInfo().getAuthors().get(0),
//                    volume.getVolumeInfo().getMainCategory(),
//                Book.readingLevelOfBook(doc.text()));
//                    14);
//            books.save(newBook);

     if(user != null) {
            if (flag) {//if flag is set to true
                returnedBooks = books.findByCategory(user.getCategory())//get all the books by category that matches our user's
                        .stream()
                        .filter(b -> b.getReadingLevel() == user.getReadingLevel())//filter books by reading level that matches our user's
                        .collect(Collectors.toList())//put those books that are left into a list
                        .subList(0, 5);//get the first five items of that list (toIndex is exclusive)
                //TODO need to incorporate if statement to be sure that returnedBooks is more than 5 items, or sublist will break it
            }
        }
        return returnedBooks;
    }
}

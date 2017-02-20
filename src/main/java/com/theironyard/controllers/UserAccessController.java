package com.theironyard.controllers;

import com.theironyard.entities.User;
import com.theironyard.services.UserRepository;
import com.theironyard.utilities.PasswordStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by kelseynewman on 2/17/17.
 */
@Controller
public class UserAccessController {
    @Autowired
    UserRepository users;

    @PostConstruct
    public void init() {
    }

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public String home(HttpSession session) {
        String userEmail = (String) session.getAttribute("email");
        User user = users.findFirstByEmail(userEmail);
        if (user == null) {
            return "redirect:notloggedin.html";
        }
        return "index.html";
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public String login(HttpSession session, String email, String password) throws Exception{
        User user = users.findFirstByEmail(email);
        if (user == null) {
            return "redirect:notloggedin.html";
        } else if (!PasswordStorage.verifyPassword(password, user.getPassword())) {
            throw new Exception("Incorrect Password");
        }
        session.setAttribute("email", email);
        return "redirect:index.html";
    }

    @RequestMapping(path = "/registration", method = RequestMethod.POST)
    public String register(HttpSession session, String email, String password,
                         Integer readingLevel, String category, int [] location, Integer age) throws Exception {
        User newUser = new User(email,
                PasswordStorage.createHash(password),
                readingLevel,
                category,
                location,
                age);
        users.save(newUser);
        session.setAttribute("email", email);
        return "redirect:index.html";
    }

    @RequestMapping(path ="/logout", method = RequestMethod.POST)
    public String logout(HttpSession session) throws IOException {
        session.invalidate();
        return "redirect:notloggedin.html";
    }
}

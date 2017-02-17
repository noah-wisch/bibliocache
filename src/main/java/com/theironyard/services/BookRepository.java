package com.theironyard.services;

import com.theironyard.entities.Book;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by kelseynewman on 2/8/17.
 */
public interface BookRepository extends CrudRepository<Book, Integer> {
    List<Book> findByCategory (String category);
    Book findByTitle (String title);


}

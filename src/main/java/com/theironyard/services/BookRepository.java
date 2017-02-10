package com.theironyard.services;

import com.theironyard.entities.Book;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by kelseynewman on 2/8/17.
 */
public interface BookRepository extends CrudRepository<Book, Integer> {
}

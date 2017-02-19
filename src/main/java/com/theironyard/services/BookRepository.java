package com.theironyard.services;

import com.theironyard.entities.Book;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by kelseynewman on 2/8/17.
 */
public interface BookRepository extends CrudRepository<Book, Integer> {
    Book findByTitle (String title);

    @Query("SELECT b FROM Book b WHERE LOWER(b.category) LIKE LOWER(CONCAT('%',:category, '%'))")
    List<Book> findByCategory(@Param("category") String category);//allows for hard coded categories that are combined
    //will return books with categories that contain keywords like that in the query


}

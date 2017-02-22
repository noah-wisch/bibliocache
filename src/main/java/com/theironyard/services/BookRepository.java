package com.theironyard.services;

import com.theironyard.entities.Book;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.util.List;

/**
 * Created by kelseynewman on 2/8/17.
 */
public interface BookRepository extends QueryByExampleExecutor<Book>, CrudRepository<Book, Integer> {
    <S extends Book> S findOne(Example<S> example);

    <S extends Book> Iterable<S> findAll(Example<S> example, Sort sort);

    Book findByTitle (String title);

    Book findById (Integer id);

//    List<Book> findByCategory (String category);
    @Query("SELECT b FROM Book b WHERE LOWER(b.category) LIKE LOWER(CONCAT('%',:category, '%'))")
    List<Book> findByCategory(@Param("category") String category);//allows for hard coded categories that are combined (ex. Science Fiction & Fantasy)
    //will return books with categories that contain keywords like that in the query
}

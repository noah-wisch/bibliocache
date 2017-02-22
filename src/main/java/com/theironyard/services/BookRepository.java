package com.theironyard.services;

import com.theironyard.entities.Book;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;

/**
 * Created by kelseynewman on 2/8/17.
 */
public interface BookRepository extends QueryByExampleExecutor<Book>, CrudRepository<Book, Integer> {
    <S extends Book> S findOne(Example<S> example);

    <S extends Book> Iterable<S> findAll(Example<S> example, Sort sort);

    Book findByTitle (String title);

    Book findById (Integer id);
}

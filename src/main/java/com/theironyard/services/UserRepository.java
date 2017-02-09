package com.theironyard.services;

import com.theironyard.entities.User;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by kelseynewman on 2/8/17.
 */
public interface UserRepository extends CrudRepository<User, Integer>{
    User findFirstByEmail (String email);
}

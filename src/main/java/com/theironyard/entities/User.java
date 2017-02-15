package com.theironyard.entities;

import javax.persistence.*;

/**
 * Created by kelseynewman on 2/8/17.
 */
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    int id;

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @Column (nullable = false)
    Integer readingLevel;

    @Column
    String category;

    @Column
    int [] location;

    @Column(nullable = false)
    Integer age;

    public User() {
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String email, String password, Integer readingLevel, String category, int[] location, Integer age) {
        this.email = email;
        this.password = password;
        this.readingLevel = readingLevel;
        this.category = category;
        this.location = location;
        this.age = age;
    }

    public User(int id, String email, String password, Integer readingLevel, String category, int[] location, Integer age) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.readingLevel = readingLevel;
        this.category = category;
        this.location = location;
        this.age = age;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getReadingLevel() {
        return readingLevel;
    }

    public void setReadingLevel(Integer readingLevel) {
        this.readingLevel = readingLevel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int[] getLocation() {
        return location;
    }

    public void setLocation(int[] location) {
        this.location = location;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}

package com.theironyard.entities;

import javax.persistence.*;

/**
 * Created by kelseynewman on 2/7/17.
 */
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue
    int id;

    @Column(nullable = false)
    String title;

    @Column(nullable = false)
    String author;

    @Column(nullable = false)
    String category;

    @Column(nullable = false)
    int readingLevel;

    public Book() {
    }

    public Book(String title, String author, String category, int readingLevel) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.readingLevel = readingLevel;
    }

    public Book(int id, String title, String author, String category, int readingLevel) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.readingLevel = readingLevel;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getReadingLevel() {
        return readingLevel;
    }

    public void setReadingLevel(int readingLevel) {
        this.readingLevel = readingLevel;
    }

    /*
    Formula - Automated Readability Index
    Reading Level = 4.71(characters/words) + 0.5 (words/sentences) - 21.43
    Always round up (cast as an int and add 1).
    Extract a passage from the book and find the number of characters, words and sentences in it to determine that book's
    approximate reading level.
    */
    public static void readingLevelOfBook (Book book) {
        String paragraph = new String();//TODO: find out how to pull an excerpt from books to pass into algorithm
        book.setReadingLevel((int)(4.71 * (charactersPresent(paragraph)/wordsPresent(paragraph))
                + 0.5 * (wordsPresent(paragraph)/sentencesPresent(paragraph)) - 21.43) + 1);
    }


    public static int charactersPresent(String paragraph) {
        return paragraph
                .replaceAll("\\p{P}", "")//removes all punctuation
                .replaceAll("\\s", "")//removes all white space
                .toCharArray().length;//adds remaining characters to a char array and finds the length (i.e. number of characters)
    }

    public static int wordsPresent (String paragraph) {
        String[] words = paragraph.split(" ");//turns paragraph into an array of strings split on whitespace.
        return words.length;//returns the number of elements in the words array (i.e. number of words in the paragraph).
    }

    public static int sentencesPresent(String paragraph) {
        int sentences = 0;

        return sentences;
    }
}

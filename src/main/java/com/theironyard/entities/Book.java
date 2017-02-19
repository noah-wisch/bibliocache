package com.theironyard.entities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.books.model.Volume;

import javax.jws.soap.SOAPBinding;
import javax.persistence.*;

import java.text.BreakIterator;
import java.util.List;
import java.util.Locale;

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

    @Column
    String author;

    @Column(nullable = false)
    String category;

    @Column(nullable = false)
    Integer readingLevel;

    @Column
    String bookExcerpt;

    @Column
    String infoLink;

    public Book() {
    }

    public Book(Volume volume, User user) {
        this.title = volume.getVolumeInfo().getTitle();

        List<String> authors = volume.getVolumeInfo().getAuthors();

        if (authors != null && authors.size() > 0) {
            this.author = authors.get(0);
        } else {
            this.author = "Unknown";
        }
        this.category = user.getCategory();
        this.readingLevel = 1;
        this.infoLink = volume.getVolumeInfo().getInfoLink();
    }

    public Book(String title, String author, String category, Integer readingLevel) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.readingLevel = readingLevel;
    }

    public Book(int id, String title, String author, String category, Integer readingLevel) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.readingLevel = readingLevel;
    }

    public String getInfoLink() {
        return infoLink;
    }

    public void setInfoLink(String infoLink) {
        this.infoLink = infoLink;
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

    public Integer getReadingLevel() {
        return readingLevel;
    }

    public void setReadingLevel(Integer readingLevel) {
        this.readingLevel = readingLevel;
    }

    public String getBookExcerpt() {
        return bookExcerpt;
    }

    public void setBookExcerpt(String bookExcerpt) {
        this.bookExcerpt = bookExcerpt;
    }

    /*
            Formula - Automated Readability Index
            Reading Level = 4.71(characters/words) + 0.5 (words/sentences) - 21.43
            Always round up (cast as an int and add 1).
            Extract a passage from the book and find the number of characters, words and sentences in it to determine that book's
            approximate reading level.
            */
    public static Integer readingLevelOfBook (Book book) {
        String paragraph = book.getBookExcerpt();
      //  String paragraph = new String();//TODO: find out how to pull an excerpt from books to pass into algorithm
        //book.setReadingLevel(
        return (int)(4.71 * (charactersPresent(paragraph)/wordsPresent(paragraph))
                + 0.5 * (wordsPresent(paragraph)/sentencesPresent(paragraph)) - 21.43) + 1;
    }


    public static int charactersPresent(String paragraph) {
        return paragraph
                .replaceAll("\\p{P}", "")//removes all punctuation
                .replaceAll("\\s", "")//removes all white space
                .toCharArray().length;//adds remaining characters to a char array and finds the length (i.e. number of characters)
    }

    public static int wordsPresent (String paragraph) {
        return paragraph.split(" ").length;//turns paragraph into an array of strings split on whitespace.
         //returns the number of elements in the words array (i.e. number of words in the paragraph).
    }

    public static int sentencesPresent(String paragraph) {
        int sentences = 0;

            BreakIterator iterator = BreakIterator.getSentenceInstance(Locale.US);
                //breaks a piece of text into sentences according to the conventions of the english language
            iterator.setText(paragraph);//sets the paragraph as the text to be examined

            int lastIndex = iterator.first();//sets the last index of a sentence to the first boundary
            while (lastIndex != BreakIterator.DONE) {//while that index is not the last boundary in the sentence, do this:
                int firstIndex = lastIndex;//set last index to the first index of the next sentence
                lastIndex = iterator.next();//last index is now set to the next boundary

                if (lastIndex != BreakIterator.DONE) {//if the last boundary has not been reached
                    paragraph.substring(firstIndex, lastIndex);//create a substring from the first to the last index of the current sentence
                    sentences++;//increase count of sentences by one
                }
            }
            return sentences;//returns total number of sentences
        }


}

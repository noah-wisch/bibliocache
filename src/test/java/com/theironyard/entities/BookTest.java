package com.theironyard.entities;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by kelseynewman on 2/9/17.
 */
public class BookTest {
    @Test
    public void charactersTest() throws Exception {
        assertEquals(40, Book.charactersPresent("This is an example with commas, periods and stuff."));
        assertEquals(20, Book.charactersPresent("The dog-boy laughs at him."));
    }

    @Test
    public void wordsTest() throws Exception {
        assertEquals(6, Book.wordsPresent("This sentence has six cool words."));
        assertEquals(12, Book.wordsPresent("This is one sentence. This is another with more words. Cool stuff!"));
        assertEquals(11, Book.wordsPresent("The worst-case scenario is that you die. You'll be okay though."));
    }

}
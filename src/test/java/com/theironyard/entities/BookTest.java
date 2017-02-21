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

    @Test
    public void sentencesTest()throws Exception {
        assertEquals(3, Book.sentencesPresent("This is a test. This is a T.L.A. test. Now with a Dr. in it."));
    }
//
//    @Test
//    public void readingLevelTest() throws Exception  {
//        assertEquals(9, Book.readingLevelOfBook("Harsh sounds of chains and pulleys, like the workings of an ancient steel factory, echoed through the room, bouncing off the walls with a hollow, tinny whine. The lightless elevator swayed back and forth as it ascended, turning the boy's stomach sour with nausea; a smell like burnt oil invaded his senses, making him feel worse. He wanted to cry, but no tears came; he could only sit there, alone, waiting."));
//        //excerpt from The Maze Runner
//        assertEquals(1, Book.readingLevelOfBook("If a hungry little traveler shows up at your house, you might want to give him a cookie. If you give him a cookie, he's going to ask for a glass of milk. He'll want to look in a mirror to make sure he doesn't have a milk mustache."));
//        //excerpt from If You Give a Mouse a Cookie
//        assertEquals(14, Book.readingLevelOfBook("It was a special pleasure to see things eaten, to see things blackened and changed. With the brass nozzle in his fists, with this great python spitting its venomous kerosene upon the world, the blood pounded in his head, and his hands were the hands of some amazing conductor playing all the symphonies of blazing and burning to bring down the tatters and charcoal ruins of history."));
//        //excerpt from Fahrenheit 451
//    }

}
package com.theironyard.datamodels;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.api.services.books.model.Volume;

/**
 * Created by kelseynewman on 2/15/17.
 */
public class LibraryBook {
    private JsonNode ISBN;
    private LibraryBookExcerpt libraryBookExcerpt;

    public JsonNode getISBN() {
        return ISBN;
    }

    public void setISBN(Volume volume) {
        this.ISBN = ISBN;
    }

    public LibraryBookExcerpt getLibraryBookExcerpt() {
        return libraryBookExcerpt;
    }

    public void setLibraryBookExcerpt(LibraryBookExcerpt libraryBookExcerpt) {
        this.libraryBookExcerpt = libraryBookExcerpt;
    }

    public String retrieveISBN() {
        if (ISBN.isObject()) {
            return ISBN.path("ISBN").asText();
        } else {
            return ISBN.asText();
        }
    }

    @Override
    public String toString() {
        return "LibraryBook{" +
                "ISBN=" + ISBN +
                ", libraryBookExcerpt=" + libraryBookExcerpt +
                '}';
    }
}

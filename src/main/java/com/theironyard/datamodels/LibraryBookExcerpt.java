package com.theironyard.datamodels;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by kelseynewman on 2/15/17.
 */
public class LibraryBookExcerpt {
    private String comment;
    private String text;


    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "LibraryBookExcerpt{" +
                "text='" + text + '\'' +
                '}';
    }
}

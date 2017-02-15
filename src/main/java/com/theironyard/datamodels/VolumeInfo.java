package com.theironyard.datamodels;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * Created by kelseynewman on 2/11/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)//indicates that any properties not bound in this type should be ignored.
public class VolumeInfo {

    private int id;
    private String title;
    private List<String> authors;
    private List<String> categories;

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

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    @Override
    public String toString() {
        return "VolumeInfo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", authors=" + authors +
                '}';
    }
}
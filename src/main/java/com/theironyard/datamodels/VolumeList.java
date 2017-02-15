package com.theironyard.datamodels;

import com.google.api.services.books.model.*;
import com.google.api.services.books.model.Volume;

import java.util.List;

/**
 * Created by kelseynewman on 2/13/17.
 */
public class VolumeList {
    private List<Volume> items;

    public List<Volume> getItems() {
        return items;
    }

    public void setItems(List<Volume> items) {
        this.items = items;
    }
}

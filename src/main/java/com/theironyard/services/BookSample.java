package com.theironyard.services;


import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.books.Books;
import com.google.api.services.books.BooksRequestInitializer;
import com.google.api.services.books.Books.Volumes.List;
import com.google.api.services.books.model.Volume;
import com.google.api.services.books.model.Volumes;
import com.theironyard.entities.User;

import java.io.IOException;
import java.net.URLEncoder;
/**
 * Created by kelseynewman on 2/14/17.
 */
public class BookSample {
    private static final String APPLICATION_NAME = "Bibliocache";

    public static java.util.List<Volume> queryGoogleBooks(JsonFactory jsonFactory, String query) throws Exception {
    //set up books client
    final Books books = new Books.Builder(GoogleNetHttpTransport.newTrustedTransport(), jsonFactory, null)
        .setApplicationName(APPLICATION_NAME)
        .setGoogleClientRequestInitializer(new BooksRequestInitializer(System.getenv("YOUR_API_KEY")))
        .build();


    //Set filter string and filter only free Google eBooks
    System.out.println("Query: [" + query + "]");
    List volumesList = books.volumes().list(query);
    volumesList.setFilter("free-ebooks");


    //Execute the query
    Volumes volumes = volumesList.execute();
    if (volumes.getTotalItems() == 0 || volumes.getItems() == null) {
        System.out.println("No matches found.");
  //      return;
    }

    //Output results.
    for (Volume volume: volumes.getItems()) {
        Volume.VolumeInfo volumeInfo = volume.getVolumeInfo();
        System.out.println("==========");


    //    Title
        System.out.println("Title: " + volumeInfo.getTitle());
     //   Author(s).
        java.util.List<String> authors = volumeInfo.getAuthors();
        if (authors != null && !authors.isEmpty()) {
            System.out.println("Author(s): ");
            for (int i = 0; i < authors.size(); i++) {
                System.out.println(authors.get(i));
                if (i < authors.size() - 1) {
                    System.out.println(", ");
                }
            }
        }
        //Description (if any).
        if (volumeInfo.getDescription() != null && volumeInfo.getDescription().length() > 0 ) {
            System.out.println("Description: " + volumeInfo.getDescription());
        }

        //Link to Google eBooks.
        System.out.println(volumeInfo.getInfoLink());

        if (volume.getVolumeInfo().getMainCategory() != query) {
            volumes.remove(volume);
        }
    }
        System.out.println("==========");
        System.out.println(
                volumes.getTotalItems() + " total results at http://books.google.com/ebooks?q="
                + URLEncoder.encode(query, "UTF-8"));

        return volumes.getItems();
    }
}

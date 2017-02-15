package com.theironyard;

import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.theironyard.services.BookSample;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@SpringBootApplication
public class FinalProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinalProjectApplication.class, args);

//		JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
//		try {
//			//Verify command line parameters.
//			if (args.length == 0) {
//				System.err.println("Usage: BooksSample [--author|--categories|--title|--selfLink] \"<query>\"");
//				System.exit(1);
//			}
			//Parse command line parameters into a query.
			//Query format
//			String prefix = null;
//			String query = "";
//			for (String arg : args) {
//				if ("--author".equals(arg)) {
//					prefix = "inauthor:";
//				} else if ("--categories".equals(arg)) {
//					prefix = "incategories:";
//				} else if ("--title:".equals(arg)) {
//					prefix = "intitle:";
//				} else if (arg.startsWith("--")) {
//					System.err.println("Unknown argument: " + arg);
//					System.exit(1);
//				} else {
//					query = arg;
//				}
//			}
//			if (prefix != null) {
//				query = prefix + query;
//			}
//			try {
//				BookSample.queryGoogleBooks(jsonFactory, query);
//				return;
//			} catch (IOException e) {
//				System.err.println(e.getMessage());
//			}
//		} catch (Throwable t) {
//				t.printStackTrace();
//			}
//			System.exit(0);
		}

	@Bean //sets up a class for dependency injection inside Spring container
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}
}

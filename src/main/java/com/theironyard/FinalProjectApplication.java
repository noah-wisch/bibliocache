package com.theironyard;

import com.theironyard.entities.Book;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;


@SpringBootApplication
public class FinalProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinalProjectApplication.class, args);

	}

	@Bean //sets up a class for dependency injection inside Spring container
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}
}

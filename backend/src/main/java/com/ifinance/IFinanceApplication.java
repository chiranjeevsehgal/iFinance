package com.ifinance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.data.mongo.config.annotation.web.http.EnableMongoHttpSession;

@SpringBootApplication
@EnableMongoHttpSession
public class IFinanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(IFinanceApplication.class, args);
    }
}

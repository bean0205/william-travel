package com.williamtravel.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class WilliamTravelApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(WilliamTravelApplication.class);

    public static void main(String[] args) {
        logger.info("Starting William Travel Application...");
        SpringApplication.run(WilliamTravelApplication.class, args);
        logger.info("William Travel Application started successfully!");
    }
    
    @Component
    public class ApplicationStartupListener implements ApplicationListener<ContextRefreshedEvent> {
        
        private static final Logger logger = LoggerFactory.getLogger(ApplicationStartupListener.class);
        
        @Override
        public void onApplicationEvent(ContextRefreshedEvent event) {
            logger.info("Application context refreshed, all beans initialized");
            logger.info("William Travel API is ready to serve requests");
        }
    }
}

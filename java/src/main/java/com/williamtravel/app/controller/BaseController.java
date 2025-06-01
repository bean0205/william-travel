package com.williamtravel.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Base controller class providing common logging functionality
 */
public abstract class BaseController {

    protected final Logger logger = LoggerFactory.getLogger(getClass());
    
    protected void logApiRequest(String methodName, Object... args) {
        if (logger.isInfoEnabled()) {
            StringBuilder sb = new StringBuilder();
            for (Object arg : args) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(arg);
            }
            logger.info("API Request: {}.{}({})", getClass().getSimpleName(), methodName, sb);
        }
    }
    
    protected void logApiSuccess(String methodName, Object result) {
        if (result == null) {
            logger.info("API Success: {}.{} returned null", getClass().getSimpleName(), methodName);
        } else {
            logger.info("API Success: {}.{} returned {}", 
                    getClass().getSimpleName(), methodName, result.getClass().getSimpleName());
        }
    }
    
    protected void logApiWarning(String methodName, String warning, Object... args) {
        logger.warn("API Warning: {}.{} - {}", getClass().getSimpleName(), methodName, String.format(warning, args));
    }
    
    protected void logApiError(String methodName, Throwable error) {
        logger.error("API Error: {}.{} - {}", getClass().getSimpleName(), methodName, error.getMessage(), error);
    }
    
    /**
     * Log API response
     */
    protected <T> ResponseEntity<T> logResponse(String methodName, ResponseEntity<T> response) {
        if (response.getStatusCode().is2xxSuccessful()) {
            logger.info("API Success: {}.{} returned status {}", 
                    getClass().getSimpleName(), methodName, response.getStatusCode().value());
        } else {
            logger.warn("API Warning: {}.{} returned non-success status {}", 
                    getClass().getSimpleName(), methodName, response.getStatusCode().value());
        }
        return response;
    }
    
    /**
     * Generic exception handler for controllers that extend this class
     * Can be overridden by more specific handlers in the global exception handler
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex, HttpServletRequest request) {
        logger.error("Unhandled controller exception in {}: {}", 
                getClass().getSimpleName(), ex.getMessage(), ex);
        return ResponseEntity.internalServerError().body("An unexpected error occurred");
    }
}

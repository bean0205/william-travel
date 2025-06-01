package com.williamtravel.app.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

/**
 * Utility class for standardized logging across the application
 */
public class LoggingUtils {

    /**
     * Get a logger for the specified class
     * @param clazz The class to get a logger for
     * @return A configured SLF4J Logger
     */
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
    
    /**
     * Log API request details in a standardized format
     * @param logger The SLF4J logger
     * @param methodName The name of the API method being called
     */
    public static void logApiRequest(Logger logger, String methodName) {
        getHttpRequest().ifPresent(request -> {
            String remoteAddr = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");
            String requestURI = request.getRequestURI();
            
            logger.info("API Request: method={}, uri={}, remoteAddr={}, userAgent={}", 
                    methodName, requestURI, remoteAddr, userAgent);
        });
    }
    
    /**
     * Log API success response in a standardized format
     * @param logger The SLF4J logger
     * @param methodName The name of the API method
     * @param entityDesc Description of the entity or result returned
     */
    public static void logApiSuccess(Logger logger, String methodName, String entityDesc) {
        logger.info("API Success: method={}, entity={}", methodName, entityDesc);
    }
    
    /**
     * Log API error response in a standardized format
     * @param logger The SLF4J logger
     * @param methodName The name of the API method
     * @param errorMessage Description of the error
     * @param ex Exception that was thrown (optional)
     */
    public static void logApiError(Logger logger, String methodName, String errorMessage, Exception ex) {
        if (ex != null) {
            logger.error("API Error: method={}, error={}", methodName, errorMessage, ex);
        } else {
            logger.error("API Error: method={}, error={}", methodName, errorMessage);
        }
    }
    
    /**
     * Log database operation in a standardized format
     * @param logger The SLF4J logger
     * @param operation The database operation (CREATE, READ, UPDATE, DELETE)
     * @param entity The entity type being operated on
     * @param entityId The ID of the entity
     */
    public static void logDatabaseOperation(Logger logger, String operation, String entity, Object entityId) {
        logger.info("Database: operation={}, entity={}, id={}", operation, entity, entityId);
    }
    
    /**
     * Log security events in a standardized format
     * @param logger The SLF4J logger
     * @param event The security event type
     * @param username The username associated with the event
     * @param details Additional details about the event
     */
    public static void logSecurityEvent(Logger logger, String event, String username, String details) {
        logger.info("Security: event={}, user={}, details={}", event, username, details);
    }
    
    /**
     * Get the current HTTP request from the request context
     * @return An Optional containing the current HttpServletRequest, or empty if not available
     */
    private static Optional<HttpServletRequest> getHttpRequest() {
        try {
            return Optional.ofNullable(RequestContextHolder.getRequestAttributes())
                    .filter(attributes -> attributes instanceof ServletRequestAttributes)
                    .map(attributes -> ((ServletRequestAttributes) attributes).getRequest());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}

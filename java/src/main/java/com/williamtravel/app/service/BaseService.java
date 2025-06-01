package com.williamtravel.app.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.Optional;

/**
 * Base service class providing common logging functionality
 * @param <T> Entity type
 * @param <ID> Entity ID type
 */
public abstract class BaseService<T, ID> {

    protected final Logger logger = LoggerFactory.getLogger(getClass());
    
    protected void logServiceMethodEntry(String methodName, Object... args) {
        if (logger.isDebugEnabled()) {
            StringBuilder sb = new StringBuilder();
            for (Object arg : args) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(arg);
            }
            logger.debug("Entering {}({}) - {}", getClass().getSimpleName(), methodName, sb.toString());
        }
    }
    
    protected void logServiceMethodExit(String methodName, Object result) {
        if (logger.isDebugEnabled()) {
            if (result == null) {
                logger.debug("Exiting {}({}) with null result", getClass().getSimpleName(), methodName);
            } else if (result instanceof Optional) {
                Optional<?> opt = (Optional<?>) result;
                logger.debug("Exiting {}({}) with optional {}", getClass().getSimpleName(), methodName, 
                       opt.isPresent() ? "present" : "empty");
            } else if (result instanceof Collection) {
                Collection<?> col = (Collection<?>) result;
                logger.debug("Exiting {}({}) with collection size: {}", getClass().getSimpleName(), methodName, col.size());
            } else {
                logger.debug("Exiting {}({}) with result: {}", getClass().getSimpleName(), methodName, result);
            }
        }
    }
    
    protected void logServiceInfo(String message, Object... args) {
        logger.info(message, args);
    }
    
    protected void logServiceWarning(String message, Object... args) {
        logger.warn(message, args);
    }
    
    protected void logServiceError(String message, Throwable error) {
        logger.error(message, error);
    }
    
    protected void logServiceError(String message, Object... args) {
        logger.error(message, args);
    }
    
    protected void logEntityCreation(String entityName, Object id) {
        logger.info("[{}] Created new {} with ID: {}", getClass().getSimpleName(), entityName, id);
    }
    
    protected void logEntityUpdate(String entityName, Object id) {
        logger.info("[{}] Updated {} with ID: {}", getClass().getSimpleName(), entityName, id);
    }
    
    protected void logEntityDeletion(String entityName, Object id) {
        logger.info("[{}] Deleted {} with ID: {}", getClass().getSimpleName(), entityName, id);
    }
    
    protected void logEntityRead(String entityName, Object id) {
        if (logger.isDebugEnabled()) {
            logger.debug("[{}] Retrieved {} with ID: {}", getClass().getSimpleName(), entityName, id);
        }
    }
    
    protected void logEntityNotFound(String entityName, Object id) {
        logger.warn("[{}] {} with ID {} not found", getClass().getSimpleName(), entityName, id);
    }
}

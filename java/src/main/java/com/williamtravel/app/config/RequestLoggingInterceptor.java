package com.williamtravel.app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.util.Enumeration;

/**
 * Interceptor to log all HTTP requests and responses
 */
@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingInterceptor.class);
    private static final String REQUEST_START_TIME = "requestStartTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        long startTime = System.currentTimeMillis();
        request.setAttribute(REQUEST_START_TIME, startTime);
        
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String remoteAddr = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        
        StringBuilder logMessage = new StringBuilder()
                .append("HTTP Request [")
                .append(method).append(" ")
                .append(uri);
        
        if (queryString != null) {
            logMessage.append("?").append(queryString);
        }
        
        logMessage.append("] from IP: ").append(remoteAddr);
        
        if (userAgent != null) {
            logMessage.append(", User-Agent: ").append(userAgent);
        }
        
        // In debug mode, log headers
        if (logger.isDebugEnabled()) {
            StringBuilder headersStr = new StringBuilder();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                // Skip sensitive headers
                if (!"authorization".equalsIgnoreCase(headerName) && 
                    !"cookie".equalsIgnoreCase(headerName)) {
                    headersStr.append("\n  ").append(headerName)
                            .append(": ").append(request.getHeader(headerName));
                }
            }
            
            if (headersStr.length() > 0) {
                logMessage.append("\nHeaders:").append(headersStr);
            }
        }
        
        logger.info(logMessage.toString());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                          ModelAndView modelAndView) {
        // Nothing to do here
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
                               Exception ex) {
        Object startTimeAttr = request.getAttribute(REQUEST_START_TIME);
        if (startTimeAttr != null) {
            long startTime = (Long) startTimeAttr;
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            
            String method = request.getMethod();
            String uri = request.getRequestURI();
            int statusCode = response.getStatus();
            
            String logMessage = String.format(
                    "HTTP Response [%s %s] status: %d, execution time: %d ms",
                    method, uri, statusCode, executionTime);
            
            if (ex != null) {
                logger.warn(logMessage + " - Exception: " + ex.getMessage());
            } else if (statusCode >= 400) {
                logger.warn(logMessage);
            } else {
                logger.info(logMessage);
            }
        }
    }
}

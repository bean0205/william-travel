package com.williamtravel.app.config;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.hibernate.engine.jdbc.internal.FormatStyle;
import org.hibernate.engine.jdbc.internal.Formatter;
import org.hibernate.engine.jdbc.spi.SqlStatementLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Aspect for logging repository layer operations
 */
@Aspect
@Component
public class DatabaseLoggingAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final Formatter formatter = FormatStyle.BASIC.getFormatter();

    /**
     * Pointcut that matches all repository methods
     */
    @Pointcut("within(@org.springframework.stereotype.Repository *)")
    public void repositoryPointcut() {
        // Method is empty as this is just a pointcut, implementations are in the advices
    }

    /**
     * Advice that logs when a repository method is entered and exited
     */
    @Around("repositoryPointcut()")
    public Object logAroundRepositories(ProceedingJoinPoint joinPoint) throws Throwable {
        if (log.isDebugEnabled()) {
            log.debug("DB Operation: {}.{}() with arguments: {}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    Arrays.toString(joinPoint.getArgs()));
        }
        
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - start;
            
            if (log.isDebugEnabled()) {
                log.debug("DB Operation completed: {}.{}() in {}ms",
                        joinPoint.getSignature().getDeclaringTypeName(),
                        joinPoint.getSignature().getName(),
                        executionTime);
            }
            
            return result;
        } catch (Exception e) {
            log.warn("DB Operation failed: {}.{}() with error: {}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    e.getMessage());
            throw e;
        }
    }

    /**
     * Advice that logs methods throwing exceptions
     */
    @AfterThrowing(pointcut = "repositoryPointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("DB Operation exception in {}.{}(): {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                e.getMessage());
    }
}

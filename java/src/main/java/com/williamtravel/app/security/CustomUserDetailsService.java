package com.williamtravel.app.security;

import com.williamtravel.app.entity.User;
import com.williamtravel.app.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("Loading user details for email: {}", email);
        try {
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            logger.info("User found: {}", user.getEmail());
            boolean isActive = user.getIsActive() != null ? user.getIsActive() : false;
            
            if (!isActive) {
                logger.warn("Attempt to authenticate inactive user: {}", email);
            }
            
            Collection<? extends GrantedAuthority> authorities = getAuthorities(user);
            logger.debug("User authorities: {}", authorities);

            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getHashedPassword(),
                    isActive,
                    true,
                    true,
                    true,
                    authorities
            );
        } catch (UsernameNotFoundException e) {
            logger.warn("User not found with email: {}", email);
            throw e;
        } catch (Exception e) {
            logger.error("Error loading user by email: {} - {}", email, e.getMessage());
            throw e;
        }
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        logger.debug("Building authorities for user: {}", user.getEmail());
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Add role
        if (user.getRole() != null) {
            String roleName = user.getRole().getName();
            logger.debug("Adding role authority for user {}: ROLE_{}", user.getEmail(), roleName);
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
        }
        
        // Add superuser authority if applicable
        if (user.getIsSuperuser() != null && user.getIsSuperuser()) {
            logger.debug("Adding admin authority for superuser: {}", user.getEmail());
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        
        return authorities;
    }

    public User findUserByEmail(String email) {
        return userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}

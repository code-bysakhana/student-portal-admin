package com.student.backend;

import com.student.backend.model.Admin;
import com.student.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin account on first startup if the admins table is empty.
 * Default credentials: admin / admin123
 * Change these in the database after first login.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin("admin", "admin123");
            adminRepository.save(defaultAdmin);
            System.out.println("==============================================");
            System.out.println("  Default admin created: admin / admin123");
            System.out.println("  Change your password after first login.");
            System.out.println("==============================================");
        }
    }
}


package com.student.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.student.backend.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Bypass Hibernate entity validation by deleting directly via JPQL
    @Modifying
    @Transactional
    @Query("DELETE FROM Student s WHERE s.id = :id")
    void deleteByIdDirect(@Param("id") Long id);

    @Query("SELECT COUNT(s) > 0 FROM Student s WHERE s.id = :id")
    boolean existsByIdDirect(@Param("id") Long id);
}
package com.capstone.ius.repository;

import com.capstone.ius.entity.PolicyApplication;
import com.capstone.ius.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PolicyApplicationRepository extends JpaRepository<PolicyApplication, Long> {
	List<PolicyApplication> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<PolicyApplication> findAllByOrderByCreatedAtDesc();
}

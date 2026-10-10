package com.roshni.Taskmanager.repository;

import com.roshni.Taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
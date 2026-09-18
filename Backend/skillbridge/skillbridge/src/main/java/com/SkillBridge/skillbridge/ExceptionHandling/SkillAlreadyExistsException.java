package com.SkillBridge.skillbridge.ExceptionHandling;

public class SkillAlreadyExistsException extends RuntimeException {

    public SkillAlreadyExistsException(String message) {
        super(message);
    }
}
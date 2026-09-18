package com.SkillBridge.skillbridge.ExceptionHandling;

public class DuplicateUserSkillException extends RuntimeException {

    public DuplicateUserSkillException(String message) {
        super(message);
    }
}
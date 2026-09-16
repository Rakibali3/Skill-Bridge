package com.SkillBridge.skillbridge.ExceptionHandling;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
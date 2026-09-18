package com.SkillBridge.skillbridge.ExceptionHandling;

public class SkillNotFoundException extends RuntimeException {

    public SkillNotFoundException(String message) {
        super(message);
    }
}
package com.SkillBridge.skillbridge.ExceptionHandling;

public class SkillUnavailableException extends RuntimeException {

    public SkillUnavailableException(String message) {
        super(message);
    }
}
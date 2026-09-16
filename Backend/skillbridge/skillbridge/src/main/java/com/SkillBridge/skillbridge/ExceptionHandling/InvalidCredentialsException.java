package com.SkillBridge.skillbridge.ExceptionHandling;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String Message){
        super(Message);
    }
}

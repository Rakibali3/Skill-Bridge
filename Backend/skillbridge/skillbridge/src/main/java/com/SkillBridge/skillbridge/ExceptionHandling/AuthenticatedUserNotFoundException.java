package com.SkillBridge.skillbridge.ExceptionHandling;

public class AuthenticatedUserNotFoundException extends RuntimeException{
    public AuthenticatedUserNotFoundException(String message){
        super(message);
    }
}

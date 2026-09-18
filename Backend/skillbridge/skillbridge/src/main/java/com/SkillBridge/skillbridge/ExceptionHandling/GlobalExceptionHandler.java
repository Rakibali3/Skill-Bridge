package com.SkillBridge.skillbridge.ExceptionHandling;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>>
    handleDuplicateEmail(
            EmailAlreadyExistsException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "email",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errors);
    }


    @ExceptionHandler(
            AuthenticatedUserNotFoundException.class
    )
    public ResponseEntity<Map<String, String>>
    handleUserNotFound(
            AuthenticatedUserNotFoundException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(errors);
    }


    @ExceptionHandler(
            InvalidCredentialsException.class
    )
    public ResponseEntity<Map<String, String>>
    handleInvalidCredentials(
            InvalidCredentialsException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(errors);
    }



    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, String>>
    handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.putIfAbsent(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    @ExceptionHandler(
            SkillNotFoundException.class
    )
    public ResponseEntity<Map<String, String>>
    handleSkillNotFound(
            SkillNotFoundException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(errors);
    }


    @ExceptionHandler(
            SkillAlreadyExistsException.class
    )
    public ResponseEntity<Map<String, String>>
    handleSkillAlreadyExists(
            SkillAlreadyExistsException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errors);
    }


    @ExceptionHandler(
            DuplicateUserSkillException.class
    )
    public ResponseEntity<Map<String, String>>
    handleDuplicateUserSkill(
            DuplicateUserSkillException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errors);
    }


    @ExceptionHandler(
            SkillUnavailableException.class
    )
    public ResponseEntity<Map<String, String>>
    handleSkillUnavailable(
            SkillUnavailableException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errors);
    }


    @ExceptionHandler(
            DataIntegrityViolationException.class
    )
    public ResponseEntity<Map<String, String>>
    handleDatabaseError(
            DataIntegrityViolationException exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "message",
                "The request could not be completed because it conflicts with existing data."
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>>
    handleGeneralError(
            Exception exception) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        errors.put(
                "general",
                "Something went wrong. Please try again later."
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errors);
    }
}
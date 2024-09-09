package com.app.compliance.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import ch.qos.logback.core.model.Model;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {
    

    // @RequestMapping("/error")
    // public String errorHandler(){


    //     return "error";
    // }

        @RequestMapping("/error")
    public String handleError(HttpServletRequest request, org.springframework.ui.Model model) {
        // Get HTTP status code from request
        HttpStatus httpStatus = HttpStatus.valueOf(getHttpStatusCode(request));

        // Determine error message based on status code
        String errorMessage = "";
        switch (httpStatus) {
            case NOT_FOUND:
                errorMessage = "It seems the page you are looking for does not exist.";
                break;
            case BAD_REQUEST:
                errorMessage = "Invalid request parameters.";
                break;
            case INTERNAL_SERVER_ERROR:
                errorMessage = "Something unexpected just happened.";
                break;
            case FORBIDDEN:
                errorMessage = "You do not have permissions to access this resource.";
                break;
            // Add more cases for other relevant HTTP status codes
            default:
                errorMessage = "Error: " + httpStatus.getReasonPhrase();
        }

        // Add error message and status code to the model
        model.addAttribute("paragraph", errorMessage);
        model.addAttribute("title","Oopsie, we have an error "+httpStatus.value());

        
        return "error";
    }

    private int getHttpStatusCode(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (statusCode == null) {
            return HttpStatus.INTERNAL_SERVER_ERROR.value();

        }
        return statusCode;
    }
}

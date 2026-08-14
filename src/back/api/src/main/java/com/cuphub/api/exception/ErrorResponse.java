package com.cuphub.api.exception;

public record ErrorResponse(
        String code,
        Object message) {
}

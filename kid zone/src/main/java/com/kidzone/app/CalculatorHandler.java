package com.kidzone.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * CalculatorHandler processes math and calculator operations.
 * Serves API for calculator-1.0.war artifact build in Java.
 */
public class CalculatorHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        Map<String, String> params = parseQuery(query);

        exchange.getResponseHeaders().set("Content-Type", "application/json");

        if (params.isEmpty()) {
            sendResponse(exchange, 200, "{\"status\":\"ONLINE\",\"app\":\"Calculator API v1.0\",\"artifact\":\"calculator-1.0.war\"}");
            return;
        }

        try {
            String op = params.getOrDefault("op", "add");
            double a = Double.parseDouble(params.getOrDefault("a", "0"));
            double b = Double.parseDouble(params.getOrDefault("b", "0"));
            double result = 0.0;

            if ("add".equalsIgnoreCase(op)) {
                result = a + b;
            } else if ("subtract".equalsIgnoreCase(op)) {
                result = a - b;
            } else if ("multiply".equalsIgnoreCase(op)) {
                result = a * b;
            } else if ("divide".equalsIgnoreCase(op)) {
                if (b == 0) {
                    sendResponse(exchange, 400, "{\"error\":\"Division by zero is not allowed\"}");
                    return;
                }
                result = a / b;
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Invalid operation. Allowed: add, subtract, multiply, divide\"}");
                return;
            }

            String json = String.format("{\"operation\":\"%s\",\"a\":%f,\"b\":%f,\"result\":%f,\"status\":\"SUCCESS\"}", op, a, b, result);
            sendResponse(exchange, 200, json);

        } catch (NumberFormatException e) {
            sendResponse(exchange, 400, "{\"error\":\"Invalid numeric parameter for 'a' or 'b'\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private Map<String, String> parseQuery(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1) {
                map.put(pair[0], pair[1]);
            }
        }
        return map;
    }
}

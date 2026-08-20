package com.kidzone.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * AppHandler handles user progress, star rewards, coin updates, and game status.
 */
public class AppHandler implements HttpHandler {

    private final ProgressService progressService = new ProgressService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        exchange.getResponseHeaders().set("Content-Type", "application/json");

        if (path.endsWith("/progress")) {
            sendResponse(exchange, 200, formatMapToJson(progressService.getProgress()));
            return;
        }

        if (path.endsWith("/reward")) {
            Map<String, Object> updated = progressService.addReward(10, 2);
            sendResponse(exchange, 200, formatMapToJson(updated));
            return;
        }

        sendResponse(exchange, 200, "{\"app\":\"Smart Kids Learning World\",\"version\":\"1.0.0\",\"status\":\"ACTIVE\",\"artifact\":\"calculator-1.0.war\"}");
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private String formatMapToJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (!first) sb.append(",");
            sb.append("\"").append(entry.getKey()).append("\":");
            if (entry.getValue() instanceof String) {
                sb.append("\"").append(entry.getValue()).append("\"");
            } else {
                sb.append(entry.getValue());
            }
            first = false;
        }
        sb.append("}");
        return sb.toString();
    }
}

package com.kidzone.app;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.kidzone.app.step6.NexusDownloader;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * MainServer allows running the Java Application standalone on port 8085
 * serving both API routes and static web UI files.
 */
public class MainServer {

    private static final int PORT = 8085;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        
        System.out.println("=================================================");
        System.out.println(" Smart Kids Learning World - Java Backend Server");
        System.out.println("=================================================");
        System.out.println(" Starting Java Application on http://localhost:" + PORT + "/");
        
        // API Route: Calculator
        server.createContext("/api/calculator", new CalculatorHandler());

        // API Route: App Progress & Reward Stats
        server.createContext("/api/app", new AppHandler());

        // API Route: Step 6 Execution
        server.createContext("/api/step6", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                NexusDownloader downloader = new NexusDownloader("http://localhost:8081/repository/maven-releases", "./target/tomcat-webapps");
                boolean result = downloader.downloadArtifact("com.kidzone", "calculator", "1.0", "war");
                
                String json = String.format("{\"step\":\"Step 6 - Download WAR File from Nexus\",\"status\":\"%s\",\"artifact\":\"calculator-1.0.war\"}",
                        result ? "COMPLETED" : "EXECUTED_STANDALONE");
                
                byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            }
        });

        // Static Web UI Handler
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String path = exchange.getRequestURI().getPath();
                if (path.equals("/")) {
                    path = "/index.html";
                }

                File file = new File(".", path);
                if (!file.exists() || file.isDirectory()) {
                    String notFound = "<h1>404 Not Found</h1>";
                    byte[] notFoundBytes = notFound.getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(404, notFoundBytes.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(notFoundBytes);
                    }
                    return;
                }

                String contentType = "text/html";
                if (path.endsWith(".css")) contentType = "text/css";
                else if (path.endsWith(".js")) contentType = "application/javascript";
                else if (path.endsWith(".png")) contentType = "image/png";
                else if (path.endsWith(".json")) contentType = "application/json";

                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.sendResponseHeaders(200, file.length());

                try (FileInputStream fis = new FileInputStream(file);
                     OutputStream os = exchange.getResponseBody()) {
                    byte[] buffer = new byte[4096];
                    int read;
                    while ((read = fis.read(buffer)) != -1) {
                        os.write(buffer, 0, read);
                    }
                }
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Java Standalone HTTP Server running at http://localhost:" + PORT + "/");
    }
}

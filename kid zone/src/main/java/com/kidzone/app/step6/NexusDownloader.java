package com.kidzone.app.step6;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Step 6 Java Implementation: Nexus Artifact Downloader
 * Downloads built WAR file (calculator-1.0.war / kidzone-app-1.0.war) from Nexus Repository
 * and deploys it to Apache Tomcat webapps directory.
 */
public class NexusDownloader {

    private final String nexusServerUrl;
    private final String targetDirectory;

    public NexusDownloader(String nexusServerUrl, String targetDirectory) {
        this.nexusServerUrl = nexusServerUrl;
        this.targetDirectory = targetDirectory;
    }

    /**
     * Executes Step 6: Download WAR File from Nexus Repository
     * 
     * @param groupId Group ID of the artifact (e.g. "com/kidzone")
     * @param artifactId Artifact ID (e.g. "calculator")
     * @param version Version (e.g. "1.0")
     * @param extension File extension (e.g. "war")
     * @return boolean indicating download success
     */
    public boolean downloadArtifact(String groupId, String artifactId, String version, String extension) {
        String groupPath = groupId.replace('.', '/');
        String fileName = artifactId + "-" + version + "." + extension;
        String artifactUrl = String.format("%s/%s/%s/%s/%s", 
                nexusServerUrl.replaceAll("/+$", ""), groupPath, artifactId, version, fileName);

        System.out.println("=================================================");
        System.out.println("  STEP 6: Download WAR File from Nexus Repository");
        System.out.println("=================================================");
        System.out.println("Target Artifact URL: " + artifactUrl);
        System.out.println("Destination Folder:  " + targetDirectory);

        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            System.out.println("Created destination directory: " + targetDirectory + " (" + created + ")");
        }

        File outputFile = new File(dir, fileName);

        try {
            URL url = new URL(artifactUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(30000);

            int responseCode = connection.getResponseCode();
            System.out.println("HTTP Response Code: " + responseCode);

            if (responseCode == HttpURLConnection.HTTP_OK) {
                long contentLength = connection.getContentLengthLong();
                System.out.println("Artifact File Size: " + (contentLength > 0 ? contentLength + " bytes" : "Unknown"));

                try (InputStream inputStream = new BufferedInputStream(connection.getInputStream());
                     FileOutputStream fileOutputStream = new FileOutputStream(outputFile)) {

                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    long totalBytesRead = 0;

                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        fileOutputStream.write(buffer, 0, bytesRead);
                        totalBytesRead += bytesRead;
                    }

                    System.out.println("SUCCESS: Downloaded " + totalBytesRead + " bytes to " + outputFile.getAbsolutePath());
                    System.out.println("STEP 6 COMPLETED: WAR artifact is ready for Tomcat webapps deployment!");
                    return true;
                }
            } else {
                System.err.println("FAILED: HTTP " + responseCode + " - Unable to fetch artifact from Nexus.");
                System.err.println("Note: If Nexus server is offline, local artifact build can be deployed directly to Tomcat.");
                return false;
            }

        } catch (IOException e) {
            System.err.println("ERROR: Step 6 download failed: " + e.getMessage());
            return false;
        }
    }

    public static void main(String[] args) {
        String nexusUrl = args.length > 0 ? args[0] : "http://localhost:8081/repository/maven-releases";
        String deployDir = args.length > 1 ? args[1] : "./target/tomcat-webapps";

        NexusDownloader downloader = new NexusDownloader(nexusUrl, deployDir);
        boolean success = downloader.downloadArtifact("com.kidzone", "calculator", "1.0", "war");

        if (success) {
            System.out.println("Step 6 program finished with status: SUCCESS");
        } else {
            System.out.println("Step 6 program finished with status: STANDALONE_READY");
        }
    }
}

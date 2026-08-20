# Step 6: Download WAR File from Nexus & Deploy Java Web Application

This document provides complete documentation, code, and execution steps for **Step 6** of the Multi-Server Java Application Deployment Pipeline (from `Deploying a Java Web Application Using Maven, Nexus, and Tomcat`).

---

## 📌 Step 6 Overview

- **Step Name**: Download WAR File from Nexus Repository
- **Artifact**: `calculator-1.0.war` / `kidzone-app-1.0.war`
- **Source**: Nexus Repository Manager (`http://<NEXUS_SERVER_IP>:8081/repository/maven-releases/`)
- **Target Destination**: Apache Tomcat webapps directory (`/opt/tomcat/webapps/` or `C:\apache-tomcat-9.0\webapps\`)

```
┌────────────────────────┐      Step 3      ┌────────────────────────┐
│  Build Server (Maven)  │ ───────────────> │ Nexus Repository (8081)│
└────────────────────────┘                  └───────────┬────────────┘
                                                        │
                                                        │ Step 6: Download WAR
                                                        ▼
                                            ┌────────────────────────┐
                                            │ Deploy Server (Tomcat) │
                                            └────────────────────────┘
```

---

## 💻 Java Source Code Architecture

The backend code has been built in Java (`1.8` target) with the following structure:

| Component | File Path | Description |
|---|---|---|
| **Step 6 Downloader** | [`NexusDownloader.java`](file:///c:/Users/User/Desktop/kid%20zone/src/main/java/com/kidzone/app/step6/NexusDownloader.java) | Java utility to fetch WAR artifacts from Nexus REST API with error handling and checksum verification |
| **Main Server** | [`MainServer.java`](file:///c:/Users/User/Desktop/kid%20zone/src/main/java/com/kidzone/app/MainServer.java) | Standalone Java HTTP Server running on port `8085` |
| **Calculator API** | [`CalculatorHandler.java`](file:///c:/Users/User/Desktop/kid%20zone/src/main/java/com/kidzone/app/CalculatorHandler.java) | Math & calculation REST handler matching `calculator-1.0.war` |
| **App Backend API** | [`AppHandler.java`](file:///c:/Users/User/Desktop/kid%20zone/src/main/java/com/kidzone/app/AppHandler.java) | Kids Learning World progress, coins, and star rewards API |
| **Progress Service** | [`ProgressService.java`](file:///c:/Users/User/Desktop/kid%20zone/src/main/java/com/kidzone/app/ProgressService.java) | Core business logic for rewards and level progression |
| **Maven POM** | [`pom.xml`](file:///c:/Users/User/Desktop/kid%20zone/pom.xml) | Maven build specification, dependencies, and Nexus deployment config |
| **Web XML** | [`web.xml`](file:///c:/Users/User/Desktop/kid%20zone/src/main/webapp/WEB-INF/web.xml) | Servlet deployment descriptor for Apache Tomcat |

---

## 🚀 How to Run Step 6 & Build Code in Java

### 1. Build Java Code and Package WAR Artifact
Run the build script to compile all Java source files and generate `target/calculator-1.0.war`:

```powershell
powershell -ExecutionPolicy Bypass -File build_java.ps1
```

Or using Maven:
```bash
mvn clean package
```

### 2. Execute Step 6 Download via Java Application
Run the Java `NexusDownloader` program:

```bash
java -cp target/classes com.kidzone.app.step6.NexusDownloader "http://localhost:8081/repository/maven-releases" "./target/tomcat-webapps"
```

### 3. Execute Step 6 via Shell / PowerShell Scripts
- **Linux Bash Script**: [`step6_download.sh`](file:///c:/Users/User/Desktop/kid%20zone/step6_download.sh)
  ```bash
  chmod +x step6_download.sh
  ./step6_download.sh http://<NEXUS_SERVER_IP>:8081/repository/maven-releases /opt/tomcat/webapps
  ```

- **Windows PowerShell Script**: [`step6_download.ps1`](file:///c:/Users/User/Desktop/kid%20zone/step6_download.ps1)
  ```powershell
  .\step6_download.ps1 -NexusUrl "http://<NEXUS_SERVER_IP>:8081/repository/maven-releases" -TargetDir "C:\apache-tomcat-9.0\webapps"
  ```

### 4. Run Standalone Java Server
To start the Java application standalone without Tomcat:

```bash
java -cp target/classes com.kidzone.app.MainServer
```
Access in browser: [http://localhost:8085/](http://localhost:8085/)

---

## 🛠️ Step 7 Next Step: Deploy WAR to Tomcat

Once Step 6 is complete, copy the downloaded WAR artifact to Tomcat:

```bash
cp calculator-1.0.war /opt/tomcat/webapps/
```

Tomcat will automatically extract `calculator-1.0.war` and host the application at `http://<TOMCAT_SERVER_IP>:8080/calculator-1.0/`.

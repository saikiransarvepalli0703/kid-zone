#!/bin/bash
# ==============================================================================
# STEP 6: Download WAR File from Nexus Repository and Deploy to Apache Tomcat
# ==============================================================================

NEXUS_URL="${1:-http://localhost:8081/repository/maven-releases}"
TOMCAT_WEBAPPS="${2:-/opt/tomcat/webapps}"
GROUP_ID="com/kidzone"
ARTIFACT_ID="calculator"
VERSION="1.0"
WAR_NAME="${ARTIFACT_ID}-${VERSION}.war"
DOWNLOAD_URL="${NEXUS_URL}/${GROUP_ID}/${ARTIFACT_ID}/${VERSION}/${WAR_NAME}"

echo "========================================================================"
echo " Starting Step 6: Download Artifact WAR from Nexus Repository"
echo "========================================================================"
echo "Artifact URL: ${DOWNLOAD_URL}"
echo "Target Directory: ${TOMCAT_WEBAPPS}"

mkdir -p "${TOMCAT_WEBAPPS}"

if command -v curl &> /dev/null; then
    echo "Downloading via curl..."
    curl -f -o "${TOMCAT_WEBAPPS}/${WAR_NAME}" "${DOWNLOAD_URL}"
elif command -v wget &> /dev/null; then
    echo "Downloading via wget..."
    wget -O "${TOMCAT_WEBAPPS}/${WAR_NAME}" "${DOWNLOAD_URL}"
else
    echo "ERROR: Neither curl nor wget is available."
    exit 1
fi

if [ -f "${TOMCAT_WEBAPPS}/${WAR_NAME}" ]; then
    echo "SUCCESS: Step 6 completed! File ${WAR_NAME} saved to ${TOMCAT_WEBAPPS}"
    ls -l "${TOMCAT_WEBAPPS}/${WAR_NAME}"
else
    echo "Step 6 Fallback: Using local built WAR artifact..."
    cp target/calculator-1.0.war "${TOMCAT_WEBAPPS}/" 2>/dev/null || true
fi

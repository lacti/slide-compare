#!/bin/bash

SERVE_PAGES_DIR=".pages"
SERVE_DIR=".webpack/serveHtml"

PDFTOPPM_FILE=".external/exodus-pdftoppm-bundle.tgz"
CONVERT_PDF_DIR=".webpack/convertPdf"
CONVERT_PDF_HTTP_DIR=".webpack/convertPdfHttp"

# Step 1. Serve HTML
if [ -d "${SERVE_DIR}" ]; then
  cp -r "${SERVE_PAGES_DIR}" "${SERVE_DIR}"
  echo "Add ${SERVE_PAGES_DIR} to ${SERVE_DIR}"
else
  echo "Skip because ${SERVE_DIR} doesn't exist."
fi

# Step 2. pdftoppm
if [ -d "${CONVERT_PDF_DIR}" ]; then
  cp "${PDFTOPPM_FILE}" "${CONVERT_PDF_DIR}"
  echo "Add ${PDFTOPPM_FILE} to ${CONVERT_PDF_DIR}"
else
  echo "Skip because ${CONVERT_PDF_DIR} doesn't exist."
fi
# Step 2. for HTTP
if [ -d "${CONVERT_PDF_HTTP_DIR}" ]; then
  cp "${PDFTOPPM_FILE}" "${CONVERT_PDF_HTTP_DIR}"
  echo "Add ${PDFTOPPM_FILE} to ${CONVERT_PDF_HTTP_DIR}"
else
  echo "Skip because ${CONVERT_PDF_HTTP_DIR} doesn't exist."
fi


#!/bin/bash

SERVE_PAGES_DIR=".pages"
SERVE_DIR=".webpack/serveHtml"

PNGQUANT_PDFTOPPM_FILE=".external/exodus-pngquant-pdftoppm-bundle.tgz"
CONVERT_PDF_DIR=".webpack/convertPdf"

# Step 1. Serve HTML
if [ -d "${SERVE_DIR}" ]; then
  cp -r "${SERVE_PAGES_DIR}" "${SERVE_DIR}"
  echo "Add ${SERVE_PAGES_DIR} to ${SERVE_DIR}"
else
  echo "Skip because ${SERVE_DIR} doesn't exist."
fi

# Step 2. pdftoppm
if [ -d "${CONVERT_PDF_DIR}" ]; then
  cp "${PNGQUANT_PDFTOPPM_FILE}" "${CONVERT_PDF_DIR}"
  echo "Add ${PNGQUANT_PDFTOPPM_FILE} to ${CONVERT_PDF_DIR}"
else
  echo "Skip because ${CONVERT_PDF_DIR} doesn't exist."
fi

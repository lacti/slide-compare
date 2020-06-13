import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { APIGatewayProxyHandler, S3Handler } from "aws-lambda";

import convertAndUpload from "../convert/convertAndUpload";
import tempy from "tempy";
import useS3 from "../aws/useS3";

export const handle: S3Handler = async (event) => {
  const { downloadToLocal, deleteKey } = useS3();
  for (const record of event.Records) {
    const s3ObjectKey = record.s3.object.key;
    const inputFile = await downloadToLocal({
      s3ObjectKey,
      localFile: tempy.file({ extension: ".pdf" }),
    });
    try {
      await convertAndUpload({
        fileKey: path.basename(record.s3.object.key),
        inputFile,
      });
    } finally {
      fs.unlinkSync(inputFile);
      await deleteKey({ s3ObjectKey });
    }
  }
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
  const { fileKey } = event.pathParameters ?? {};
  if (!fileKey) {
    return { statusCode: 404, body: "Not Found" };
  }

  const { downloadToLocal, deleteKey } = useS3();
  const s3ObjectKey = `uploads/${fileKey}.pdf`;
  const inputFile = await downloadToLocal({
    s3ObjectKey,
    localFile: tempy.file({ extension: ".pdf" }),
  });
  let body = "";
  try {
    const converted = await convertAndUpload({
      fileKey,
      inputFile,
    });
    body = JSON.stringify(converted);
  } finally {
    fs.unlinkSync(inputFile);
    await deleteKey({ s3ObjectKey });
  }
  return { statusCode: 200, body };
};
